export const runtime = "nodejs";       
export const dynamic = "force-dynamic"; // never cache a webhook route


import { NextResponse } from "next/server";
import crypto from "crypto";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";

const PAYSTACK_WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET!;

interface PaystackChargeData {
  metadata?: {
    courseId?: string;
    userId?: string;
  };
  amount: number;
  reference: string;
}

interface PaystackWebhookEvent {
  event: string;
  data: PaystackChargeData;
}

export async function POST(req: Request) {
  // 1. Read raw body & signature header
  const body = await req.text();
  const sig = req.headers.get("x-paystack-signature");
  if (!sig) {
    return new NextResponse("No signature provided", { status: 400 });
  }

  // 2. Verify HMAC-SHA512
  const hash = crypto
    .createHmac("sha512", PAYSTACK_WEBHOOK_SECRET)
    .update(body, "utf8")
    .digest("hex");
  if (hash !== sig) {
    console.error("Invalid Paystack signature");
    return new NextResponse("Invalid signature", { status: 400 });
  }

  // 3. Parse & type-cast
  let evt: PaystackWebhookEvent;
  try {
    evt = JSON.parse(body) as PaystackWebhookEvent;
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  // 4. Handle only successful charges
  if (evt.event === "charge.success") {
    const { data } = evt;
    const { metadata = {} } = data;
    const { courseId, userId } = metadata;

    if (!courseId || !userId) {
      return new NextResponse("Missing metadata", { status: 400 });
    }

    // 5. Lookup student & enroll
    const student = await getStudentByClerkId(userId);
    if (!student.data) {
      return new NextResponse("Student not found", { status: 404 });
    }

    const amountNaira = data.amount / 100;
    await createEnrollment({
      studentId: student.data._id,
      courseId,
      paymentId: data.reference,
      amount: amountNaira,
    });

    return new NextResponse(null, { status: 200 });
  }

  // 6. Acknowledge all other events
  return new NextResponse(null, { status: 200 });
}
