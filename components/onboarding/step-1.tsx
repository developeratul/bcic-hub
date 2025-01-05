import { checkUsernameExistence } from "@/actions/profile.actions";
import { useOnboarding } from "@/providers/onboarding";
import { useDebouncedState } from "@mantine/hooks";
import { useEffect } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export default function OnboardingStep1() {
  const { form } = useOnboarding();
  const username = form.watch("username");
  const [debounced, setB] = useDebouncedState(username, 500);

  useEffect(() => {
    setB(username);
  }, [username]);

  const validateUsername = async () => {
    const isUsernameExist = await checkUsernameExistence(debounced);
    if (isUsernameExist) {
      form.setError("username", { message: "Username already exists" });
    } else {
      form.clearErrors("username");
    }
  };

  useEffect(() => {
    validateUsername();
  }, [debounced]);

  return (
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormDescription>Let&apos;s create a handle for your profile.</FormDescription>
          <FormControl>
            <Input placeholder="minhaz" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
