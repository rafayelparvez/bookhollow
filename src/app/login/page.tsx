import type { Metadata } from "next";
import AuthForm from "@/components/auth-form";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Login — BookHollow",
  description: "Sign in to the BookHollow library.",
};

export default function LoginPage() {
  return (
    <main className="flex-1 bg-cream dark:bg-ink-900">
      <PageHeader
        title="Login"
        description="Sign in to add books, borrow them, and keep track of your reading."
      />

      <div className="mx-auto max-w-md px-4 py-10 sm:px-6 sm:py-14">
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
