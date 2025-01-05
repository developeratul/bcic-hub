"use client";
import { addClub, removeClub, updateClub } from "@/actions/profile.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clubData } from "@/lib/data";
import { AppProps } from "@/types";
import { Tables } from "@/types/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDisclosure } from "@mantine/hooks";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export const clubSchema = z.object({
  clubName: z.string().min(3, "Club selection is required"),
  description: z.string().min(3, "Description is required"),
  clubRole: z.string().min(3, "Club role is required"),
});

export default function MutateClub(props: AppProps & { club?: Tables<"clubs"> }) {
  const edit = !!props.club;
  const form = useForm<z.infer<typeof clubSchema>>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      clubName: props.club?.clubName ?? "",
      description: props.club?.description ?? "",
      clubRole: props.club?.clubRole ?? "",
    },
  });
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof clubSchema>) {
    try {
      let res;

      if (edit && props.club) {
        res = await updateClub({ ...values, clubId: props.club.id });
      } else {
        res = await addClub(values);
      }

      if (res.type === "error") {
        throw new Error(res.message);
      }

      toggle();
      form.reset();
      router.refresh();
      toast.success(res.message);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  }

  useEffect(() => {
    if (edit && props.club) {
      form.setValue("clubName", props.club.clubName);
      form.setValue("description", props.club.description);
      form.setValue("clubRole", props.club.clubRole);
    }
  }, [edit]);

  return (
    <Dialog open={opened} onOpenChange={toggle}>
      <DialogTrigger asChild onClick={toggle}>
        {props.children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{edit ? "Edit Club" : "Add Club"}</DialogTitle>
          <DialogDescription>
            This club will be displayed on your profile publicly.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="clubName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Club</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {clubData.map((club) => (
                          <SelectItem key={club.name} value={club.name}>
                            {club.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clubRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Club Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Vice President" {...field} />
                  </FormControl>
                  <FormDescription>
                    Which role were you in this club? (Such as President, Vice President, Member)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe your experience</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your experience in short..." {...field} />
                  </FormControl>
                  <FormDescription>
                    What you experienced? What you learned? How you contributed? Feel free to write
                    anything related.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{edit ? "Save Changes" : "Add Club"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteClub(props: { id: number }) {
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="link" className="text-destructive">
          <TrashIcon className="w-4 h-4 mr-2" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await removeClub(props.id);
              router.refresh();
            }}
          >
            Remove Club
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
