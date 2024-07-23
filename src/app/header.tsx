"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

export function Header() {
  return (
    <div className="border-b">
      <div className="h-16 container flex justify-between items-center">
        {/* Logo Div */}
        <Link href="/">DuoDes</Link>

        {/* Nav Links Div */}
        <div className="flex gap-8">
          <SignedIn>
            <Link href="/create" className="link">Create</Link>
            <Link href="/dashboard" className="link">Dashboard</Link>
            <Link href="/explore" className="link">Explore</Link>
          </SignedIn>
          <SignedOut>
            <Link href="/about" className="link">About</Link>
            <Link href="/pricing" className="link">Pricing</Link>
            <Link href="/explore" className="link">Explore</Link>
          </SignedOut>

        </div>

        {/* SignIn/Signout links Div */}
        <div className="flex gap-4 items-center">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
