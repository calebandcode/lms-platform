// middleware.ts (at project root)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublic = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/courses(.*)",
  "/search(.*)",
  "/api/paystack/webhook", // keep webhook public
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublic(req)) {
    await auth.protect(); // ← not auth().protect()
  }
});

// Recommended matcher from Clerk docs
export const config = {
  matcher: [
    // Skip Next.js internals and most static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
