import { useUserSession } from "@/context/SessionContext";
import { useState } from "react";

const SignOutButton = () => {
  const { logout } = useUserSession();
  const [loading, setLoading] = useState(false);

  const logoutAction = async () => {
    setLoading(true);
    try {
      await logout();
      window.location.href = "/user"; // Use window.location.href for client-side redirection
    } catch (error) {
      console.error("Failed to log out", error);
      setLoading(false);
    }
  };

  return (
    <button onClick={logoutAction} disabled={loading}>
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default SignOutButton;
