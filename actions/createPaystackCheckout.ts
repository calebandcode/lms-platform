"use server";

import baseUrl from "@/lib/baseUrl";
import getCourseById from "@/sanity/lib/courses/getCourseById";
import { createStudentIfNotExists } from "@/sanity/lib/student/createStudentIfNotExists";
import { clerkClient } from "@clerk/nextjs/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_INITIALIZE_URL = "https://api.paystack.co/transaction/initialize";

export async function createPaystackCheckout(courseId: string, userId: string) {
  const course = await getCourseById(courseId);
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!course || !email) throw new Error("Missing user or course data");

  // ensure student exists
  await createStudentIfNotExists({
    clerkId: userId,
    email,
    firstName: clerkUser.firstName || email,
    lastName: clerkUser.lastName || "",
    imageUrl: clerkUser.imageUrl || "",
  });

  const price = course.price ?? 0;
  const amountKobo = Math.round(price * 100);

  if (amountKobo === 0) {
    // free course handled wherever you already do it
    return { url: `${baseUrl}/courses/${course.slug?.current ?? ""}` };
  }

  const successUrl = `${baseUrl}/courses/${course.slug?.current ?? ""}`;

  const res = await fetch(PAYSTACK_INITIALIZE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amountKobo,
      metadata: { courseId, userId },
      callback_url: successUrl,
    }),
  });

  const payload = await res.json();
  if (!payload?.status) {
    console.error("Paystack init error:", payload);
    throw new Error(payload?.message || "Failed to initialize payment");
  }

  return { url: payload.data.authorization_url as string };
}
