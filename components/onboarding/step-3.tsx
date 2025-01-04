import { houses, useOnboarding } from "@/providers/onboarding";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function OnboardingStep3() {
  const { form } = useOnboarding();
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="hscBatch"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What&apos;s your HSC year</FormLabel>
            <FormDescription>Enter a valid year</FormDescription>
            <FormControl>
              <Input type="number" placeholder="2025" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="houseName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What&apos;s your house?</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {houses.map((house) => (
                    <SelectItem key={house} value={house}>
                      {house}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
