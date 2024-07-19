//lib/getUserSession
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
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getSession();

  if (data && data.session) {
    const { user } = data.session;
    return {
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        provider: user.app_metadata.provider,
        created_at: user.created_at,
      },
    };
  }

  return { user: null };
}
