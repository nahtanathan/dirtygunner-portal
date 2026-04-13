// FILE: src/app/api/raffles/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const raffles = await prisma.raffle.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(raffles);
}

export async function POST(req: Request) {
  const body = await req.json();

  const raffle = await prisma.raffle.upsert({
    where: { id: body.id },
    update: body,
    create: body,
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