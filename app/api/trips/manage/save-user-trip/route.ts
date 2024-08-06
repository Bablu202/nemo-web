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

    if (!id || !email || !trip_name || !trip_id) {
      return NextResponse.json(
        { error: "Missing required fields: id, email, trip_name, or trip_id" },
        { status: 400 }
      );
    }

    // Check if the user is already enrolled in the trip
    const { data: existingEnrollment, error: checkError } = await supabase
      .from("trip_users")
      .select("*")
      .eq("trip_id", trip_id)
      .eq("email", email)
      .single();

    if (checkError && checkError.code === "PGRST112") {
      return NextResponse.json(
        { error: "Table does not exist" },
        { status: 500 }
      );
    }

    if (existingEnrollment) {
      return NextResponse.json({
        message: "User already registered for this trip",
      });
    } else {
      // Insert user data into the trip_users table
      const { error: insertError } = await supabase.from("trip_users").insert({
        trip_name,
        trip_id,
        email,
        user_data: {
          count: 1,
          confirmed: false,
          paid: 0,
          balance: 0,
          refund: false,
        },
      });

      if (insertError) {
        console.error("Insert Error:", insertError.message);
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ message: "Request saved successfully" });
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
