// app/auth/callback
import createSupabaseServerClient from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { searchParams } = url;
    const origin = url.origin;
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    console.log("Received code:", code);
    console.log("Origin:", origin);
    console.log("Next:", next);

    if (code) {
      const supabase = await createSupabaseServerClient();

      // Exchange the code for a session
      const { data: session, error } =
        await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error.message);
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=${encodeURIComponent(
            error.message
          )}`
        );
      }

      if (session) {
        // Ensure user details are updated in the Supabase table
        const { user } = session;

        // Optionally, update user details in your 'users' table
        const { error: updateError } = await supabase.from("users").upsert(
          {
            id: user.id,
            email: user.email,
            // Include other user fields as needed
          },
          { onConflict: "id" }
        );

        if (updateError) {
          console.error("Error updating user details:", updateError.message);
          return NextResponse.redirect(
            `${origin}/auth/auth-code-error?error=${encodeURIComponent(
              updateError.message
            )}`
          );
        }

        // Redirect to the next page
        return NextResponse.redirect(`${origin}${next}`);
      }
    }

    console.error("Authorization code is missing in the callback URL");
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=Authorization%20code%20is%20missing`
    );
  } catch (error) {
    console.error(
      "Unexpected error during OAuth callback:",
      (error as Error).message
    );
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${encodeURIComponent(
        (error as Error).message
      )}`
    );
  }
}
