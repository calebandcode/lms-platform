"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyPaystackReference } from "@/actions/verifyPaystackReference";

export default function PaystackVerifier() {
  const search = useSearchParams();
  const router = useRouter();
  const reference = search.get("reference");
  const [ran, setRan] = useState(false);

  useEffect(() => {
    if (!reference || ran) return;
    setRan(true);
    verifyPaystackReference(reference)
      .then(() => {
        // clean the URL and refresh server data
        const url = new URL(window.location.href);
        url.searchParams.delete("reference");
        window.history.replaceState({}, "", url.toString());
        router.refresh();
      })
      .catch((e) => console.error("Paystack verify failed:", e));
  }, [reference, ran, router]);

  return null;
}
