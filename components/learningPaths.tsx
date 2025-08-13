"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  LineChart,
  Palette,
  Shield,
  Megaphone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type PathIconKey = "web" | "data" | "design" | "security" | "marketing";

const PathIcon: Record<PathIconKey, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  web: Code2,
  data: LineChart,
  design: Palette,
  security: Shield,
  marketing: Megaphone,
};

export type LearningPath = {
  slug: string;                 // e.g. "web-development"
  title: string;                // "Web Development"
  blurb: string;                // short description
  icon: PathIconKey;
  skills: string[];             // 5–8 chips
  projects?: number;            // optional metadata
  courses?: number;
  href?: string;                // override link, defaults to `/paths/${slug}`
};

const DEFAULT_PATHS: LearningPath[] = [
  {
    slug: "web-development",
    title: "Web Development",
    blurb: "Go from fundamentals to full-stack with modern tooling.",
    icon: "web",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "APIs", "Tailwind"],
    projects: 3,
    courses: 8,
  },
  {
    slug: "data-analysis",
    title: "Data Analysis",
    blurb: "Wrangle data, build insights, and communicate impact.",
    icon: "data",
    skills: ["Excel", "SQL", "Python", "Pandas", "Visualization", "Dashboards"],
    projects: 2,
    courses: 6,
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    blurb: "Design beautiful, usable products backed by research.",
    icon: "design",
    skills: ["Figma", "Wireframing", "Prototyping", "Design Systems", "User Research"],
    projects: 3,
    courses: 7,
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    blurb: "Grow audiences with content, SEO, email, and ads.",
    icon: "marketing",
    skills: ["SEO", "Content", "Analytics", "Email", "Social", "Paid Ads"],
    projects: 2,
    courses: 5,
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    blurb: "Protect systems and data with defensive practices.",
    icon: "security",
    skills: ["Networking", "Threats", "Hardening", "SIEM", "Compliance"],
    projects: 2,
    courses: 5,
  },
];

export default function LearningPaths({
  paths = DEFAULT_PATHS,
  recommendedSlug,
  className = "",
}: {
  paths?: LearningPath[];
  /** highlight one path (e.g. from onboarding result) */
  recommendedSlug?: string | null;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dx, behavior: "smooth" });
  };

  return (
    <section className={`w-full py-10 md:py-12 ${className}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Learning paths</h2>
            <p className="text-muted-foreground">
              Curated sequences of courses and projects to take you from basics to job-ready.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => scrollBy(-420)} aria-label="Previous paths">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scrollBy(420)} aria-label="Next paths">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Horizontal scroller */}
        <div className="relative">
          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin"
          >
            {paths.map((p) => {
              const Icon = PathIcon[p.icon];
              const isRecommended = recommendedSlug && p.slug === recommendedSlug;
              return (
                <article
                  key={p.slug}
                  className="min-w-[288px] md:min-w-[360px] lg:min-w-[400px] snap-start rounded-2xl border border-border bg-card/60 p-5 hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">{p.title}</h3>
                    </div>
                    {isRecommended && <Badge className="bg-purple-600 text-white">Recommended</Badge>}
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>

                  {/* Meta */}
                  {(p.projects || p.courses) && (
                    <div className="mt-3 text-xs text-muted-foreground">
                      {p.courses ? <span>{p.courses} courses</span> : null}
                      {p.courses && p.projects ? <span> • </span> : null}
                      {p.projects ? <span>{p.projects} projects</span> : null}
                    </div>
                  )}

                  {/* Skills chips */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.skills.slice(0, 8).map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5">
                    <Button asChild className="w-full bg-purple-600 hover:bg-purple-600/90">
                      <Link href={p.href ?? `/paths/${p.slug}`}>Start path</Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Mobile arrows */}
          <div className="mt-4 flex md:hidden items-center justify-center gap-2">
            <Button variant="outline" size="icon" onClick={() => scrollBy(-320)} aria-label="Previous paths">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scrollBy(320)} aria-label="Next paths">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
