"use server";

import baseUrl from "@/lib/baseUrl";
import { urlFor } from "@/sanity/lib/image";
import getCourseById from "@/sanity/lib/courses/getCourseById";
import { createStudentIfNotExists } from "@/sanity/lib/student/createStudentIfNotExists";
import { clerkClient } from "@clerk/nextjs/server";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_INITIALIZE_URL = "https://api.paystack.co/transaction/initialize";

export async function createPaystackCheckout(courseId: string, userId: string) {
  // 1. Fetch course & user
  const course = await getCourseById(courseId);
  const clerkUser = await (await clerkClient()).users.getUser(userId);
  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email || !course) {
    throw new Error("Missing user or course data");
  }

  // 2. Ensure student exists in Sanity
  const student = await createStudentIfNotExists({
    clerkId: userId,
    email,
    firstName: clerkUser.firstName || email,
    lastName: clerkUser.lastName || "",
    imageUrl: clerkUser.imageUrl || "",
  });

  if (!student) {
    throw new Error("Failed to upsert student");
  }

  // 3. Handle free courses exactly as before
  const price = course.price ?? 0;
  const amountKobo = Math.round(price * 100);
  if (amountKobo === 0) {
    await createEnrollment({
      studentId: student._id,
      courseId: course._id,
      paymentId: "free",
      amount: 0,
    });
    return { url: `/courses/${course.slug.current}` };
  }

  // 4. Initialize Paystack transaction
  const res = await fetch(PAYSTACK_INITIALIZE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amountKobo,               // in kobo
      metadata: { courseId, userId },
      callback_url: `${baseUrl}/courses/${course.slug.current}`,
    }),
  });

  const payload = await res.json();
  if (!payload.status) {
    console.error("Paystack init error:", payload);
    throw new Error(payload.message || "Failed to initialize payment");
  }

  // 5. Return the checkout URL
  return { url: payload.data.authorization_url as string };
}
