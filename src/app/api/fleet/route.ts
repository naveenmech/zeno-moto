import { NextResponse } from "next/server";
import { listFleet } from "@/lib/dataStore";

export async function GET() {
  return NextResponse.json({ fleet: listFleet() });
}
