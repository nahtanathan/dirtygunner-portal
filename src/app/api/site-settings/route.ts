import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

function toTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

const DEFAULT_SITE_SETTINGS = {
  id: "site-settings",
  kickUrl: "https://kick.com/dirtygunner",
  discordUrl: "",
  youtubeUrl: "",
  xUrl: "",
  instagramUrl: "",
};

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: DEFAULT_SITE_SETTINGS.id },
    });

    if (!settings) {
      return NextResponse.json({
        settings: {
          kickUrl: DEFAULT_SITE_SETTINGS.kickUrl,
          discordUrl: DEFAULT_SITE_SETTINGS.discordUrl,
          youtubeUrl: DEFAULT_SITE_SETTINGS.youtubeUrl,
          xUrl: DEFAULT_SITE_SETTINGS.xUrl,
          instagramUrl: DEFAULT_SITE_SETTINGS.instagramUrl,
        },
      });
    }

    return NextResponse.json({
      settings: {
        kickUrl: settings.kickUrl,
        discordUrl: settings.discordUrl ?? "",
        youtubeUrl: settings.youtubeUrl ?? "",
        xUrl: settings.xUrl ?? "",
        instagramUrl: settings.instagramUrl ?? "",
      },
    });
  } catch (error) {
    console.error("GET /api/site-settings failed:", error);

    return NextResponse.json({
      settings: {
        kickUrl: DEFAULT_SITE_SETTINGS.kickUrl,
        discordUrl: DEFAULT_SITE_SETTINGS.discordUrl,
        youtubeUrl: DEFAULT_SITE_SETTINGS.youtubeUrl,
        xUrl: DEFAULT_SITE_SETTINGS.xUrl,
        instagramUrl: DEFAULT_SITE_SETTINGS.instagramUrl,
      },
    });
  }
}

export async function PUT(req: Request) {
  try {
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

    const existing = await prisma.siteSettings.findUnique({
      where: { id: DEFAULT_SITE_SETTINGS.id },
    });

    const settings = existing
      ? await prisma.siteSettings.update({
          where: { id: DEFAULT_SITE_SETTINGS.id },
          data: {
            kickUrl,
            discordUrl,
            youtubeUrl,
            xUrl,
            instagramUrl,
          },
        })
      : await prisma.siteSettings.create({
          data: {
            id: DEFAULT_SITE_SETTINGS.id,
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
  } catch (error) {
    console.error("PUT /api/site-settings failed:", error);

    return NextResponse.json(
      { error: "Failed to save site settings" },
      { status: 500 },
    );
  }
}