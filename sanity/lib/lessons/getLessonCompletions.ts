import { defineQuery } from "groq";
import { sanityFetch } from "../live";

// minimal shapes you actually use
type Lesson = { _id: string };
type Module = { _id: string; title?: string; lessons?: Lesson[] };
type Course = { _id: string; modules?: Module[] };
type LessonCompletion = { module?: { _id?: string }; lesson?: { _id?: string } };

type Payload = {
  completedLessons?: LessonCompletion[];
  course?: Course | null;
};

export async function getLessonCompletions(studentId: string, courseId: string) {
  const getCompletionsQuery = defineQuery(`{
    "completedLessons": *[_type == "lessonCompletion" && student._ref == $studentId && course._ref == $courseId] {
      ...,
      "lesson": lesson->{...},
      "module": module->{...}
    },
    "course": *[_type == "course" && _id == $courseId][0] {
      ...,
      "modules": modules[]-> {
        ...,
        "lessons": lessons[]-> {...}
      }
    }
  }`);

  const result = await sanityFetch({
    query: getCompletionsQuery,
    params: { studentId, courseId },
  });

  const { course, completedLessons = [] } = (result.data ?? {}) as Payload;

  // Calculate module progress
  const moduleProgress =
    course?.modules?.map((mod: Module) => {
      const totalLessons = mod.lessons?.length ?? 0;
      const completedInModule = completedLessons.filter(
        (c: LessonCompletion) => c.module?._id === mod._id
      ).length;

      return {
        moduleId: mod._id,
        title: mod.title,
        progress: totalLessons > 0 ? (completedInModule / totalLessons) * 100 : 0,
        completedLessons: completedInModule,
        totalLessons,
      };
    }) ?? [];

  // Calculate overall course progress
  const totalLessons =
    course?.modules?.reduce(
      (acc: number, mod: Module) => acc + (mod.lessons?.length ?? 0),
      0
    ) ?? 0;

  const totalCompleted = completedLessons.length;
  const courseProgress = totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0;

  return {
    completedLessons,
    moduleProgress,
    courseProgress,
  };
}
