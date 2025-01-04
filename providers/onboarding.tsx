"use client";
import { AppProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const houses = ["Ashuganj", "Karnaphuli", "Jamuna", "Shahjalal"];

export const profileSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username too long")
    .regex(/^[a-zA-Z0-9._-]+$/g, "Invalid username. No spaces should be included"),
  display_name: z.string().min(1, "Name is required"),
  bio: z.string().min(1, "Bio is required"),
  avatarPath: z.string().optional(),
  houseName: z.enum(["Ashuganj", "Karnaphuli", "Jamuna", "Shahjalal"]),
  hscBatch: z
    .string()
    .min(1, "HSC Batch is required")
    .regex(/^\d{4}$/g, "Invalid HSC batch year. Enter a valid year"),
});

interface InitialState {
  form: UseFormReturn<z.infer<typeof profileSchema>>;
  nextStep: () => void;
  previousStep: () => void;
  currentStep: number;
  totalSteps: number;
}

const OnboardingContext = createContext<InitialState | undefined>(undefined);

export default function OnboardingProvider(props: AppProps) {
  const { children } = props;
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      display_name: "",
      bio: "",
      houseName: "Karnaphuli",
      hscBatch: "",
      avatarPath: "",
    },
  });
  const TOTAL_STEPS = 3;
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{ form, nextStep, previousStep, currentStep, totalSteps: TOTAL_STEPS }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
