import { NextResponse } from "next/server";
import { estimateSchema } from "@/lib/validation/lead";
import { calculateEstimate } from "@/lib/tax/estimate";

export async function POST(req: Request) {
  const parsed = estimateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Please check your inputs." }, { status: 422 });
  return NextResponse.json({ ok: true, result: calculateEstimate(parsed.data) });
}
