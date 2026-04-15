import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

function toTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "site-settings" },
    update: {},
    create: {
      id: "site-settings",
      kickUrl: "https://kick.com/dirtygunner",
      discordUrl: "",
      youtubeUrl: "",
      xUrl: "",
      instagramUrl: "",
    },
  });

  return NextResponse.json({
    settings: {
      kickUrl: settings.kickUrl,
      discordUrl: settings.discordUrl ?? "",
      youtubeUrl: settings.youtubeUrl ?? "",
      xUrl: settings.xUrl ?? "",
      instagramUrl: settings.instagramUrl ?? "",
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

  const kickUrl = toTrimmedString(body.kickUrl);
  const discordUrl = toTrimmedString(body.discordUrl);
  const youtubeUrl = toTrimmedString(body.youtubeUrl);
  const xUrl = toTrimmedString(body.xUrl);
  const instagramUrl = toTrimmedString(body.instagramUrl);

  if (!kickUrl) {
    return NextResponse.json(
      { error: "Kick URL is required" },
      { status: 400 },
    );
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "site-settings" },
    update: {
      kickUrl,
      discordUrl,
      youtubeUrl,
      xUrl,
      instagramUrl,
    },
    create: {
      id: "site-settings",
      kickUrl,
      discordUrl,
      youtubeUrl,
      xUrl,
      instagramUrl,
    },
  });

  return NextResponse.json({
    settings: {
      kickUrl: settings.kickUrl,
      discordUrl: settings.discordUrl ?? "",
      youtubeUrl: settings.youtubeUrl ?? "",
      xUrl: settings.xUrl ?? "",
      instagramUrl: settings.instagramUrl ?? "",
    },
  });
}