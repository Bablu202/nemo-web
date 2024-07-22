"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { logout, updateUser, getUserSession } from "@/lib/supabaseActions";
import { UserType } from "@/types/custom";
type UserSessionContextType = {
  user: UserType | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateUser: (user: Partial<UserType>) => Promise<void>;
};

const UserSessionContext = createContext<UserSessionContextType | undefined>(
  undefined
);

export const UserSessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const sessionData = await getUserSession();
        setUser(sessionData?.user ?? null);
      } catch (error) {
        console.error("Failed to fetch user session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSession();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setLoading(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleUpdateUser = async (updatedUser: Partial<UserType>) => {
    try {
      if (user) {
        // Ensure that id and email are present when updating
        const newUser: UserType = {
          ...user,
          ...updatedUser,
          id: user.id, // Ensure id is preserved
          email: user.email, // Ensure email is preserved
        };

        if (!newUser.id || !newUser.email) {
          throw new Error("User ID and email are required to update user.");
        }

        await updateUser(newUser);
        setUser(newUser);
      }
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  return (
    <UserSessionContext.Provider
      value={{
        user,
        loading,
        logout: handleLogout,
        updateUser: handleUpdateUser,
      }}
    >
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSession = () => {
  const context = useContext(UserSessionContext);
  if (context === undefined) {
    throw new Error("useUserSession must be used within a UserSessionProvider");
  }
  return context;
};
