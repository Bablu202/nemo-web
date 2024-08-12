// app/api/user/manage/get-trips/route.ts
import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function GET() {
  try {
    // Fetch all trip names, user details, and dates
    const { data: allData, error: allDataError } = await supabase
      .from("trip_users")
      .select(
        "id, trip_id, trip_name, email, count, paid_amount, remaining_amount, confirmed, refund, price, start_date, return_date"
      );

    if (allDataError) {
      console.error("Error fetching trip data:", allDataError);
      return NextResponse.json(
        { error: "Failed to fetch trip data" },
        { status: 500 }
      );
    }

    // Process data to get unique trip names
    const tripMap = new Map<string, any[]>();

    allData.forEach(
      (entry: {
        id: string;
        trip_id: string;
        email: string;
        trip_name: string;
        count: number;
        paid_amount: number;
        remaining_amount: number;
        confirmed: boolean;
        refund: boolean;
        price: number;
        start_date: string; // Add start_date to the type
        return_date: string; // Add return_date to the type
      }) => {
        if (!tripMap.has(entry.trip_name)) {
          tripMap.set(entry.trip_name, []);
        }
        tripMap.get(entry.trip_name)?.push({
          id: entry.id,
          email: entry.email,
          count: entry.count,
          paid_amount: entry.paid_amount,
          remaining_amount: entry.remaining_amount,
          confirmed: entry.confirmed,
          refund: entry.refund,
          price: entry.price,
          start_date: entry.start_date, // Add start_date to the user details
          return_date: entry.return_date, // Add return_date to the user details
        });
      }
    );

    // Convert map to array of trips with user details
    const trips = Array.from(tripMap.entries()).map(([trip_name, users]) => ({
      trip_name,
      users,
    }));

    return NextResponse.json({ trips });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
