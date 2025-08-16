"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveOnboardingResult, type SaveOnboardingResult } from "@/app/actions/saveOnboardingResult";

type Letter = "A" | "B" | "C" | "D" | "E";

const QUESTIONS: { q: string; options: { letter: Letter; label: string }[] }[] = [
  { q: "Which activity sounds most exciting to you?", options: [
    { letter: "A", label: "Creating digital art or brand visuals" },
    { letter: "B", label: "Building websites or apps" },
    { letter: "C", label: "Making sense of numbers and trends" },
    { letter: "D", label: "Promoting businesses and tracking social media performance" },
    { letter: "E", label: "Detecting and stopping online threats" },
  ]},
  { q: "What kind of tasks do you enjoy the most?", options: [
    { letter: "A", label: "Designing flyers or editing photos" },
    { letter: "B", label: "Writing or tweaking code" },
    { letter: "C", label: "Working with charts/spreadsheets" },
    { letter: "D", label: "Posting content or running ads" },
    { letter: "E", label: "Investigating problems and solving puzzles" },
  ]},
  { q: "If you had to learn one tool today, it would be:", options: [
    { letter: "A", label: "Canva or Illustrator" },
    { letter: "B", label: "HTML/CSS/JavaScript" },
    { letter: "C", label: "Excel or SQL" },
    { letter: "D", label: "Ads Manager or SEO tools" },
    { letter: "E", label: "Network scanners or password testers" },
  ]},
  { q: "How do you usually solve problems?", options: [
    { letter: "A", label: "Visually – I sketch or design a concept" },
    { letter: "B", label: "Step-by-step – break into smaller pieces" },
    { letter: "C", label: "With data – look at facts and patterns" },
    { letter: "D", label: "Ask others and research what works" },
    { letter: "E", label: "Find the root cause and prevent it" },
  ]},
  { q: "Which of these would you prefer as a career?", options: [
    { letter: "A", label: "Creative Designer" },
    { letter: "B", label: "Front-end / Back-end Developer" },
    { letter: "C", label: "Data Analyst / BI Specialist" },
    { letter: "D", label: "Digital Marketer / Strategist" },
    { letter: "E", label: "Cybersecurity Analyst / Ethical Hacker" },
  ]},
  { q: "What excites you about tech?", options: [
    { letter: "A", label: "Creating stunning visuals" },
    { letter: "B", label: "Building tools people use" },
    { letter: "C", label: "Finding insights in data" },
    { letter: "D", label: "Reaching audiences and growing brands" },
    { letter: "E", label: "Protecting systems and information" },
  ]},
  { q: "How would your friends describe you?", options: [
    { letter: "A", label: "Artistic and expressive" },
    { letter: "B", label: "Analytical and tech-savvy" },
    { letter: "C", label: "Observant and data-driven" },
    { letter: "D", label: "Outgoing and persuasive" },
    { letter: "E", label: "Security-conscious" },
  ]},
  { q: "What would you love to create?", options: [
    { letter: "A", label: "A logo or flyer for a new brand" },
    { letter: "B", label: "A website for a business or blog" },
    { letter: "C", label: "A report showing business insights" },
    { letter: "D", label: "A campaign to grow a brand online" },
    { letter: "E", label: "A system that protects users" },
  ]},
  { q: "Which work environment do you prefer?", options: [
    { letter: "A", label: "Creative and visual tasks" },
    { letter: "B", label: "Building or coding challenges" },
    { letter: "C", label: "Quiet, focused, and analytical" },
    { letter: "D", label: "Fast-paced with trends" },
    { letter: "E", label: "Investigative and detail-oriented" },
  ]},
  { q: "When learning something new, you prefer:", options: [
    { letter: "A", label: "Visual examples and practice" },
    { letter: "B", label: "Trying code and debugging" },
    { letter: "C", label: "Real-life data and problem-solving" },
    { letter: "D", label: "Tutorials and applying tips" },
    { letter: "E", label: "Exploring how things break and fixing them" },
  ]},
];

export default function QuizClient() {
  const [answers, setAnswers] = useState<Letter[]>(Array(QUESTIONS.length).fill(undefined) as Letter[]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const select = (i: number, letter: Letter) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = letter;
      return next;
    });
    setError(null);
  };

  const allDone = answers.every(Boolean);

  const submit = () =>
    startTransition(async () => {
      setError(null);
      const res: SaveOnboardingResult = await saveOnboardingResult(answers);
      if (!res.ok) {
        setError(res.message || "Could not save your answers. Please try again.");
        return;
      }
      if (res.recommendedCourse?.slug) {
        router.push(`/courses/${res.recommendedCourse.slug}?recommended=1`);
      } else {
        router.push(`/dashboard?track=${encodeURIComponent(res.track)}`);
      }
    });

  return (
    <div className="space-y-5">
      {QUESTIONS.map((q, i) => (
        <div key={i} className="rounded-xl border border-border p-4">
          <div className="font-medium mb-3">{i + 1}. {q.q}</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {q.options.map((opt) => {
              const active = answers[i] === opt.letter;
              return (
                <button
                  key={opt.letter}
                  type="button"
                  onClick={() => select(i, opt.letter)}
                  className={`text-left rounded-lg border px-4 py-3 transition ${
                    active ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
                  }`}
                >
                  <span className="mr-2 font-semibold">{opt.letter}.</span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <button
        disabled={!allDone || isPending}
        onClick={submit}
        className="w-full md:w-auto rounded-lg px-6 py-3 font-medium bg-purple-600 text-white disabled:opacity-60"
      >
        {isPending ? "Scoring..." : "See my recommendation"}
      </button>
    </div>
  );
}
