// app/profile/page.tsx
"use client";

import SignOutButton from "@/components/actionComponents/SignOut";
import { useUserSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProfilePage = () => {
  const { user, loading } = useUserSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/user");
    }
  }, [user, loading, router]);

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
          </div>
        </div>
        <div className="px-6 py-4">
          <SignOutButton />
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
