"use server";

import createSupabaseServerClient from "@/lib/supabase/server";

type UserType = {
  id: string;
  role: string | undefined;
  email: string | undefined;
  provider: string | undefined;
  created_at: string;
};

export default async function getUserSession(): Promise<{
  user: UserType | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error fetching session:", error.message);
      throw error;
    }

    if (data && data.session) {
      const { user } = data.session;
      const userData = {
        id: user.id,
        role: user.role,
        email: user.email || "", // Fallback to an empty string if email is undefined
        provider: user.app_metadata.provider,
        created_at: user.created_at,
      };

      return { user: userData };
    }

    return { user: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { user: null };
  }
}
