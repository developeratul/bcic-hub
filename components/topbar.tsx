"use client";
import { signOutAction } from "@/actions/auth.actions";
import LogoSrc from "@/assets/logo.svg";
import { useAuth } from "@/providers/auth";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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

export default function TopBar() {
  const { user } = useAuth();
  return (
    <nav className="py-4 border-b">
      <div className="container">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image className="shrink-0" src={LogoSrc} alt="BCIC Hub Logo" width={45} />
            <p className="font-semibold text-lg">BCIC Hub</p>
          </Link>
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
                <DropdownMenuItem>My Profile</DropdownMenuItem>
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
    </nav>
  );
}
