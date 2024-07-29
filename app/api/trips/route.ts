//api/trips/route.ts
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
  try {
    const newTrip = await request.json();
    console.log("Received data:", newTrip); // Log the received data

    // Validate the data
    if (
      !newTrip.title ||
      !newTrip.start_date ||
      !newTrip.return_date ||
      !newTrip.price ||
      !newTrip.seats
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("nemo_upcoming_trip_details")
      .insert(newTrip);

    if (error) {
      console.error("Supabase Error:", error); // Log the Supabase error
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Unexpected Error:", err); // Log unexpected errors
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
