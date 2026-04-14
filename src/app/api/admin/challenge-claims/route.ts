import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

class HttpError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

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

function formatUserLabel(user: {
  id: string;
  display_name: string | null;
  kick_username: string | null;
}) {
  return (
    user.display_name ||
    user.kick_username ||
    `User ${user.id.slice(0, 8)}`
  );
}

export async function GET() {
  try {
    await requireAdmin();

    const claims = await prisma.challengeClaim.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            display_name: true,
            kick_username: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            display_name: true,
            kick_username: true,
          },
        },
      },
    });

    return NextResponse.json(
      claims.map((claim) => ({
        id: claim.id,
        challengeId: claim.challengeId,
        challengeTitle: claim.challenge.title,
        userId: claim.userId,
        userLabel: formatUserLabel(claim.user),
        proofImageUrl: claim.proofImageUrl,
        note: claim.note,
        status: claim.status,
        rejectionReason: claim.rejectionReason,
        reviewedAt: claim.reviewedAt?.toISOString() ?? null,
        reviewedByLabel: claim.reviewedBy
          ? formatUserLabel(claim.reviewedBy)
          : null,
        createdAt: claim.createdAt.toISOString(),
        updatedAt: claim.updatedAt.toISOString(),
      })),
    );
  } catch (error) {
    console.error("Failed to load challenge claims:", error);

    const status = error instanceof HttpError ? error.status : 500;

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load challenge claims",
      },
      { status },
    );
  }
}