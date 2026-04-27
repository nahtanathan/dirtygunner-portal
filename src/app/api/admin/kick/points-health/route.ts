import { NextResponse } from "next/server";

import {
  ensureKickPointSubscriptionsForBroadcaster,
  getKickPointHealthSnapshot,
} from "@/lib/kick/events";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();

  if (!session?.sub) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      isAdmin: true,
    },
  });

  if (!user?.isAdmin) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { user };
}

export async function GET() {
  try {
    const auth = await requireAdmin();

    if ("error" in auth) {
      return auth.error;
    }

    const health = await getKickPointHealthSnapshot();

    return NextResponse.json({
      ok: true,
      health,
    });
  } catch (error) {
    console.error("GET /api/admin/kick/points-health failed", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const auth = await requireAdmin();

    if ("error" in auth) {
      return auth.error;
    }

    const result = await ensureKickPointSubscriptionsForBroadcaster();
    const health = await getKickPointHealthSnapshot();

    return NextResponse.json({
      ok: true,
      reconciled: result,
      health,
    });
  } catch (error) {
    console.error("POST /api/admin/kick/points-health failed", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
