import { NextResponse } from "next/server";

/** Public (anonymous) uploads are disabled — clients upload documents from their dashboard after signing in. */
export async function POST() {
  return NextResponse.json({ ok: false, error: "Please log in to your client portal to upload documents." }, { status: 401 });
}
