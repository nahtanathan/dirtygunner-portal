import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { Prisma } from "@/generated/prisma";

class HttpError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

type ParsedBackfillRow = {
  rowNumber: number;
  kickUserId: string | null;
  kickUsername: string | null;
  points: number;
  lookupKey: string;
};

type BackfillPreviewRow = {
  rowNumber: number;
  kickUserId: string | null;
  kickUsername: string | null;
  points: number;
  status:
    | "create"
    | "update"
    | "skip"
    | "duplicate_in_batch"
    | "already_imported";
  reason: string | null;
  userId: string | null;
  currentPoints: number | null;
  resultingPoints: number | null;
};

async function requireAdmin() {
  const session = await getSession();

  if (!session?.sub) {
    throw new HttpError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      isAdmin: true,
    },
  });

  if (!user?.isAdmin) {
    throw new HttpError("Forbidden", 403);
  }

  return user;
}

function normalizeCell(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function detectDelimiter(line: string) {
  return line.includes("\t") ? "\t" : ",";
}

function splitDelimitedLine(line: string, delimiter: string) {
  return line
    .split(delimiter)
    .map((part) => part.trim())
    .filter((part, index, parts) => {
      return index < parts.length;
    });
}

function parseBackfillRows(input: string) {
  const rawLines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));

  if (rawLines.length === 0) {
    throw new HttpError("Paste at least one backfill row.");
  }

  const delimiter = detectDelimiter(rawLines[0]);
  const firstColumns = splitDelimitedLine(rawLines[0], delimiter).map((column) =>
    column.toLowerCase(),
  );

  const hasHeader =
    firstColumns.includes("kick_user_id") ||
    firstColumns.includes("kickusername") ||
    firstColumns.includes("kick_username") ||
    firstColumns.includes("points");

  const headerColumns = hasHeader ? firstColumns : ["kick_user_id", "kick_username", "points"];
  const startIndex = hasHeader ? 1 : 0;

  const kickUserIdIndex = headerColumns.findIndex((column) => column === "kick_user_id");
  const kickUsernameIndex = headerColumns.findIndex(
    (column) => column === "kick_username" || column === "kickusername",
  );
  const pointsIndex = headerColumns.findIndex((column) => column === "points");

  if (pointsIndex === -1) {
    throw new HttpError(
      "The import must include a `points` column. Supported headers: kick_user_id,kick_username,points",
    );
  }

  const rows: ParsedBackfillRow[] = [];

  for (let index = startIndex; index < rawLines.length; index += 1) {
    const sourceLine = rawLines[index];
    const columns = splitDelimitedLine(sourceLine, delimiter);
    const rowNumber = index + 1;
    const kickUserId = normalizeCell(
      kickUserIdIndex >= 0 ? columns[kickUserIdIndex] : columns[0],
    );
    const kickUsername = normalizeCell(
      kickUsernameIndex >= 0
        ? columns[kickUsernameIndex]
        : kickUserIdIndex === -1
          ? columns[0]
          : columns[1],
    );
    const pointsRaw = normalizeCell(columns[pointsIndex]);
    const parsedPoints = Number(pointsRaw);

    if (!kickUserId && !kickUsername) {
      throw new HttpError(
        `Row ${rowNumber} must include either kick_user_id or kick_username.`,
      );
    }

    if (!Number.isFinite(parsedPoints) || parsedPoints <= 0) {
      throw new HttpError(`Row ${rowNumber} has an invalid points value.`);
    }

    const lookupKey = kickUserId
      ? `kick_user_id:${kickUserId}`
      : `kick_username:${kickUsername!.toLowerCase()}`;

    rows.push({
      rowNumber,
      kickUserId,
      kickUsername,
      points: Math.floor(parsedPoints),
      lookupKey,
    });
  }

  return rows;
}

async function resolveBackfillRow(row: ParsedBackfillRow, batchLabel: string) {
  const dedupeKey = `manual.backfill:${batchLabel}:${row.lookupKey}`;
  const existingImport = await prisma.kickEventReceipt.findUnique({
    where: { dedupe_key: dedupeKey },
    select: {
      id: true,
    },
  });

  if (existingImport) {
    return {
      status: "already_imported" as const,
      reason: "This row was already imported for the same batch label.",
      dedupeKey,
      user: null,
    };
  }

  if (row.kickUserId) {
    const user = await prisma.user.findUnique({
      where: { kick_user_id: row.kickUserId },
      select: {
        id: true,
        points: true,
        kick_user_id: true,
        kick_username: true,
      },
    });

    return {
      status: user ? ("update" as const) : ("create" as const),
      reason: user ? null : "A new site user will be created from kick_user_id.",
      dedupeKey,
      user,
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      kick_username: {
        equals: row.kickUsername!,
        mode: "insensitive",
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      points: true,
      kick_user_id: true,
      kick_username: true,
    },
  });

  if (!user) {
    return {
      status: "skip" as const,
      reason:
        "Username-only rows can only match existing site users. Add kick_user_id to create new users safely.",
      dedupeKey,
      user: null,
    };
  }

  return {
    status: "update" as const,
    reason: null,
    dedupeKey,
    user,
  };
}

async function buildPreview(batchLabel: string, rows: ParsedBackfillRow[]) {
  const seenKeys = new Set<string>();
  const previewRows: BackfillPreviewRow[] = [];

  for (const row of rows) {
    if (seenKeys.has(row.lookupKey)) {
      previewRows.push({
        rowNumber: row.rowNumber,
        kickUserId: row.kickUserId,
        kickUsername: row.kickUsername,
        points: row.points,
        status: "duplicate_in_batch",
        reason: "This user appears more than once in the pasted batch.",
        userId: null,
        currentPoints: null,
        resultingPoints: null,
      });
      continue;
    }

    seenKeys.add(row.lookupKey);

    const resolution = await resolveBackfillRow(row, batchLabel);
    const currentPoints = resolution.user?.points ?? (resolution.status === "create" ? 0 : null);

    previewRows.push({
      rowNumber: row.rowNumber,
      kickUserId: row.kickUserId,
      kickUsername: row.kickUsername,
      points: row.points,
      status: resolution.status,
      reason: resolution.reason,
      userId: resolution.user?.id ?? null,
      currentPoints,
      resultingPoints:
        typeof currentPoints === "number" &&
        (resolution.status === "create" || resolution.status === "update")
          ? currentPoints + row.points
          : null,
    });
  }

  return previewRows;
}

function summarizePreview(rows: BackfillPreviewRow[]) {
  return rows.reduce(
    (summary, row) => {
      summary.totalRows += 1;

      if (row.status === "create" || row.status === "update") {
        summary.readyRows += 1;
        summary.totalPoints += row.points;
      } else {
        summary.skippedRows += 1;
      }

      return summary;
    },
    {
      totalRows: 0,
      readyRows: 0,
      skippedRows: 0,
      totalPoints: 0,
    },
  );
}

type BackfillRequestBody = {
  batchLabel?: string;
  rowsText?: string;
  dryRun?: boolean;
};

export async function GET() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { kick_user_id: { not: null } },
          { kick_username: { not: null } },
        ],
      },
      orderBy: [
        { kick_username: "asc" },
        { createdAt: "asc" },
      ],
      select: {
        id: true,
        kick_user_id: true,
        kick_username: true,
        points: true,
      },
    });

    return NextResponse.json({
      ok: true,
      users,
    });
  } catch (error) {
    console.error("Failed to load backfill roster:", error);

    const status = error instanceof HttpError ? error.status : 500;

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load backfill roster",
      },
      { status },
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = (await req.json()) as BackfillRequestBody;
    const batchLabel = body.batchLabel?.trim();
    const rowsText = body.rowsText ?? "";
    const dryRun = body.dryRun !== false;

    if (!batchLabel) {
      throw new HttpError("Batch label is required.");
    }

    const rows = parseBackfillRows(rowsText);
    const previewRows = await buildPreview(batchLabel, rows);
    const summary = summarizePreview(previewRows);

    if (dryRun) {
      return NextResponse.json({
        ok: true,
        dryRun: true,
        summary,
        rows: previewRows,
      });
    }

    const executableRows = previewRows.filter(
      (row) => row.status === "create" || row.status === "update",
    );

    for (const row of executableRows) {
      const sourceRow = rows.find((item) => item.rowNumber === row.rowNumber);

      if (!sourceRow) {
        continue;
      }

      const dedupeKey = `manual.backfill:${batchLabel}:${sourceRow.lookupKey}`;

      await prisma.$transaction(async (tx) => {
        if (sourceRow.kickUserId) {
          const existingUser = await tx.user.findUnique({
            where: { kick_user_id: sourceRow.kickUserId },
            select: {
              id: true,
              kick_user_id: true,
            },
          });

          const user =
            existingUser ??
            (await tx.user.create({
              data: {
                kick_user_id: sourceRow.kickUserId,
                kick_username: sourceRow.kickUsername,
                points: 0,
              },
              select: {
                id: true,
              },
            }));

          await tx.user.update({
            where: { id: user.id },
            data: {
              kick_username: sourceRow.kickUsername ?? undefined,
              points: {
                increment: sourceRow.points,
              },
            },
          });

          await tx.kickEventReceipt.create({
            data: {
              kick_message_id: dedupeKey,
              dedupe_key: dedupeKey,
              event_type: "manual.backfill",
              kick_user_id: sourceRow.kickUserId,
              kick_username: sourceRow.kickUsername,
              points_awarded: sourceRow.points,
              payload: {
                batchLabel,
                rowNumber: sourceRow.rowNumber,
                kick_user_id: sourceRow.kickUserId,
                kick_username: sourceRow.kickUsername,
                points: sourceRow.points,
              } as Prisma.InputJsonValue,
            },
          });

          return;
        }

        const existingUser = await tx.user.findFirst({
          where: {
            kick_username: {
              equals: sourceRow.kickUsername!,
              mode: "insensitive",
            },
          },
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
          },
        });

        if (!existingUser) {
          return;
        }

        await tx.user.update({
          where: { id: existingUser.id },
          data: {
            points: {
              increment: sourceRow.points,
            },
          },
        });

        await tx.kickEventReceipt.create({
          data: {
            kick_message_id: dedupeKey,
            dedupe_key: dedupeKey,
            event_type: "manual.backfill",
            kick_username: sourceRow.kickUsername,
            points_awarded: sourceRow.points,
            payload: {
              batchLabel,
              rowNumber: sourceRow.rowNumber,
              kick_username: sourceRow.kickUsername,
              points: sourceRow.points,
            } as Prisma.InputJsonValue,
          },
        });
      });
    }

    return NextResponse.json({
      ok: true,
      dryRun: false,
      summary,
      rows: previewRows,
      appliedRows: executableRows.length,
    });
  } catch (error) {
    console.error("Failed to run points backfill:", error);

    const status = error instanceof HttpError ? error.status : 500;

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to run points backfill",
      },
      { status },
    );
  }
}
