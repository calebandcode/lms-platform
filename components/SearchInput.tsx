"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchInput() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full flex-1 max-w-[450px] hidden md:block"
    >
      <input
        type="text"
        placeholder="What do you want to learn?"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-[450px] rounded-full bg-secondary/80 px-5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </form>
  );
}
