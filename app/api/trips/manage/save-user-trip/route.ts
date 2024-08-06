import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      email,
      trip_name,
      trip_id,
      price, // Ensure price is included
      start_date = null,
      return_date = null,
    } = body;

    if (!id || !email || !trip_name || !trip_id || price === undefined) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: id, email, trip_name, trip_id, or price",
        },
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
        price, // Insert price
        email,
        count: 1,
        paid_amount: 0,
        remaining_amount: 0,
        confirmed: false,
        refund: false,
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
