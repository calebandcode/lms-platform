export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";

const SECRET = process.env.PAYSTACK_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const raw = await req.text();
    const sig = req.headers.get("x-paystack-signature");
    if (!sig) return new NextResponse("No signature", { status: 400 });

    const hash = crypto.createHmac("sha512", SECRET).update(raw, "utf8").digest("hex");
    if (hash !== sig) return new NextResponse("Bad signature", { status: 400 });

    const evt = JSON.parse(raw) as {
      event: string;
      data: {
        status: string;
        amount: number;
        reference: string;
        metadata?: { courseId?: string; userId?: string };
      };
    };

    if (evt.event === "charge.success" && evt.data.status === "success") {
      const { amount, reference, metadata } = evt.data;
      const courseId = metadata?.courseId;
      const userId = metadata?.userId;
      if (!courseId || !userId) return new NextResponse("Missing metadata", { status: 400 });

      const student = await getStudentByClerkId(userId);
      if (!student.data) return new NextResponse("Student not found", { status: 404 });

      await createEnrollment({
        studentId: student.data._id,
        courseId,
        paymentId: reference,
        amount: amount / 100,
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (e) {
    console.error("Paystack webhook error:", e);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
