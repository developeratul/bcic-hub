"use server";

import { profileSchema } from "@/providers/onboarding";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

export async function checkUsernameExistence(username: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profile")
    .select("username")
    .eq("username", username)
    .single();

  if (data) {
    return true;
  } else {
    return false;
  }
}

export async function createNewProfile(profileData: z.infer<typeof profileSchema>) {
  const supabase = await createClient();

  const auth = await supabase.auth.getUser();

  if (!auth.data.user) {
    return { type: "error", message: "Not Authorized" };
  }

  const exists = await checkUsernameExistence(profileData.username);

  if (exists) {
    return { type: "error", message: "Username already exists" };
  }

  const { data, error } = await supabase
    .from("profile")
    .insert({
      ...profileData,
      id: auth.data.user.id,
      email: auth.data.user.email,
    })
    .select("username")
    .single();

  if (error) {
    return { type: "error", message: error.message };
  }

  return { type: "success", data, message: "You're all set!" };
}
