// actions/saveOnboardingResult.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";

type Letter = "A" | "B" | "C" | "D" | "E";

const LETTER_TO_TRACK: Record<Letter, string> = {
  A: "Graphic Design",
  B: "Web Development",
  C: "Data Analysis",
  D: "Digital Marketing",
  E: "Cybersecurity",
};

// Simple majority vote across answers
function pickTrack(answers: Letter[]) {
  const counts: Record<Letter, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  for (const a of answers) counts[a] += 1;
  let best: Letter = "A";
  for (const k of Object.keys(counts) as Letter[]) {
    if (counts[k] > counts[best]) best = k;
  }
  return { track: LETTER_TO_TRACK[best], counts };
}

export async function saveOnboardingResult(answers: Letter[]) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  if (!answers?.length) throw new Error("No answers provided");

  const { track, counts } = pickTrack(answers);

  // Ensure student exists, then store onboarding result
  const studentId = `student.${userId}`;
  await client.createIfNotExists({
    _id: studentId,
    _type: "student",
    clerkId: userId,
  });

  await client
    .patch(studentId)
    .set({
      onboarding: {
        completed: true,
        track,           // e.g. "Web Development"
        counts,          // {A:?,B:?,...}
        answers,         // raw answers (optional but useful)
        answeredAt: new Date().toISOString(),
      },
    })
    .commit();

  // Pick one recommended course by category name (or a tag) matching the track
  const rec = await client.fetch(
    `*[_type=="course" && (
        category->name == $t || $t in tags[] || lower(category->name) == lower($t)
      )] | order(_createdAt desc)[0]{
        _id, "slug": coalesce(slug.current, "")
      }`,
    { t: track }
  );

  return {
    track,
    recommendedCourse: rec?._id ? { id: rec._id as string, slug: rec.slug as string } : null,
  };
}
