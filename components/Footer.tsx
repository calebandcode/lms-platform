// components/Footer.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-background">
      {/* Newsletter + strapline */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              Stay in the loop
            </h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-prose">
              Get tips, new course drops, and learning paths straight to your inbox.
            </p>
          </div>

          <form
            action="#"
            method="post"
            className="flex w-full items-center gap-2"
            aria-label="Subscribe to newsletter"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-11"
            />
            <Button type="submit" className="h-11 px-5 bg-purple-600 hover:bg-purple-600/90">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Link columns */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold mb-3">FALU_VIN</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link className="hover:text-foreground" href="/about">About</Link></li>
              <li><Link className="hover:text-foreground" href="/careers">Careers</Link></li>
              <li><Link className="hover:text-foreground" href="/blog">Blog</Link></li>
              <li><Link className="hover:text-foreground" href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Learn</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link className="hover:text-foreground" href="/courses">All courses</Link></li>
              <li><Link className="hover:text-foreground" href="/paths">Learning paths</Link></li>
              <li><Link className="hover:text-foreground" href="/projects">Projects</Link></li>
              <li><Link className="hover:text-foreground" href="/catalog">Catalog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">For Teams</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link className="hover:text-foreground" href="/teams">Business plans</Link></li>
              <li><Link className="hover:text-foreground" href="/teams/demo">Request a demo</Link></li>
              <li><Link className="hover:text-foreground" href="/pricing">Pricing</Link></li>
              <li><Link className="hover:text-foreground" href="/partners">Partners</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link className="hover:text-foreground" href="/help">Help center</Link></li>
              <li><Link className="hover:text-foreground" href="/docs">Documentation</Link></li>
              <li><Link className="hover:text-foreground" href="/status">Status</Link></li>
              <li><Link className="hover:text-foreground" href="/contact">Contact support</Link></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom bar */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Left: brand + legal */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="font-semibold">FALU_VIN</Link>
            <p className="text-xs text-muted-foreground">
              © {year} FALU_VIN. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <Link className="hover:text-foreground" href="/terms">Terms</Link>
              <span aria-hidden>•</span>
              <Link className="hover:text-foreground" href="/privacy">Privacy</Link>
              <span aria-hidden>•</span>
              <Link className="hover:text-foreground" href="/cookies">Cookie policy</Link>
            </div>
          </div>

          {/* Right: locale + socials */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Locale (simple select; swap to shadcn Select if you use it) */}
            <label htmlFor="locale" className="sr-only">Language</label>
            <select
              id="locale"
              name="locale"
              className="h-9 rounded-md border border-border bg-transparent px-2 text-sm"
              defaultValue="en"
              aria-label="Language"
            >
              <option value="en">English</option>
              <option value="nl">Nederlands</option>
              <option value="fr">Français</option>
            </select>

            <div className="flex items-center gap-1.5">
              <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                <Link aria-label="Facebook" href="https://facebook.com" target="_blank">
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                <Link aria-label="Twitter" href="https://twitter.com" target="_blank">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                <Link aria-label="Instagram" href="https://instagram.com" target="_blank">
                  <Instagram className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                <Link aria-label="YouTube" href="https://youtube.com" target="_blank">
                  <Youtube className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                <Link aria-label="LinkedIn" href="https://linkedin.com" target="_blank">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
