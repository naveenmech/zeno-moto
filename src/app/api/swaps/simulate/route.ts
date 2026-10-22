import { NextResponse } from "next/server";
import { recordSimulatedSwap } from "@/lib/dataStore";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const swap = recordSimulatedSwap(body?.stationId);
  return NextResponse.json({ swap });
}
