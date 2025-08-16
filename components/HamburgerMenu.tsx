import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SearchInput } from "./SearchInput";
import { MenuIcon} from "lucide-react";


import React from 'react'
import { SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/clerk-react";

const HamburgerMenu = () => {
  return (
   <Sheet>
  <SheetTrigger className="md:hidden"><MenuIcon /></SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>  <SignedIn>
                     <UserButton/>
                   </SignedIn></SheetTitle>
      <SheetDescription>
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
       
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
  )
}

export default HamburgerMenu
