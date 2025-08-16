"use server";

import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/writeClient";

type Letter = "A" | "B" | "C" | "D" | "E";

const LETTER_TO_TRACK: Record<Letter, string> = {
  A: "Graphic Design",
  B: "Web Development",
  C: "Data Analysis",
  D: "Digital Marketing",
  E: "Cybersecurity",
};

function pickTrack(answers: Letter[]) {
  const counts: Record<Letter, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  for (const a of answers) counts[a] += 1;
  let best: Letter = "A";
  (Object.keys(counts) as Letter[]).forEach((k) => {
    if (counts[k] > counts[best]) best = k;
  });
  return { track: LETTER_TO_TRACK[best], counts };
}

type Ok = { ok: true; track: string; recommendedCourse: { id: string; slug: string } | null };
type Err = { ok: false; message: string };
export type SaveOnboardingResult = Ok | Err;

export async function saveOnboardingResult(answers: Letter[]): Promise<SaveOnboardingResult> {
  try {
    const { userId } = await auth();
    if (!userId) return { ok: false, message: "Not authenticated" };
    if (!answers?.length || answers.some((x) => !x)) {
      return { ok: false, message: "Please answer all questions" };
    }
    if (!process.env.SANITY_API_ADMIN_TOKEN) {
      return { ok: false, message: "Server missing Sanity write token" };
    }

    const { track, counts } = pickTrack(answers);

    // ensure a student doc exists (id pattern avoids duplicates)
    const studentId = `student.${userId}`;
    await writeClient.createIfNotExists({
      _id: studentId,
      _type: "student",
      clerkId: userId,
    });

    // store onboarding result on the student
    await writeClient
      .patch(studentId)
      .set({
        onboarding: {
          completed: true,
          track,
          counts,
          answers,
          answeredAt: new Date().toISOString(),
        },
      })
      .commit();

    // recommend a course by category name matching the track
    const rec = await writeClient.fetch<{ _id: string; slug: string } | null>(
      `*[_type=="course" && (
          category->name == $t || lower(category->name) == lower($t)
        )] | order(_createdAt desc)[0]{
          _id, "slug": coalesce(slug.current, "")
        }`,
      { t: track },
      { cache: "no-store" }
    );

    return { ok: true, track, recommendedCourse: rec ? { id: rec._id, slug: rec.slug } : null };
  } catch (err) {
    console.error("saveOnboardingResult error:", err);
    return { ok: false, message: "Something went wrong while saving your quiz" };
  }
}
