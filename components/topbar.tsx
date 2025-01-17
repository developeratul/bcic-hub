"use client";
import { signOutAction } from "@/actions/auth.actions";
import LogoSrc from "@/assets/logo.svg";
import { useAuth } from "@/providers/auth";
import { UserIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeSwitcher } from "./theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// ! Hydration error

export default function TopBar() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="py-4 border-b sticky top-0 bg-card left-0 z-50 h-[80px] flex items-center justify-center">
      <div className="container">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex block shrink-0 items-center gap-2">
            <Image className="shrink-0" src={LogoSrc} alt="BCIC Hub Logo" width={45} />
            <p className="font-semibold hidden sm:block text-lg">BCIC Hub</p>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="https://github.com/hadcn.png" />
                    <AvatarFallback>
                      <UserIcon className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push(profile ? `/${profile.username}` : "/onboarding")}
                  >
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>Account Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOutAction()}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
                  Sign In
                </Link>
                <Link href="/sign-up" className={buttonVariants({ variant: "secondary" })}>
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
