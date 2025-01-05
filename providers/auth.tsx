"use client";
import { AppProps } from "@/types";
import { Tables } from "@/types/database.types";
import { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

interface InitialState {
  user: User | null;
  profile: Tables<"profile"> | null;
}

const AuthContext = createContext<InitialState | undefined>(undefined);

export default function AuthProvider(
  props: AppProps & {
    user: InitialState["user"];
    profile: InitialState["profile"];
  }
) {
  const { children } = props;
  const [user, setUser] = useState<InitialState["user"]>(props.user);
  const [profile, setProfile] = useState<InitialState["profile"]>(props.profile);

  useEffect(() => {
    setUser(props.user);
    setProfile(props.profile);
  }, [props.profile, props.user]);

  return <AuthContext.Provider value={{ profile, user }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
