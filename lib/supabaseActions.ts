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
//Review related db
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

// Function to delete a profile picture folder
export const deleteProfilePictureFolder = async (userId: string) => {
  const folderPath = `${userId}`;

  // List all files in the user's folder
  const { data: files, error: listError } = await supabase.storage
    .from("profile-pics")
    .list(folderPath);

  if (listError) {
    throw listError;
  }

  // Collect all file paths
  const filePaths = files.map((file) => `${folderPath}/${file.name}`);

  if (filePaths.length > 0) {
    // Delete all files in the user's folder
    const { error: deleteError } = await supabase.storage
      .from("profile-pics")
      .remove(filePaths);

    if (deleteError) {
      throw deleteError;
    }
  }
};

export const uploadProfilePicture = async (file: File, userId: string) => {
  const folderPath = `${userId}`;
  const fileName = `${folderPath}/profile.${file.name.split(".").pop()}`;

  // Delete existing profile picture folder if it exists
  await deleteProfilePictureFolder(userId);

  // Upload the new file
  const { error: uploadError, data } = await supabase.storage
    .from("profile-pics")
    .upload(fileName, file);

  if (uploadError) {
    throw uploadError;
  }

  return data.path;
};
