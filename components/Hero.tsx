"use client";

import Link from "next/link";
import { Button } from "./ui/button";

type HeroProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** Primary CTA button */
  primaryCta?: { label: string; href: string };
  /** Optional secondary CTA button */
  secondaryCta?: { label: string; href: string } | null;
  /** Optional background image URL */
  backgroundUrl?: string;
  className?: string;
};

export default function Hero({
  eyebrow = "FALU_VIN TECH.",
  title = "Achieve your career goals with Falu_Vin Tech.",
  subtitle = "Subscribe to build job-ready skills from world-class Tutors.",
  primaryCta = { label: "Start Learning", href: "/courses" },
  secondaryCta = { label: "Explore Catalog", href: "/courses" },
  backgroundUrl,
  className = "",
}: HeroProps) {
  return (
    <section
      className={`relative w-full my-12 md:my-16 h-[42vh] md:h-[48vh] overflow-hidden rounded-2xl ${className} pt-10`}
      aria-label="Hero"
    >
      {/* Optional background image */}
      {backgroundUrl && (
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundUrl}
            alt=""
            className="h-full w-full object-cover"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Decorative gradient/backdrop */}
      <div
        className="absolute inset-0 -z-10
        bg-gradient-to-b from-black/10 to-black/60
        dark:from-white/10 dark:to-black/50"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10
        bg-gradient-to-t from-background via-background/70 to-background/10"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative h-full w-full">
        <div className="container mx-auto h-full px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="flex h-full items-center">
            <div className="max-w-3xl">
              {/* Eyebrow / Kicker */}
              <span className="block font-extrabold tracking-tight text-base md:text-lg text-foreground/90 mb-2">
                {eyebrow}
              </span>

              {/* Title */}
              <h1
                className="text-3xl md:text-5xl font-bold tracking-tight mb-3
                bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
              >
                {title}
              </h1>

              {/* Subtitle */}
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-7">
                {subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                {primaryCta && (
                  <Button
                    asChild
                    className="px-6 py-5 md:px-7 md:py-6 rounded-lg bg-purple-600/90 hover:bg-purple-600 text-white"
                  >
                    <Link href={primaryCta.href}>{primaryCta.label}</Link>
                  </Button>
                )}

                {secondaryCta && (
                  <Button
                    asChild
                    variant="outline"
                    className="px-6 py-5 md:px-7 md:py-6 rounded-lg bg-background/60 backdrop-blur
                    hover:bg-background/80"
                  >
                    <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
