import { getUserAndProfile } from "@/actions/auth.actions";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function HomePage() {
  const { user, profile } = await getUserAndProfile();
  return (
    <BackgroundLines className="flex items-center md:h-[calc(100vh-80px)] h-[calc(100vh-80px)] justify-center w-full flex-col px-4">
      <header className="z-20">
        <div className="container">
          <div className="max-w-2xl mx-auto flex justify-center items-center flex-col gap-6">
            <div className="flex flex-col justify-center items-center text-center gap-4">
              <Badge variant="outline" className="py-1 px-4 text-sm text-primary border-primary">
                BCIC Hub
              </Badge>
              <h1 className="md:text-5xl text-3xl font-bold">
                Where the entire <span className="text-primary">BCIC alumni</span> network comes
                alive!
              </h1>
              <p className="text-muted-foreground text-sm md:text-base font-medium">
                Join the ultimate BCIC community! Create your profile, explore alumni and current
                students, and connect effortlessly. From finding old friends to building new
                opportunities, our platform makes networking easy and meaningful.
              </p>
            </div>
            {user ? (
              <Link
                className={buttonVariants({ size: "lg", className: "text-lg" })}
                style={{
                  background:
                    "radial-gradient(47.5% 47.5% at 50% 147.5%, --primary 0%, --primary 100%)",
                  boxShadow:
                    "0px 1px 0px 0px rgba(255, 255, 255, 0.50) inset, 0px -4px 0px 0px rgba(0, 0, 0, 0.25) inset, 0px 0px 0px 4px rgba(255, 255, 255, 0.14)",
                }}
                href={`/${profile?.username}`}
              >
                View Your Profile
              </Link>
            ) : (
              <Link
                className={buttonVariants({ size: "lg", className: "text-lg" })}
                style={{
                  background:
                    "radial-gradient(47.5% 47.5% at 50% 147.5%, --primary 0%, --primary 100%)",
                  boxShadow:
                    "0px 1px 0px 0px rgba(255, 255, 255, 0.50) inset, 0px -4px 0px 0px rgba(0, 0, 0, 0.25) inset, 0px 0px 0px 4px rgba(255, 255, 255, 0.14)",
                }}
                href="/sign-up"
              >
                Create Your Profile!
              </Link>
            )}
          </div>
        </div>
      </header>
    </BackgroundLines>
  );
}
