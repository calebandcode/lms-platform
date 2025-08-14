import Hero from "@/components/Hero";
import { CourseCard } from "@/components/CourseCard";
import { getCourses } from "@/sanity/lib/courses/getCourses";
import type { ComponentProps } from "react";
import SkillsFinder from "@/components/skillFinder";
import { ValueProps } from "@/components/valueProps";
import Footer from "@/components/Footer";
// import FaqSection from "@/components/faqSection";


export const dynamic = "force-static";
export const revalidate = 3600;

// derive the exact Course shape from CourseCard
type Course = NonNullable<ComponentProps<typeof CourseCard>["course"]>;

export default async function Home() {
  const courses = (await getCourses()) as Course[]; // or type getCourses to return Promise<Course[]>

  return (
    <div className="min-h-screen bg-background">
      <Hero />
   

  <SkillsFinder
        searchPath="/search"
        categories={[
          "Web Development",
          "Data Science",
          "UI/UX Design",
          "Digital Marketing",
          "Cybersecurity",
          "AI & Machine Learning",
        ]}
      />

      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-8">
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
          <span className="text-sm font-medium text-muted-foreground">
            Featured Courses
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {courses.map((course: Course) => (
            <CourseCard
              key={course._id}
              course={course}
              href={`/courses/${course.slug}`}
              />
            ))}
        </div>
      </div>

            <ValueProps />
       
{/* <FaqSection /> */}
      <Footer />
    </div>
  );
}
