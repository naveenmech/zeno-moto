import { NextResponse } from "next/server";
import { getKpis } from "@/lib/dataStore";

export async function GET() {
  return NextResponse.json(getKpis());
}
