import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import ProfileContent from "@/components/profile-content";

export const metadata: Metadata = {
  title: "Profile — BookHollow",
  description: "Your BookHollow profile and reading activity.",
};

export default function ProfilePage() {
  return (
    <main className="flex-1 bg-cream dark:bg-ink-900">
      <PageHeader
        title="Profile"
        description="Your account details and everything you've added or borrowed."
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <ProfileContent />
      </div>
    </main>
  );
}
