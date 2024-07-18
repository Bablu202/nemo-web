// context/UserSessionContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import getUserSession from "@/lib/getUserSession";
import axios from "axios";

type UserType = {
  id: string;
  role: string | undefined;
  email: string | undefined;
  provider: string | undefined;
  created_at: string;
};

type UserSessionContextType = {
  user: UserType | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const UserSessionContext = createContext<UserSessionContextType | undefined>(
  undefined
);

export const UserSessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSession = async () => {
      const sessionData = await getUserSession();
      setUser(sessionData.user);
      setLoading(false);
    };

    fetchUserSession();
  }, []);

  const logout = async () => {
    try {
      await axios.post("/api/logout");
      setUser(null); // Clear user session in context
      setLoading(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <UserSessionContext.Provider value={{ user, loading, logout }}>
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
