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
  deleteProfilePicture,
  addUserDetails,
} from "@/lib/supabaseActions";
import ProfilePic from "@/components/userComponents/ProfilePic";

const ProfilePage: React.FC = () => {
  const { user, loading, setUser } = useUserSession(); // Add setUser here
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/user");
    }
  }, [user, loading, router]);

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
        setUser({ ...user, ...updatedUser }); // Update the local user state
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
      const filePath = await uploadProfilePicture(selectedFile, user.id);
      const pictureUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pics/${filePath}`;

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

    const filePath = user.picture.split("profile-pics/")[1];
    try {
      await deleteProfilePicture(filePath);
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
    <section className="flex justify-center mt-12">
      <div className="max-w-md w-full mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 flex items-center">
          <div className="">
            <ProfilePic
              src={user.picture ?? undefined}
              onUpload={() => fileInputRef.current?.click()}
              onDelete={handleProfilePictureDelete}
              uploading={uploading}
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
            {selectedFile && (
              <button
                onClick={handleProfilePictureUpload}
                disabled={uploading}
                className="ml-2 bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            )}
            {user.name && (
              <p className="mt-4 text-lg font-medium text-gray-700">
                <span className="font-bold">Name: </span>
                {user.name}
              </p>
            )}
            {user.profession && (
              <p className="mt-2 text-lg font-medium text-gray-700">
                <span className="font-bold">Profession: </span>
                {user.profession}
              </p>
            )}
            {user.mobile_number && (
              <p className="mt-2 text-lg font-medium text-gray-700">
                <span className="font-bold">Mobile Number: </span>
                {user.mobile_number}
              </p>
            )}
            {user.date_of_birth && (
              <p className="mt-2 text-lg font-medium text-gray-700">
                <span className="font-bold">Age: </span>
                {calculateAge(user.date_of_birth)}
              </p>
            )}
            <p className="mt-2 text-lg font-medium text-gray-700">
              <span className="font-bold">Email: </span>
              {user.email}
            </p>
            <p className="mt-2 text-lg font-medium text-gray-700">
              <span className="font-bold">Provider: </span>
              {user.provider}
            </p>
            <p className="mt-2 text-lg font-medium text-gray-700">
              <span className="font-bold">Created At: </span>
              {format(new Date(user.created_at), "dd MMM yyyy")}
            </p>
            <button
              onClick={handleEditClick}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit
            </button>
          </div>
        </div>
        <div className="px-6 py-4">
          <SignOutButton />
        </div>
      </div>

      {isEditing && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-md"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
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
