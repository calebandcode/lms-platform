// Server wrapper that reads the user's onboarding track from Sanity
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import LearningPaths, { LearningPath } from "./learningPaths";

export const dynamic = "force-dynamic";

const TRACK_TO_SLUG: Record<string, string> = {
  "Web Development": "web-development",
  "Data Analysis": "data-analysis",
  "UI/UX Design": "ui-ux-design",
  "Digital Marketing": "digital-marketing",
  "Cybersecurity": "cybersecurity",
};

export default async function LearningPathsServer(props: { paths?: LearningPath[] }) {
  const userId  = (await auth()).userId;
  let recommendedSlug: string | null = null;

  if (userId) {
    const res = await client.fetch<{ onboarding?: { track?: string } }>(
      `*[_type=="student" && clerkId==$uid][0]{ onboarding }`,
      { uid: userId },
      { cache: "no-store" }
    );
    const track = res?.onboarding?.track;
    if (track && TRACK_TO_SLUG[track]) {
      recommendedSlug = TRACK_TO_SLUG[track];
    }
  }

  return <LearningPaths recommendedSlug={recommendedSlug} paths={props.paths} />;
}
