// app/api/user/manage/delete-user/route.ts
import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    // Delete the row from the trip_users table based on the ID
    const { error: deleteError } = await supabase
      .from("trip_users")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Delete Error:", deleteError.message);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
