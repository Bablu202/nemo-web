"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SignOutButton from "@/components/actionComponents/SignOut";
import { useUserSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import UserDetailsForm from "@/components/UserDetailsForm";
import { UserType } from "@/types/custom";
import { format, differenceInYears } from "date-fns";

const ProfilePage = () => {
  const { user, loading, addUserDetails } = useUserSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

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
        console.log("Updating user with:", { ...user, ...updatedUser });
        await addUserDetails(user.id, updatedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update user", error);
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
            <div className="font-bold text-2xl mb-2">Profile Information</div>
            {user.picture && (
              <Image
                src={user.picture}
                alt="Profile Picture"
                width={80}
                height={80}
                className="rounded-full mb-4"
                // Make sure you include a placeholder or fallback option
                loader={({ src }) => src}
              />
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
