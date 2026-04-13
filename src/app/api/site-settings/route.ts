import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "site-settings" },
    update: {},
    create: {
      id: "site-settings",
      kickUrl: "https://kick.com/dirtygunner",
      discordUrl: "",
      youtubeUrl: "",
    },
  });

  return NextResponse.json({
    settings: {
      kickUrl: settings.kickUrl,
      discordUrl: settings.discordUrl ?? "",
      youtubeUrl: settings.youtubeUrl ?? "",
    },
  });
}

export async function PUT(req: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const kickUrl =
    typeof body.kickUrl === "string" ? body.kickUrl.trim() : "";
  const discordUrl =
    typeof body.discordUrl === "string" ? body.discordUrl.trim() : "";
  const youtubeUrl =
    typeof body.youtubeUrl === "string" ? body.youtubeUrl.trim() : "";

  if (!kickUrl) {
    return NextResponse.json(
      { error: "Kick URL is required" },
      { status: 400 }
    );
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "site-settings" },
    update: {
      kickUrl,
      discordUrl,
      youtubeUrl,
    },
    create: {
      id: "site-settings",
      kickUrl,
      discordUrl,
      youtubeUrl,
    },
  });

  return NextResponse.json({
    settings: {
      kickUrl: settings.kickUrl,
      discordUrl: settings.discordUrl ?? "",
      youtubeUrl: settings.youtubeUrl ?? "",
    },
  });
}