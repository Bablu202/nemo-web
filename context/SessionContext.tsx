// context/SessionContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  logout,
  updateUser,
  editUser,
  getUserSession,
} from "@/lib/supabaseActions";
import { UserType } from "@/types/custom";

type UserSessionContextType = {
  user: UserType | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateUser: (user: Partial<UserType>) => Promise<void>;
  editUser: (
    userId: string,
    updatedDetails: Partial<UserType>
  ) => Promise<void>;
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
        setUser(sessionData?.user ? { ...sessionData.user } : null);
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
        const newUser: UserType = {
          ...user,
          ...updatedUser,
          id: user.id,
          email: user.email,
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

  const handleEditUser = async (
    userId: string,
    updatedDetails: Partial<UserType>
  ) => {
    try {
      await editUser(userId, updatedDetails);
      if (user) {
        setUser({ ...user, ...updatedDetails });
      }
    } catch (error) {
      console.error("Failed to edit user details", error);
    }
  };

  return (
    <UserSessionContext.Provider
      value={{
        user,
        loading,
        logout: handleLogout,
        updateUser: handleUpdateUser,
        editUser: handleEditUser,
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
