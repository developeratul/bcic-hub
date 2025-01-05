"use server";

import { clubSchema } from "@/components/profile/MutateClub";
import { profileSchema } from "@/providers/onboarding";
import { ActionResponse } from "@/types";
import { Tables } from "@/types/database.types";
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

export async function createNewProfile(
  profileData: z.infer<typeof profileSchema>
): Promise<ActionResponse<{ username: string }>> {
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

export async function getUserProfileWithUsername(
  username: string
): Promise<ActionResponse<(Tables<"profile"> & { clubs: Tables<"clubs">[] }) | null>> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profile")
    .select("*,clubs(*)")
    .eq("username", username)
    .single();

  return { type: "success", data };
}

export async function addClub(data: z.infer<typeof clubSchema>) {
  const supabase = await createClient();

  const auth = await supabase.auth.getUser();

  if (!auth.data.user) {
    return { type: "error", message: "Not Authorized" };
  }

  const { error } = await supabase.from("clubs").insert({
    ...data,
    userId: auth.data.user.id,
  });

  if (error) {
    return { type: "error", message: error.message };
  }

  return { type: "success", message: "Club added successfully" };
}

export async function updateClub({
  clubId,
  ...data
}: z.infer<typeof clubSchema> & { clubId: number }) {
  const supabase = await createClient();

  const auth = await supabase.auth.getUser();

  if (!auth.data.user) {
    return { type: "error", message: "Not Authorized" };
  }

  const { error } = await supabase
    .from("clubs")
    .update(data)
    .eq("userId", auth.data.user.id)
    .eq("id", clubId);

  if (error) {
    return { type: "error", message: error.message };
  }

  return { type: "success", message: "Club updated successfully" };
}

export async function removeClub(id: number) {
  const supabase = await createClient();

  const auth = await supabase.auth.getUser();

  if (!auth.data.user) {
    return { type: "error", message: "Not Authorized" };
  }

  const { error } = await supabase
    .from("clubs")
    .delete()
    .eq("userId", auth.data.user.id)
    .eq("id", id);

  if (error) {
    return { type: "error", message: error.message };
  }

  return { type: "success", message: "Club removed successfully" };
}
