import supabase from "@/lib/supabase/supabase";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  role: string;
  app_metadata: Record<string, any>;
  created_at: string;
}

interface SessionContextType {
  session: User | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<User | null>(null);

  useEffect(() => {
    const getUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const user = data.session.user;
        setSession(user);

        // Check if user exists in nemo_user_profiles
        const { data: existingUser } = await supabase
          .from("nemo_user_profiles")
          .select("*")
          .eq("email", user.email)
          .single();

        // If user doesn't exist, insert the user
        if (!existingUser) {
          const { error } = await supabase.from("nemo_user_profiles").insert([
            {
              full_name: user.user_metadata.full_name,
              email: user.email,
              profile_picture_url: user.user_metadata.avatar_url,
              provider: user.app_metadata.provider,
              created_at: user.created_at,
            },
          ]);

          if (error) {
            console.error("Error inserting user:", error.message);
          }
        }
      }
    };

    getUserSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
