import { createClient } from "@/utils/supabase/client";
import { v4 as uuid } from "uuid";

export const getFileExtension = (fileName: string) => {
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex !== -1) {
    return fileName.slice(dotIndex);
  }
  return "";
};

export const generateUniqueFileName = (fileName: string): string => {
  const uniqueId = uuid().replace(/-/g, ""); // Remove dashes from the UUID
  const fileExtension = getFileExtension(fileName);
  const baseFileName = fileName.replace(/\.[^/.]+$/, ""); // Remove existing extension
  const uniqueFileName = `${baseFileName}-${uniqueId}${fileExtension}`;
  return uniqueFileName;
};

export function getFileUrl(bucket: string, path: string) {
  const supabase = createClient();
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
