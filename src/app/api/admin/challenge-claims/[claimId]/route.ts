import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getChallengeProofsBucket, getSupabaseAdmin } from "@/lib/supabase-admin";

class HttpError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

type ReviewPayload = {
  action: "approve" | "reject";
  rejectionReason?: string | null;
};

async function requireAdmin() {
  const session = await getSession();

  if (!session?.sub) {
    throw new HttpError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      isAdmin: true,
    },
  });

  if (!user?.isAdmin) {
    throw new HttpError("Forbidden", 403);
  }

  return user;
}

function getStorageObjectPathFromPublicUrl(publicUrl: string, bucket: string) {
  try {
    const url = new URL(publicUrl);
    const publicPrefix = `/storage/v1/object/public/${bucket}/`;

    if (!url.pathname.includes(publicPrefix)) {
      return null;
    }

    const pathStart = url.pathname.indexOf(publicPrefix) + publicPrefix.length;
    const objectPath = url.pathname.slice(pathStart);

    return objectPath || null;
  } catch {
    return null;
  }
}

async function deleteProofImageIfPresent(proofImageUrl: string) {
  const bucket = getChallengeProofsBucket();
  const objectPath = getStorageObjectPathFromPublicUrl(proofImageUrl, bucket);

  if (!objectPath) {
    return;
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin.storage.from(bucket).remove([objectPath]);

  if (error) {
    throw new HttpError(
      `Failed to delete proof image from storage: ${error.message}`,
      500,
    );
  }
}

async function syncChallengeStatusAfterClaimRemoval(challengeId: string) {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: {
      claims: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  if (!challenge) {
    return;
  }

  const approvedCount = challenge.claims.filter(
    (item) => item.status === "approved",
  ).length;

  const now = new Date();
  const hasReachedLimit = approvedCount >= challenge.claimLimit;
  const hasEnded = challenge.endDate.getTime() <= now.getTime();
  const hasStarted = challenge.startDate.getTime() <= now.getTime();

  let nextStatus = challenge.status;

  if (hasEnded || hasReachedLimit) {
    nextStatus = "completed";
  } else if (hasStarted) {
    nextStatus = "active";
  }

  if (nextStatus !== challenge.status) {
    await prisma.challenge.update({
      where: { id: challenge.id },
      data: {
        status: nextStatus,
      },
    });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ claimId: string }> },
) {
  try {
    const admin = await requireAdmin();
    const body = (await req.json()) as ReviewPayload;
    const { claimId } = await params;

    if (body.action !== "approve" && body.action !== "reject") {
      throw new HttpError("Invalid review action");
    }

    const claim = await prisma.challengeClaim.findUnique({
      where: { id: claimId },
      include: {
        challenge: {
          include: {
            claims: {
              select: {
                id: true,
                status: true,
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!claim) {
      throw new HttpError("Claim not found", 404);
    }

    if (claim.status !== "pending") {
      throw new HttpError("Only pending claims can be reviewed");
    }

    if (body.action === "approve") {
      const approvedCount = claim.challenge.claims.filter(
        (item) => item.status === "approved",
      ).length;

      if (approvedCount >= claim.challenge.claimLimit) {
        throw new HttpError("This challenge already reached its claim limit");
      }

      const userAlreadyApproved = claim.challenge.claims.some(
        (item) =>
          item.userId === claim.userId &&
          item.status === "approved" &&
          item.id !== claim.id,
      );

      if (userAlreadyApproved) {
        throw new HttpError(
          "This user already has an approved claim for the challenge",
        );
      }

      const updated = await prisma.challengeClaim.update({
        where: { id: claim.id },
        data: {
          status: "approved",
          rejectionReason: null,
          reviewedAt: new Date(),
          reviewedById: admin.id,
        },
      });

      const newApprovedCount = approvedCount + 1;

      if (newApprovedCount >= claim.challenge.claimLimit) {
        await prisma.challenge.update({
          where: { id: claim.challengeId },
          data: {
            status: "completed",
          },
        });
      }

      return NextResponse.json({
        success: true,
        claimId: updated.id,
        status: updated.status,
      });
    }

    const rejectionReason =
      typeof body.rejectionReason === "string" && body.rejectionReason.trim()
        ? body.rejectionReason.trim()
        : "Proof did not meet challenge rules.";

    const updated = await prisma.challengeClaim.update({
      where: { id: claim.id },
      data: {
        status: "rejected",
        rejectionReason,
        reviewedAt: new Date(),
        reviewedById: admin.id,
      },
    });

    return NextResponse.json({
      success: true,
      claimId: updated.id,
      status: updated.status,
      rejectionReason: updated.rejectionReason,
    });
  } catch (error) {
    console.error("Failed to review challenge claim:", error);

    const status = error instanceof HttpError ? error.status : 500;

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to review challenge claim",
      },
      { status },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ claimId: string }> },
) {
  try {
    await requireAdmin();
    const { claimId } = await params;

    const claim = await prisma.challengeClaim.findUnique({
      where: { id: claimId },
      select: {
        id: true,
        challengeId: true,
        proofImageUrl: true,
      },
    });

    if (!claim) {
      throw new HttpError("Claim not found", 404);
    }

    await deleteProofImageIfPresent(claim.proofImageUrl);

    await prisma.challengeClaim.delete({
      where: { id: claim.id },
    });

    await syncChallengeStatusAfterClaimRemoval(claim.challengeId);

    return NextResponse.json({
      success: true,
      claimId: claim.id,
      deleted: true,
    });
  } catch (error) {
    console.error("Failed to delete challenge claim:", error);

    const status = error instanceof HttpError ? error.status : 500;

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete challenge claim",
      },
      { status },
    );
  }
}