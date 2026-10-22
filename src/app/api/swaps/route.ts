import { NextResponse } from "next/server";
import { listSwaps } from "@/lib/dataStore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? 25);
  return NextResponse.json({ swaps: listSwaps(limit) });
}
