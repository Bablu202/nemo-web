//lib/supabaseActions
import createSupabaseServerClient from "./supabase/server";
import supabase from "./supabaseClient";
import { UserType } from "@/types/custom";

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getUserSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  if (data.session) {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.session.user.id)
      .single();

    if (userError) throw userError;
    return { ...data.session, user: userData };
  }

  return { user: null };
};

export async function addNewUser(user: Partial<UserType>) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("users")
      .upsert({ ...user }, { onConflict: "id" });

    if (error) {
      console.error("Error adding new user:", error.message);
      throw error;
    }

    console.log("New user added successfully:", data);
    return data;
  } catch (error) {
    console.error(
      "Unexpected error during adding new user:",
      (error as Error).message
    );
    throw error;
  }
}

export const addUserDetails = async (
  id: string,
  updatedDetails: Partial<Omit<UserType, "id">>
): Promise<void> => {
  const { error } = await supabase
    .from("users")
    .update(updatedDetails)
    .eq("id", id);

  if (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

////////////////////////////////////REVIEW

import { ReviewType } from "@/types/custom";

const TABLE_NAME = "reviews";

export const getAllReviews = async (
  currentUserId: string | null
): Promise<ReviewType[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*, users(email, name)") // Fetch user's email and name
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching reviews: ${error.message}`);
  }

  // Sort the reviews to place the current user's review at the top
  return (data as ReviewType[]).sort((a, b) => {
    if (a.user_id === currentUserId) return -1; // Current user's review goes to the top
    if (b.user_id === currentUserId) return 1; // Ensure it's sorted above the rest
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // Time-based sorting for other reviews
  });
};
export const addReview = async (
  review: Omit<ReviewType, "id">
): Promise<void> => {
  const { error } = await supabase.from(TABLE_NAME).insert(review);

  if (error) {
    throw new Error(`Error adding review: ${error.message}`);
  }
};

export const updateReview = async (
  id: string,
  updatedReview: Partial<Omit<ReviewType, "id">>
): Promise<void> => {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update(updatedReview)
    .eq("id", id);

  if (error) {
    throw new Error(`Error updating review: ${error.message}`);
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

  if (error) {
    throw new Error(`Error deleting review: ${error.message}`);
  }
};

/////////////////////////////////////////////////////Profile PIC
// Storage-related functions
// lib/supabaseActions.ts

export const uploadProfilePicture = async (
  file: File,
  userId: string
): Promise<string> => {
  const filePath = `${userId}/${file.name}`;
  const { data, error } = await supabase.storage
    .from("profile-pics")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  return filePath;
};

export const deleteProfilePicture = async (filePath: string): Promise<void> => {
  const { error } = await supabase.storage
    .from("profile-pics")
    .remove([filePath]);

  if (error) throw error;
};
