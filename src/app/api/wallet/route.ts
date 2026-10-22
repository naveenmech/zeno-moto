import { NextResponse } from "next/server";
import { listWallet } from "@/lib/dataStore";

export async function GET() {
  return NextResponse.json({ transactions: listWallet() });
}
