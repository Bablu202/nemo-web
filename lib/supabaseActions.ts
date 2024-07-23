// lib/supabase/supabase.ts
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
  return data.session;
};

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

export async function editUser(
  userId: string,
  updatedDetails: Partial<UserType>
) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("users")
      .update(updatedDetails)
      .eq("id", userId);

    if (error) {
      console.error("Error editing user details:", error.message);
      throw error;
    }

    console.log("User details edited successfully:", data);
    return data;
  } catch (error) {
    console.error(
      "Unexpected error during user detail editing:",
      (error as Error).message
    );
    throw error;
  }
}

////////////////////////////////////REVIEW
import { ReviewType } from "@/types/custom";

const TABLE_NAME = "reviews";

export const getAllReviews = async (): Promise<ReviewType[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(
      `
      *,
      user:users(id, email, name)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching reviews: ${error.message}`);
  }

  // Map the response to match the expected ReviewType format
  return data.map((review: any) => ({
    ...review,
    user_id: review.user.id,
    user_email: review.user.email,
    user_name: review.user.name,
  }));
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
