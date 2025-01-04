"use client";

import { createNewProfile } from "@/actions/profile.actions";
import OnboardingStep1 from "@/components/onboarding/step-1";
import OnboardingStep2 from "@/components/onboarding/step-2";
import OnboardingStep3 from "@/components/onboarding/step-3";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { profileSchema, useOnboarding } from "@/providers/onboarding";
import { ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { JSX } from "react";
import { toast } from "sonner";
import { z } from "zod";

const onboardingSteps: Record<number, () => JSX.Element> = {
  1: OnboardingStep1,
  2: OnboardingStep2,
  3: OnboardingStep3,
};

export default function OnboardingPage() {
  const { currentStep, form, totalSteps, nextStep, previousStep } = useOnboarding();
  const OnboardingStep = onboardingSteps[currentStep];
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      const res = await createNewProfile(values);

      if (res.type === "error") {
        throw new Error(res.message);
      }

      router.push(`/${res.data?.username}`);
      toast.success(res.message);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  return (
    <main className="">
      <div className="container space-y-12">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Welcome Onboard!</h1>
          <p className="text-muted-foreground">Let&apos;s fill up your profile details.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="onboarding-form">
            <OnboardingStep />
          </form>
        </Form>
        {Object.keys(form.formState.errors).length > 0 && (
          <ul className="list-disc list-inside text-destructive">
            {Object.keys(form.formState.errors).map((key) => (
              <li key={key}>{(form.formState.errors as any)[key]?.message}</li>
            ))}
          </ul>
        )}
        <div className="flex items-end justify-between gap-12">
          <div className="w-full flex-1 space-y-3">
            <p className="text-muted-foreground font-medium">
              Step {currentStep}/{totalSteps}
            </p>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2 max-w-[150px]" />
          </div>
          <div className="shrink-0 flex items-center gap-2">
            {currentStep !== 1 && (
              <Button variant="secondary" onClick={previousStep}>
                Prev
              </Button>
            )}
            {currentStep !== totalSteps && <Button onClick={nextStep}>Next</Button>}
            {currentStep === totalSteps && (
              <Button form="onboarding-form" type="submit">
                Finish <ChevronRightIcon className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
