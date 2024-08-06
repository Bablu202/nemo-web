import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      count,
      paid_amount,
      remaining_amount,
      confirmed,
      refund,
      price,
    } = body;

    if (
      !email ||
      count === undefined ||
      paid_amount === undefined ||
      remaining_amount === undefined ||
      price === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("trip_users")
      .update({
        count,
        paid_amount,
        remaining_amount,
        confirmed,
        refund,
        price,
      })
      .eq("email", email);

    if (error) {
      console.error("Update Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
