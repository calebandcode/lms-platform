"use server";

import { auth } from "@clerk/nextjs/server";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";

export async function verifyPaystackReference(reference: string) {
  if (!reference) throw new Error("Missing reference");

  const key = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!key) throw new Error("Missing PAYSTACK_SECRET_KEY");

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    }
  );

  const json = await res.json();
  if (!json?.status) throw new Error(json?.message || "Verification failed");

  const data = json.data as {
    status: string;
    amount: number; // kobo
    reference: string;
    metadata?: { courseId?: string; userId?: string };
  };

  if (data.status !== "success") throw new Error("Payment not successful");

  const courseId = data.metadata?.courseId;
  const userId = data.metadata?.userId;
  if (!courseId || !userId) throw new Error("Missing metadata");

  // Optional: ensure the current signed-in user matches the metadata
  const { userId: current } = await auth();
  // if (current && current !== userId) throw new Error("User mismatch");

  const student = await getStudentByClerkId(userId);
  if (!student.data) throw new Error("Student not found");

  // Idempotent create (use Paystack reference as paymentId)
  await createEnrollment({
    studentId: student.data._id,
    courseId,
    paymentId: data.reference,
    amount: data.amount / 100,
  });

  return { ok: true, courseId };
}
