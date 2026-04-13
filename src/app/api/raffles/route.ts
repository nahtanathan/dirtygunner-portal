// FILE: src/app/api/raffles/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const raffles = await prisma.raffle.findMany({
    orderBy: [{ status: "asc" }, { endDate: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(raffles);
}

export async function POST(req: Request) {
  const body = await req.json();

  const raffle = await prisma.raffle.upsert({
    where: { id: body.id },
    update: {
      title: body.title,
      description: body.description ?? null,
      image: body.image ?? null,
      status: body.status,
      entryMethod: body.entryMethod,
      totalEntries: body.totalEntries,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      winner: body.winner ?? null,
      prizeDetails: body.prizeDetails,
    },
    create: {
      id: body.id,
      title: body.title,
      description: body.description ?? null,
      image: body.image ?? null,
      status: body.status,
      entryMethod: body.entryMethod,
      totalEntries: body.totalEntries,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      winner: body.winner ?? null,
      prizeDetails: body.prizeDetails,
    },
  });

  return NextResponse.json(raffle);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.raffle.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}