"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SignOutButton from "@/components/actionComponents/SignOut";
import UserDetailsForm from "@/components/UserDetailsForm";
import { useUserSession } from "@/context/SessionContext";
import { UserType } from "@/types/custom";
import { format, differenceInYears } from "date-fns";
import {
  uploadProfilePicture,
  deleteProfilePictureFolder,
  addUserDetails,
} from "@/lib/supabaseActions";
import ProfilePic from "@/components/userComponents/ProfilePic";
import { FaEdit, FaSignOutAlt, FaTimes } from "react-icons/fa";

const ProfilePage: React.FC = () => {
  const { user, loading, setUser } = useUserSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/user");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (selectedFile) {
      handleProfilePictureUpload();
    }
  }, [selectedFile]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleUpdateUserDetails = async (updatedUser: Partial<UserType>) => {
    try {
      if (user) {
        await addUserDetails(user.id, updatedUser);
        setUser({ ...user, ...updatedUser });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      // Upload new profile picture
      const filePath = await uploadProfilePicture(selectedFile, user.id);

      // Update the user profile with the new picture URL
      const pictureUrl = `${
        process.env.NEXT_PUBLIC_SUPABASE_URL
      }/storage/v1/object/public/profile-pics/${filePath}?t=${Date.now()}`;
      await addUserDetails(user.id, { picture: pictureUrl });
      setUser({ ...user, picture: pictureUrl }); // Update the local user state
    } catch (error) {
      console.error("Failed to upload profile picture", error);
    } finally {
      setUploading(false);
      setSelectedFile(null); // Clear selected file after upload
    }
  };

  const handleProfilePictureDelete = async () => {
    if (!user?.picture) return;

    try {
      await deleteProfilePictureFolder(user.id);
      await addUserDetails(user.id, { picture: null });
      setUser({ ...user, picture: null }); // Update the local user state
    } catch (error) {
      console.error("Failed to delete profile picture", error);
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    return differenceInYears(new Date(), birthDate);
  };

  if (loading || !user) {
    return <p>Loading...</p>;
  }
  return (
    <section className="flex flex-col items-center mt-12 p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg overflow-hidden border border-gray-300">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <button
            onClick={handleEditClick}
            className="flex items-center text-lg lg:text-xl font-medium text-custom-pri hover:bg-custom-pri hover:text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaEdit className="mr-2" /> Edit
          </button>
          <button
            onClick={() => {} /* Add sign out handler */}
            className="flex items-center text-lg lg:text-xl font-medium text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaSignOutAlt className="mr-2" /> <SignOutButton />
          </button>
        </div>
        <div className="p-6 flex flex-col items-center">
          <ProfilePic
            src={user.picture ?? undefined}
            onUpload={() => fileInputRef.current?.click()}
            onDelete={handleProfilePictureDelete}
            uploading={false} // Adjust based on your state
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setSelectedFile(e.target.files ? e.target.files[0] : null)
            }
            className="hidden"
            ref={fileInputRef}
          />
          <hr className="my-4 border-gray-300 w-full" /> {/* Horizontal line */}
          <div className="text-left w-full px-4">
            {user.name && (
              <p className="text-2xl font-semibold text-custom-pri">
                {user.name}
              </p>
            )}
            {user.profession && (
              <p className="mt-2 text-lg font-medium text-gray-800">
                <span className="font-semibold">Profession:</span>{" "}
                {user.profession}
              </p>
            )}
            {user.mobile_number && (
              <p className="mt-2 text-lg font-medium text-gray-800">
                <span className="font-semibold">Mobile Number:</span>{" "}
                {user.mobile_number}
              </p>
            )}
            {user.date_of_birth && (
              <p className="mt-2 text-lg font-medium text-gray-800">
                <span className="font-semibold">Age:</span>{" "}
                {calculateAge(user.date_of_birth)}
              </p>
            )}
            <p className="mt-2 text-lg font-medium text-gray-800">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className="mt-2 text-lg font-medium text-gray-800">
              <span className="font-semibold">Provider:</span> {user.provider}
            </p>
            <p className="mt-2 text-lg font-medium text-gray-800">
              <span className="font-semibold">Created At:</span>{" "}
              {format(new Date(user.created_at), "dd MMM yyyy")}
            </p>
          </div>
        </div>
      </div>

      {isEditing && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-custom-pri">
                Edit Your Details
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-full transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <UserDetailsForm
              initialValues={user}
              onUpdate={handleUpdateUserDetails}
              onCancel={handleCancelClick}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfilePage;
