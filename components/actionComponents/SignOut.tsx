// components/actionComponents/SignOutButton.tsx
import { useUserSession } from "@/context/SessionContext";
import { redirect } from "next/navigation";
import { useState } from "react";

const SignOutButton = () => {
  const { logout } = useUserSession();
  const [loading, setLoading] = useState(false);

  const logoutAction = async () => {
    setLoading(true);
    try {
      await logout();
      return redirect("/user"); // Redirect after successful logout
    } catch (error) {
      console.error("Failed to log out", error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={logoutAction}
      disabled={loading}
      className="ml-4 bg-white border rounded-sm shadow-sm px-4 py-1 mb-6 text-lg lg:text-xl font-normal uppercase hover:bg-custom-pri hover:text-white"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default SignOutButton;
