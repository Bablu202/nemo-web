import createSupabaseServerClient from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Ensure this route is treated as dynamic

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { searchParams } = url;
    const origin = url.origin;
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (code) {
      const supabase = await createSupabaseServerClient();

      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error);
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=${encodeURIComponent(
            error.message
          )}`
        );
      }

      // Set session cookies
      const response = NextResponse.redirect(`${origin}${next}`);
      response.cookies.set("sb-access-token", data.session.access_token, {
        httpOnly: true,
        // Add other cookie options as needed, such as 'secure' and 'sameSite'
      });
      response.cookies.set("sb-refresh-token", data.session.refresh_token, {
        httpOnly: true,
        // Add other cookie options as needed, such as 'secure' and 'sameSite'
      });

      return response;
    }

    console.error("Authorization code is missing in the callback URL");
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=Authorization code is missing`
    );
  } catch (error: any) {
    console.error("Unexpected error during OAuth callback:", error);
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${encodeURIComponent(
        error.message
      )}`
    );
  }
}
