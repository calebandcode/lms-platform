import { client } from "@/sanity/lib/adminClient";

interface CreateEnrollmentParams {
  studentId: string;
  courseId: string;
  paymentId: string; // use Paystack reference
  amount: number;
}

export async function createEnrollment({
  studentId,
  courseId,
  paymentId,
  amount,
}: CreateEnrollmentParams) {
  const doc = {
    _id: `enrollment.${paymentId}`, // idempotent by reference
    _type: "enrollment",
    student: { _type: "reference", _ref: studentId },
    course: { _type: "reference", _ref: courseId },
    paymentId,
    amount,
    enrolledAt: new Date().toISOString(),
  };
  return client.createIfNotExists(doc);
}
