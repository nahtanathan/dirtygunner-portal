import { NextResponse } from "next/server";

import {
  getKickWebhookHeaders,
  processKickPointsWebhook,
  verifyKickWebhookSignature,
} from "@/lib/kick/events";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const webhookHeaders = getKickWebhookHeaders(req.headers);

  if (!webhookHeaders) {
    return NextResponse.json(
      {
        error: "Missing Kick webhook headers",
      },
      { status: 400 },
    );
  }

  if (!verifyKickWebhookSignature(webhookHeaders, rawBody)) {
    return NextResponse.json(
      {
        error: "Invalid Kick webhook signature",
      },
      { status: 401 },
    );
  }

  let payload: unknown;

  try {
    payload = JSON.parse(rawBody);
  } catch (error) {
    console.error("Kick webhook JSON parse failed", error);

    return NextResponse.json({
      ok: false,
      status: "ignored",
      reason: "invalid_json",
      eventType: webhookHeaders.eventType,
    });
  }

  try {
    const result = await processKickPointsWebhook({
      webhookHeaders,
      rawBody,
      payload,
    });

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error("Kick webhook processing failed", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process webhook",
      },
      { status: 500 },
    );
  }
}
