import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

// GET trip by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabase
    .from("nemo_upcoming_trip_details")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}

// PUT update trip by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const updatedTrip = await request.json();
  const { data, error } = await supabase
    .from("nemo_upcoming_trip_details")
    .update(updatedTrip)
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}

// DELETE trip by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabase
    .from("nemo_upcoming_trip_details")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(
    { message: "Trip deleted successfully" },
    { status: 200 }
  );
}
