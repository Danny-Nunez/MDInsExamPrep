import { NextResponse } from "next/server";
import { getCourseStats } from "@/lib/course";

export async function GET() {
  return NextResponse.json(getCourseStats());
}
