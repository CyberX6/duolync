import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const { GET: _GET, POST: _POST } = toNextJsHandler(auth);

// Wrap handlers so transient DB errors return clean JSON instead of crashing
async function safeHandler(
  handler: (req: NextRequest) => Promise<Response>,
  req: NextRequest,
): Promise<Response> {
  try {
    return await handler(req);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[auth] handler error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return safeHandler(_GET, req);
}

export async function POST(req: NextRequest) {
  return safeHandler(_POST, req);
}
