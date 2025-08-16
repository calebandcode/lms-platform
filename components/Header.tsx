"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { SearchIcon } from "lucide-react";
import { SearchInput } from "./SearchInput";
import { Button } from "./ui/button";
import HamburgerMenu from "./HamburgerMenu";
import { NavMenu } from "./dropDownMenu";


export default function Header() {
 
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 border-b border-border
      backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/80 `}
    >
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between gap-4 px-3 md:px-6">
          {/* Left: brand + nav */}
          <div className="flex items-center gap-3 md:gap-4">
            <HamburgerMenu />
            <Link href="/" className="text-xl font-bold tracking-tight">
              FALU_VIN
            </Link>
            <NavMenu />
          </div>

          {/* Center: search (desktop) */}
          <div className="hidden md:block w-full max-w-md">
            <SearchInput />
          </div>

          {/* Right: auth + mobile search */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile search trigger */}
            {/* <div className="md:hidden">
              <button
                type="button"
                aria-label="Search"
                className="p-2 rounded-md hover:bg-muted"
              >
                <SearchIcon className="h-5 w-5" />
              </button>
            </div> */}

            <SignedOut>
              <SignInButton mode="modal"  >
                <Button variant="link" className="hidden md:inline-flex">
                  Log in
                </Button>
              </SignInButton>

              <SignUpButton mode="modal" signInForceRedirectUrl='/onboarding' >
                <Button
                  variant="outline"
                  className="hidden md:inline-flex border-purple-400 hover:bg-purple-400/20"
                >
                  Join for free
                </Button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton/>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
