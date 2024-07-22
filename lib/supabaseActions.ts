// lib/supabase/supabase.ts
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

export const addUser = async (user: UserType) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .upsert([user], { onConflict: "id" });

    if (error) {
      console.error("Error adding user:", error.message);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
};

export const updateUser = async (user: UpdateUserType) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update(user)
      .match({ id: user.id });

    if (error) {
      console.error("Error updating user:", error.message);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
};
