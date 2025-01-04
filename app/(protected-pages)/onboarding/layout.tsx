import { getUserAndProfile } from "@/actions/auth.actions";
import OnboardingProvider from "@/providers/onboarding";
import { AppProps } from "@/types";
import { redirect } from "next/navigation";

export default async function OnboardingLayout(props: AppProps) {
  const { children } = props;
  const { profile, user } = await getUserAndProfile();

  if (!user) {
    return redirect("/sign-in");
  }

  if (profile) {
    return redirect(`/${profile.username}`);
  }

  return <OnboardingProvider>{children}</OnboardingProvider>;
}
