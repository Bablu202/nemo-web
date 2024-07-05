// pages/api/auth/callback/route.ts
import createSupabaseServerClient from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { searchParams } = url;
    const origin = url.origin;
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (code) {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error);
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=${encodeURIComponent(
            error.message
          )}`
        );
      }

      return NextResponse.redirect(`${origin}${next}`);
    }

    // Log and redirect if the code is missing
    console.error("Authorization code is missing in the callback URL");
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=Authorization code is missing`
    );
  } catch (error: any) {
    // Catch any unexpected errors
    console.error("Unexpected error during OAuth callback:", error);
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${encodeURIComponent(
        error.message
      )}`
    );
  }
}
