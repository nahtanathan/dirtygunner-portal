import path from "node:path";
import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getChallengeProofsBucket, getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

class HttpError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function sanitizeFileExtension(fileName: string, mimeType: string) {
  const extFromName = path.extname(fileName || "").toLowerCase();
  const allowedFromName = [".jpg", ".jpeg", ".png", ".webp"];

  if (allowedFromName.includes(extFromName)) {
    return extFromName;
  }

  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/webp") return ".webp";

  return ".jpg";
}

async function uploadProofFile(file: File, userId: string, challengeId: string) {
  if (!file.type.startsWith("image/")) {
    throw new HttpError("Proof file must be an image");
  }

  if (file.size <= 0) {
    throw new HttpError("Proof file is empty");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new HttpError("Proof image must be 10MB or smaller");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = sanitizeFileExtension(file.name, file.type);

  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");

  const objectPath = [
    "challenge-proofs",
    year,
    month,
    challengeId,
    userId,
    `${randomUUID()}${extension}`,
  ].join("/");

  const bucket = getChallengeProofsBucket();
  const supabaseAdmin = getSupabaseAdmin();

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(objectPath, buffer, {
      contentType: file.type || "image/jpeg",
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new HttpError(
      `Failed to upload proof image: ${uploadError.message}`,
      500,
    );
  }

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(objectPath);

  if (!data?.publicUrl) {
    throw new HttpError("Failed to generate proof image URL", 500);
  }

  return data.publicUrl;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ challengeId: string }> },
) {
  try {
    const session = await getSession();

    if (!session?.sub) {
      throw new HttpError("You must be logged in to submit proof", 401);
    }

    const { challengeId } = await params;
    const formData = await req.formData();

    const proof = formData.get("proof");
    const noteValue = formData.get("note");
    const note =
      typeof noteValue === "string" && noteValue.trim().length > 0
        ? noteValue.trim()
        : null;

    if (!(proof instanceof File)) {
      throw new HttpError("Proof image is required");
    }

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        claims: {
          select: {
            id: true,
            status: true,
            userId: true,
          },
        },
      },
    });

    if (!challenge) {
      throw new HttpError("Challenge not found", 404);
    }

    const now = new Date();

    if (challenge.status !== "active") {
      throw new HttpError("This challenge is not active");
    }

    if (challenge.startDate.getTime() > now.getTime()) {
      throw new HttpError("This challenge has not started yet");
    }

    if (challenge.endDate.getTime() <= now.getTime()) {
      throw new HttpError("This challenge has ended");
    }

    const approvedClaims = challenge.claims.filter(
      (claim) => claim.status === "approved",
    ).length;

    if (approvedClaims >= challenge.claimLimit) {
      throw new HttpError("This challenge has reached its claim limit");
    }

    const existingForUser = challenge.claims.filter(
      (claim) =>
        claim.userId === session.sub &&
        (claim.status === "pending" || claim.status === "approved"),
    );

    if (existingForUser.some((claim) => claim.status === "approved")) {
      throw new HttpError("You already have an approved claim for this challenge");
    }

    if (existingForUser.some((claim) => claim.status === "pending")) {
      throw new HttpError("You already have a pending proof submission");
    }

    const proofImageUrl = await uploadProofFile(
      proof,
      session.sub,
      challenge.id,
    );

    const created = await prisma.challengeClaim.create({
      data: {
        challengeId: challenge.id,
        userId: session.sub,
        proofImageUrl,
        note,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      claimId: created.id,
      status: created.status,
      proofImageUrl: created.proofImageUrl,
    });
  } catch (error) {
    console.error("Failed to submit challenge proof:", error);

    const status = error instanceof HttpError ? error.status : 500;

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit challenge proof",
      },
      { status },
    );
  }
}