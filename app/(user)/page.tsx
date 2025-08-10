import Hero from "@/components/Hero";
import { CourseCard } from "@/components/CourseCard";
import { getCourses } from "@/sanity/lib/courses/getCourses";
import type { ComponentProps } from "react";

export const dynamic = "force-static";
export const revalidate = 3600; // revalidate at most every hour

// exact course type from CourseCard
type CourseCardProps = ComponentProps<typeof CourseCard>;
type CourseForCard = NonNullable<CourseCardProps["course"]>;

// Safe normalizer: supports string | {current?: string} | null/undefined
function toSlug(s: unknown): string {
  if (typeof s === "string") return s;
  if (s && typeof s === "object" && "current" in s) {
    const cur = (s as { current?: unknown }).current;
    return typeof cur === "string" ? cur : "";
  }
  return "";
}

export default async function Home() {
  // Avoid implicit any by typing the array to what CourseCard expects
  const courses = (await getCourses()) as CourseForCard[];

  return (
    <div className="min-h-screen bg-background">
      <Hero />

      {/* Courses Grid */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-8">
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
          <span className="text-sm font-medium text-muted-foreground">
            Featured Courses
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {courses.map((course: CourseForCard) => (
            <CourseCard
              key={course._id}
              course={course}
              href={`/courses/${toSlug(course.slug)}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
