// app/onboarding/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import QuizClient from "./quiz-client";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold">Let’s personalize your learning</h1>
      <p className="text-muted-foreground mt-2">
        Answer 10 quick questions so we can recommend the best path and a starter course for you.
      </p>
      <div className="mt-6">
        <QuizClient />
      </div>
    </div>
  );
}
