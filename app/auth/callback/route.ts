// pages/api/auth/v1/callback.ts
import createSupabaseServerClient from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url, "http://dummyurl");
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (!code) {
      console.error("Authorization code is missing in the callback URL");
      return NextResponse.redirect(
        `/auth/auth-code-error?error=Authorization code is missing`
      );
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        `/auth/auth-code-error?error=${encodeURIComponent(error.message)}`
      );
    }

    return NextResponse.redirect(next);
  } catch (error: any) {
    console.error("Unexpected error during OAuth callback:", error);
    return NextResponse.redirect(
      `/auth/auth-code-error?error=${encodeURIComponent(
        error.message ?? "Unknown error"
      )}`
    );
  }
}
