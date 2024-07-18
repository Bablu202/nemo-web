// app/user/page.tsx
"use client";
import UserForm from "@/components/UserForm";
import WhatsAppButtonContact from "@/components/actionComponents/WhatsAppContact";
import { useUserSession } from "@/context/SessionContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { user, loading } = useUserSession();

  useEffect(() => {
    if (!loading && user) {
      redirect("/profile");
    }
  }, [user, loading]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mt-24 mx-2 md:mx-6 lg:mx-36 bg-custom-pri/5 rounded-md shadow-md">
      <UserForm />
      <WhatsAppButtonContact />
    </div>
  );
};

export default LoginPage;
