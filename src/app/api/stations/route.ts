import { NextResponse } from "next/server";
import { listStations } from "@/lib/dataStore";

export async function GET() {
  return NextResponse.json({ stations: listStations() });
}
