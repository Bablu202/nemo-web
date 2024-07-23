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
  addNewUser,
  addUserDetails,
  getUserSession,
} from "@/lib/supabaseActions";
import { UserType } from "@/types/custom";

type UserSessionContextType = {
  user: UserType | null;
  loading: boolean;
  logout: () => Promise<void>;
  addNewUser: (user: Partial<UserType>) => Promise<void>;
  addUserDetails: (
    userId: string,
    updatedDetails: Partial<UserType>
  ) => Promise<void>;
};

const UserSessionContext = createContext<UserSessionContextType | undefined>(
  undefined
);

const sanitizeUser = (user: UserType): UserType => {
  return {
    id: user.id,
    email: user.email,
    provider: user.provider,
    created_at: user.created_at,
    name: user.name || "",
    mobile_number: user.mobile_number || "",
    date_of_birth: user.date_of_birth || "",
    profession: user.profession || "",
    gender: user.gender || "",
  };
};

export const UserSessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const sessionData = await getUserSession();
        if (sessionData?.user) {
          setUser(sanitizeUser(sessionData.user));
        } else {
          setUser(null);
        }
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

  const handleAddNewUser = async (updatedUser: Partial<UserType>) => {
    try {
      if (user) {
        const newUser: UserType = {
          ...user,
          ...updatedUser,
        };
        await addNewUser(newUser);
        setUser(sanitizeUser(newUser));
      }
    } catch (error) {
      console.error("Failed to add new user", error);
    }
  };

  const handleAddUserDetails = async (
    userId: string,
    updatedDetails: Partial<UserType>
  ) => {
    try {
      await addUserDetails(userId, updatedDetails);
      if (user) {
        setUser(sanitizeUser({ ...user, ...updatedDetails }));
      }
    } catch (error) {
      console.error("Failed to add user details", error);
    }
  };

  return (
    <UserSessionContext.Provider
      value={{
        user,
        loading,
        logout: handleLogout,
        addNewUser: handleAddNewUser,
        addUserDetails: handleAddUserDetails,
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
