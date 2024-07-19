"use client";

import { useState, useEffect } from "react";
import SignOutButton from "@/components/actionComponents/SignOut";
import { useUserSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import UserDetailsForm from "@/components/UserDetailsForm";

const ProfilePage = () => {
  const { user, loading, updateUser } = useUserSession();
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

  const handleUpdateUser = async (updatedUser: Partial<UserType>) => {
    try {
      if (user) {
        await updateUser({ ...user, ...updatedUser });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  if (loading || !user) {
    return <p>Loading...</p>;
  }

  return (
    <section className="flex justify-center mt-12">
      <div className="max-w-md w-full mt-8 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 flex items-center">
          <div>
            <div className="font-bold text-xl mb-2">Profile Information</div>
            <p className="mb-3">
              <span className="font-bold">Id:</span> {user.id}
            </p>
            <p className="mb-3">
              <span className="font-bold">Role:</span> {user.role}
            </p>
            <p className="mb-3">
              <span className="font-bold">Email:</span> {user.email}
            </p>
            <p className="mb-3">
              <span className="font-bold">Provider:</span> {user.provider}
            </p>
            <p className="mb-3">
              <span className="font-bold">Created At:</span> {user.created_at}
            </p>
            <button
              onClick={handleEditClick}
              className="bg-blue-500 text-white px-4 py-2 rounded"
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-96">
            <h2 className="text-xl mb-4">Edit User Details</h2>
            <UserDetailsForm
              initialValues={{
                name: user.name || "",
                mobile_number: user.mobile_number || "",
                date_of_birth: user.date_of_birth || "",
                profession: user.profession || "",
                gender: user.gender || "",
              }}
              onUpdate={handleUpdateUser}
              onCancel={handleCancelClick}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfilePage;
