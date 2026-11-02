import Banner from "@/components/Banner";
import CategorySection from "@/components/CategorySection";

export default function Home() {
  return (
    <main className="flex-1">
      <h1 className="sr-only">BookHollow — a small online library</h1>
      <Banner />
      <CategorySection />
    </main>
  );
}