"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SkillsFinderProps = {
  title?: string;
  subtitle?: string;
  categories?: string[];
  /** where to send searches, e.g. /search or /courses */
  searchPath?: string;
  className?: string;
};

export default function SkillsFinder({
  title = "All the skills you need in one place",
  subtitle = "From critical skills to technical topics, build job-ready skills with world-class tutors.",
  categories = [
    "Web Development",
    "Data Science",
    "UI/UX Design",
    "Digital Marketing",
    "Cybersecurity",
    "AI & Machine Learning",
  ],
  searchPath = "/search",
  className = "",
}: SkillsFinderProps) {
  const [q, setQ] = useState("");
  const router = useRouter();

  const go = (term: string) => {
    const t = term.trim();
    router.push(`${searchPath}/${encodeURIComponent(t)}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) go(q);
  };

  return (
    <section className={`w-full py-8 md:py-12 ${className}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-4 md:gap-5">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-2xl">{subtitle}</p>

          {/* Search Bar */}
          <form
            onSubmit={onSubmit}
            className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-card/60 p-2"
            aria-label="Search courses"
          >
            <Search className="h-5 w-5 text-muted-foreground ml-1" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="What do you want to learn? e.g. React, Python, Branding…"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            />
            <Button
              type="submit"
              className="min-w-[110px] bg-purple-600 hover:bg-purple-600/90 text-white"
              disabled={!q.trim()}
            >
              Search
            </Button>
          </form>

          {/* Quick categories */}
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((label) => (
              <button
                key={label}
                onClick={() => go(label)}
                className="rounded-full border border-border px-3 py-1.5 text-sm hover:bg-muted/60 transition"
                aria-label={`Search ${label}`}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
