import { getUserAndProfile } from "@/actions/auth.actions";
import { getUserProfileWithUsername } from "@/actions/profile.actions";
import MutateClub, { DeleteClub } from "@/components/profile/MutateClub";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getFileUrl } from "@/helpers";
import { cn } from "@/lib/utils";
import { BookCheckIcon, EditIcon, PyramidIcon, UserIcon } from "lucide-react";
import { notFound } from "next/navigation";

const houseColorCodes: Record<string, string> = {
  Karnaphuli: "bg-lime-500",
  Ashuganj: "bg-red-500",
  Jamuna: "bg-sky-500",
  Shahjalal: "bg-orange-500",
};

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage(props: Props) {
  const { username } = await props.params;
  const profileResponse = await getUserProfileWithUsername(username);
  const { profile } = await getUserAndProfile();

  if (profileResponse.type === "error") {
    return profileResponse.message;
  }

  if (!profileResponse.data) {
    return notFound();
  }

  const isSelf = profile?.username === username;

  const { data } = profileResponse;

  return (
    <main>
      <div className="w-full bg-blue-500 h-[200px]" />
      <div className="container space-y-16 max-w-xl">
        <div className="flex items-center justify-center gap-5 flex-col -mt-24 w-full">
          <div className="relative">
            <Avatar className="w-48 h-48 border-[6px] border-blue-400 shadow-sm">
              <AvatarImage src={getFileUrl("profile-pictures", data.avatarPath || "")} />
              <AvatarFallback>
                <UserIcon className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 left-0 w-full flex justify-center items-center">
              <Badge className={cn(houseColorCodes[data.houseName])}>
                <div>{data.houseName} House</div>
              </Badge>
            </div>
          </div>
          <div className="text-center flex items-center justify-center flex-col space-y-1">
            <h1 className="text-2xl font-semibold">{data.display_name}</h1>
            <p className="font-medium text-muted-foreground whitespace-pre-wrap">{data.bio}</p>
          </div>
          <Badge className="py-1">
            <BookCheckIcon className="w-4 h-4 mr-1" /> HSC {data.hscBatch}
          </Badge>
        </div>

        <section>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PyramidIcon className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-medium">Clubs Joined</h2>
              </div>
              {isSelf && (
                <MutateClub>
                  <Button size="sm" variant="secondary">
                    Add Club
                  </Button>
                </MutateClub>
              )}
            </div>
            <Separator />
          </div>
          {data.clubs.length > 0 ? (
            <div className="py-5 grid grid-cols-1 gap-6">
              {data.clubs.map((club) => (
                <Card key={club.id}>
                  <CardHeader>
                    <CardTitle className="text-primary">{club.clubName}</CardTitle>
                    <CardDescription>{club.clubRole}</CardDescription>
                  </CardHeader>
                  <CardContent>{club.description}</CardContent>
                  {isSelf && (
                    <CardFooter className="flex items-center gap-3">
                      <MutateClub club={club}>
                        <Button size="sm" variant="link" className="text-muted-foreground">
                          <EditIcon className="w-4 h-4 mr-2" /> Edit
                        </Button>
                      </MutateClub>
                      <DeleteClub id={club.id} />
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-10 flex flex-col justify-center items-center text-center gap-2 border-b">
              <h3 className="text-xl opacity-90 font-medium">No Clubs Added</h3>
              <p className="text-sm text-muted-foreground">
                The user has not joined any club or he forgot to add them.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
