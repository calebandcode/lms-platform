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

const HamburgerMenu = () => {
  return (
   <Sheet>
  <SheetTrigger className="md:hidden"><MenuIcon /></SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
  )
}

export default HamburgerMenu
