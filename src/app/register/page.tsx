import type { Metadata } from "next";
import AuthForm from "@/components/auth-form";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Create an Account — BookHollow",
  description: "Create a BookHollow profile to add and borrow books.",
};

export default function RegisterPage() {
  return (
    <main className="flex-1 bg-cream dark:bg-ink-900">
      <PageHeader
        title="Create an Account"
        description="Join BookHollow to start adding and borrowing books."
      />

      <div className="mx-auto max-w-md px-4 py-10 sm:px-6 sm:py-14">
        <AuthForm mode="register" />
      </div>
    </main>
  );
}
