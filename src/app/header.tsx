"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

export function Header() {
  return (
    <div className="border-b">
      <div className="container flex justify-between items-center">
        {/* Logo Div */}
        <div>DuoDes</div>

        {/* Nav Links Div */}
        <div>
          <SignedIn>
            <Link href="/create">Create Test</Link>
          </SignedIn>
          <SignedOut>
            <Link href="/about">About</Link>
            <Link href="/pricing">Pricing</Link>
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
