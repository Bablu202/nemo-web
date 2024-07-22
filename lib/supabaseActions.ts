// lib/supabase/supabase.ts
import createSupabaseServerClient from "./supabase/server";
import supabase from "./supabaseClient";

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getUserSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};
import { UserType } from "@/types/custom"; // Import UserType from types.ts

export async function updateUser(user: UserType) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("users")
      .upsert(user, { onConflict: "id" });

    if (error) {
      console.error("Error updating user:", error.message);
      throw error;
    }

    console.log("User updated successfully:", data);
    return data;
  } catch (error) {
    console.error(
      "Unexpected error during user update:",
      (error as Error).message
    );
    throw error;
  }
}
