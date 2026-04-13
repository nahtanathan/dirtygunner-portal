// FILE: src/app/api/raffles/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RafflePayload = {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  status: "active" | "ended";
  entryMethod: string;
  totalEntries?: number;
  startDate: string;
  endDate: string;
  winner?: string | null;
  prizeDetails: string;
};

function normalizePayload(body: RafflePayload) {
  return {
    id: body.id,
    title: body.title,
    description: body.description ?? null,
    image: body.image ?? null,
    status: body.status,
    entryMethod: body.entryMethod,
    totalEntries: Number(body.totalEntries ?? 0),
    startDate: new Date(body.startDate),
    endDate: new Date(body.endDate),
    winner: body.winner ?? null,
    prizeDetails: body.prizeDetails,
  };
}

export async function GET() {
  const raffles = await prisma.raffle.findMany({
    orderBy: [{ status: "asc" }, { endDate: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(raffles);
}

export async function POST(req: Request) {
  const body = (await req.json()) as RafflePayload;
  const data = normalizePayload(body);

  const raffle = await prisma.raffle.upsert({
    where: { id: data.id },
    update: data,
    create: data,
  });

  return NextResponse.json(raffle);
}

export async function DELETE(req: Request) {
  const { id } = (await req.json()) as { id: string };

  await prisma.raffle.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}