import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null });
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
      isAdmin: true,
    },
  });

  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      kickUserId: user.kick_user_id,
      kickUsername: user.kick_username,
      email: user.email,
      avatar: user.avatar,
      points: user.points,
      isAdmin: user.isAdmin,
    },
  });
}