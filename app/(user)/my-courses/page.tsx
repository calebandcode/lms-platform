import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getEnrolledCourses } from "@/sanity/lib/student/getEnrolledCourses";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { getCourseProgress } from "@/sanity/lib/lessons/getCourseProgress";
import { CourseCard } from "@/components/CourseCard";
import type { ComponentProps } from "react";

// Pull the *exact* course type that CourseCard wants
type CourseCardProps = ComponentProps<typeof CourseCard>;
type CourseFromCard = NonNullable<CourseCardProps["course"]>;

type EnrollmentRecord = {
  _id: string;
  course: CourseFromCard | null;
};

type CourseProgressResult = { courseProgress: number };

export default async function MyCoursesPage() {
  const user = await currentUser();
  if (!user?.id) return redirect("/");

  // Make the array concrete so map param isn't implicit any
  const enrolledCourses = (await getEnrolledCourses(user.id)) as EnrollmentRecord[];

  // Get progress for each enrolled course
  const coursesWithProgress = await Promise.all(
    enrolledCourses.map(async ({ course }: EnrollmentRecord) => {
      if (!course) return;
      const { courseProgress } = (await getCourseProgress(
        user.id,
        course._id
      )) as CourseProgressResult;
      return { course, progress: courseProgress } as const;
    })
  );

  const items = coursesWithProgress.filter(
    (x): x is { course: CourseFromCard; progress: number } => x !== null
  );

  return (
    <div className="h-full pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Courses</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No courses yet</h2>
            <p className="text-muted-foreground mb-8">
              You haven&apos;t enrolled in any courses yet. Browse our courses to get started!
            </p>
            <Link
              href="/"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium bg-purple-600 text-primary hover:bg-purple-600/90 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map(({ course, progress }) => (
              <CourseCard
                key={course._id}
                course={course}
                progress={progress}
                href={`/dashboard/courses/${course._id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
