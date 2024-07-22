"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import getUserSession from "@/lib/getUserSession";
import { logout, updateUser } from "@/lib/supabase/supabase";
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
        const newUser = { ...user, ...updatedUser };
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
