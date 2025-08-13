// components/FaqSection.tsx
"use client";

import { useMemo, useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type FaqItem = {
  question: string;
  answer: string;
  category?: string; // optional grouping
};

type FaqSectionProps = {
  title?: string;
  subtitle?: string;
  items?: FaqItem[];
  categories?: string[]; // optional manual order; otherwise inferred
  showSearch?: boolean;
  className?: string;
};

const DEFAULT_ITEMS: FaqItem[] = [
  {
    question: "How do I create an account?",
    answer:
      "Click “Sign up” in the header. We use Clerk for secure authentication. You can sign up with email or social providers and you’ll be redirected to onboarding.",
    category: "Account",
  },
  {
    question: "How do payments work?",
    answer:
      "We process payments via Paystack. When you click “Enroll”, you’ll be redirected to Paystack’s secure checkout. After a successful charge, your enrollment is activated automatically.",
    category: "Payments",
  },
  {
    question: "I paid but can’t access my course.",
    answer:
      "Access usually activates within seconds. If not, refresh your dashboard. Still stuck? Contact support with your Paystack reference so we can help quickly.",
    category: "Payments",
  },
  {
    question: "What is your refund policy?",
    answer:
      "If a course doesn’t meet expectations, reach out within 7 days of purchase. We’ll review eligibility based on course progress and our refund policy.",
    category: "Payments",
  },
  {
    question: "Can I learn on mobile?",
    answer:
      "Yes. The platform is responsive and works on modern mobile browsers. Your progress syncs across devices.",
    category: "Learning",
  },
  {
    question: "How does progress tracking work?",
    answer:
      "Mark lessons complete as you go. Your course and module progress update in real time so you can pick up where you left off.",
    category: "Learning",
  },
  {
    question: "Do you provide certificates?",
    answer:
      "Yes—after completing all required lessons in a course, you can generate a completion certificate from your dashboard.",
    category: "Learning",
  },
  {
    question: "How are recommendations made?",
    answer:
      "New learners take a short onboarding quiz. We use your answers to recommend a learning path and starter projects tailored to your goals.",
    category: "Onboarding",
  },
  {
    question: "How do I contact support?",
    answer:
      "Email support@yourdomain.com or use the Help Center. Include your account email and (if relevant) your Paystack reference.",
    category: "Support",
  },
];

export default function FaqSection({
  title = "Frequently asked questions",
  subtitle = "Everything you need to know about accounts, payments, and learning on the platform.",
  items = DEFAULT_ITEMS,
  categories,
  showSearch = true,
  className = "",
}: FaqSectionProps) {
  const [q, setQ] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | "All">("All");

  const allCategories = useMemo(() => {
    if (categories?.length) return ["All", ...categories];
    const set = new Set(items.map((i) => i.category).filter(Boolean) as string[]);
    return ["All", ...Array.from(set)];
  }, [items, categories]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((item) => {
      const matchCategory = activeCategory === "All" || item.category === activeCategory;
      const matchText =
        !term ||
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term);
      return matchCategory && matchText;
    });
  }, [items, q, activeCategory]);

  // Build minimal FAQPage JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: i.answer,
      },
    })),
  };

  return (
    <section className={`w-full py-10 md:py-14 ${className}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-1 max-w-2xl">{subtitle}</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4 mb-4">
          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  activeCategory === cat
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          {showSearch && (
            <div className="w-full md:w-80">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search FAQs…"
                aria-label="Search FAQs"
              />
            </div>
          )}
        </div>

        {/* FAQs */}
        <Accordion type="multiple" className="rounded-2xl border border-border bg-card/60 p-2">
          {filtered.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No results. Try another search.</div>
          ) : (
            filtered.map((item, idx) => (
              <AccordionItem key={`${item.question}-${idx}`} value={`${idx}`} className="border-none">
                <AccordionTrigger className="text-left px-3 py-3 hover:no-underline">
                  <span className="font-medium">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-4 text-sm text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))
          )}
        </Accordion>

        {/* Still need help */}
        <div className="mt-6 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            Still have questions? We’re here to help.
          </p>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/help">Visit Help Center</Link>
            </Button>
            <Button asChild className="bg-purple-600 hover:bg-purple-600/90">
              <Link href="/contact">Contact support</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* SEO: FAQPage JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
