import { getUserAndProfile } from "@/actions/auth.actions";
import { AppProps } from "@/types";
import { redirect } from "next/navigation";

export default async function ProtectedLayout(props: AppProps) {
  const { children } = props;
  const { user } = await getUserAndProfile();

  if (!user) {
    return redirect("/sign-in");
  }

  return children;
}
