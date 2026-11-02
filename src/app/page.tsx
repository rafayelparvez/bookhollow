import Banner from "@/components/Banner";
import CategorySection from "@/components/CategorySection";
import HowToBorrow from "@/components/how-to-borrow";
import NewArrivals from "@/components/new-arrivals";
import ReaderReviews from "@/components/reader-reviews";
import TopCategories from "@/components/top-categories";

export default function Home() {
  return (
    <main className="flex-1">
      <h1 className="sr-only">BookHollow — a small online library</h1>
      <Banner />
      <NewArrivals />
      <CategorySection />
      <HowToBorrow />
      <TopCategories />
      <ReaderReviews />
    </main>
  );
}