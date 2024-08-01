import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id, // User UUID
      email,
      name = null,
      mobile_number = null,
      date_of_birth = null,
      profession = null,
      gender = null,
      picture = null,
      trip_name,
      trip_id,
      start_date = null,
      return_date = null,
    } = body;

    // Validate required fields
    if (!id || !email || !trip_name || !trip_id) {
      return NextResponse.json(
        {
          error: "Missing required fields: id, email, trip_name, or trip_id",
        },
        { status: 400 }
      );
    }

    // Insert data into Supabase table
    const { data, error } = await supabase.from("user_manage_table").insert({
      id, // User UUID
      email,
      name,
      mobile_number,
      date_of_birth,
      profession,
      gender,
      picture,
      trip_name,
      trip_id,
      start_date,
      return_date,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Request saved successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
