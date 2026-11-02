"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function signOut() {
      try {
        await authClient.signOut();
      } finally {
        if (!cancelled) {
          router.replace("/");
          router.refresh();
        }
      }
    }

    signOut();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="flex flex-1 items-center justify-center bg-cream px-4 py-24 dark:bg-ink-900">
      <p
        role="status"
        className="font-sans text-sm text-ink/60 dark:text-cream/60"
      >
        Signing you out…
      </p>
    </main>
  );
}
