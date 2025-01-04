import { generateUniqueFileName, getFileUrl } from "@/helpers";
import { useOnboarding } from "@/providers/onboarding";
import { createClient } from "@/utils/supabase/client";
import { UserIcon } from "lucide-react";
import { ChangeEvent, useMemo } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function OnboardingStep2() {
  const { form } = useOnboarding();
  const supabase = createClient();
  const avatarPath = form.watch("avatarPath");
  const thumbnailPreviewUrl = useMemo(() => {
    if (avatarPath) {
      return getFileUrl("profile-pictures", avatarPath);
    }
    return "";
  }, [avatarPath]);

  const handleAvatarInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0 && files[0]) {
      const file = files[0];
      const fileName = generateUniqueFileName(file.name);

      const uploadPromise = supabase.storage
        .from("profile-pictures")
        .upload(fileName, file, { contentType: file.type });

      toast.promise(uploadPromise, {
        loading: "Uploading thumbnail...",
        success: async ({ data, error }) => {
          if (error) {
            throw new Error(error.message);
          }

          // Delete the old one if any
          if (avatarPath) {
            await supabase.storage.from("profile-pictures").remove([avatarPath]);
          }

          form.setValue("avatarPath", data.path);
          return "Avatar uploaded";
        },
        error: (error: Error) => {
          return error.message;
        },
      });
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 items-center">
        <Avatar className="w-24 h-24">
          <AvatarImage src={thumbnailPreviewUrl} />
          <AvatarFallback>
            <UserIcon className="w-10 h-10" />
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2 w-full">
          <Label htmlFor="thumbnailFileInput">Profile Picture</Label>
          <Input id="avatarFileInput" type="file" onChange={handleAvatarInputChange} />
        </div>
      </div>

      <FormField
        control={form.control}
        name="display_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea placeholder="Few words about yourself..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
