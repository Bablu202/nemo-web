import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";
export async function GET() {
  const { data, error } = await supabase
    .from("nemo_upcoming_trip_details")
    .select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request) {
  const newTrip = await request.json();
  const { data, error } = await supabase
    .from("nemo_upcoming_trip_details")
    .insert(newTrip);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
