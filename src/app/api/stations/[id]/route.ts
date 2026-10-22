import { NextResponse } from "next/server";
import { getStationById } from "@/lib/dataStore";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const station = getStationById(id);
  if (!station) {
    return NextResponse.json({ error: "Station not found" }, { status: 404 });
  }
  return NextResponse.json({ station });
}
