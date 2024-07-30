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
  const { data: listData, error: listError } = await supabase.storage
    .from("profile-pics")
    .list(userId);

  if (listError) {
    throw listError;
  }

  // Extract paths and remove them
  const filePaths = listData?.map((file) => file.name) || [];
  if (filePaths.length > 0) {
    const { error: deleteError } = await supabase.storage
      .from("profile-pics")
      .remove(filePaths.map((name) => `${userId}/${name}`));

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

//////////////////////////////////////////////////
//For Trip supabase upload and delete images

const BUCKET_TRIPS = "trips-pics";

export const uploadTripImages = async (files: File[], tripId: string) => {
  const uploadedFiles = [];

  for (const file of files) {
    const fileName = `${tripId}/${file.name}`; // Use tripId as folder name
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_TRIPS)
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    // Construct the public URL for the uploaded file
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET_TRIPS}/${fileName}`;
    uploadedFiles.push(publicUrl);
  }

  return uploadedFiles;
};

export const deleteTripImagesFolder = async (tripId: string) => {
  try {
    // List all files in the tripId folder
    const { data: listData, error: listError } = await supabase.storage
      .from(BUCKET_TRIPS)
      .list(tripId, { limit: 1000 }); // Adjust limit if needed

    if (listError) {
      console.error("Error listing files:", listError);
      throw listError;
    }

    // Extract file paths
    const filePaths = listData?.map((file) => `${tripId}/${file.name}`) || [];

    if (filePaths.length > 0) {
      // Delete all files in the folder
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_TRIPS)
        .remove(filePaths);

      if (deleteError) {
        console.error("Error deleting files:", deleteError);
        throw deleteError;
      }
    }

    // Optionally, check if the folder is empty
    const { data: finalListData, error: finalListError } =
      await supabase.storage.from(BUCKET_TRIPS).list(tripId);

    if (finalListError) {
      console.error("Error listing files after deletion:", finalListError);
      throw finalListError;
    }

    if (finalListData?.length === 0) {
      console.log("Folder deleted successfully:", tripId);
    } else {
      console.warn("Folder not empty after deletion attempt:", tripId);
    }
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
};
//    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET_TRIPS}/${fileName}`;
