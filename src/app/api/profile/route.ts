import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const updateProfileSchema = z.object({
  display_name: z.string().min(1).max(40).optional().or(z.literal("")),
  bio: z.string().max(240).optional().or(z.literal("")),
  profile_accent: z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
    .optional()
    .or(z.literal("")),
});

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.sub },
      select: {
        id: true,
        kick_user_id: true,
        kick_username: true,
        email: true,
        avatar: true,
        points: true,
        display_name: true,
        bio: true,
        profile_accent: true,
        isAdmin: true,
        isKickBroadcaster: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("GET /api/profile failed", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = updateProfileSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const updatedUser = await prisma.user.update({
      where: { id: session.sub },
      data: {
        display_name:
          data.display_name === undefined
            ? undefined
            : data.display_name.trim() || null,
        bio: data.bio === undefined ? undefined : data.bio.trim() || null,
        profile_accent:
          data.profile_accent === undefined
            ? undefined
            : data.profile_accent.trim() || null,
      },
      select: {
        id: true,
        kick_user_id: true,
        kick_username: true,
        email: true,
        avatar: true,
        points: true,
        display_name: true,
        bio: true,
        profile_accent: true,
        isAdmin: true,
        isKickBroadcaster: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("PATCH /api/profile failed", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}