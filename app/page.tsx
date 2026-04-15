import { Navbar } from "@/app/components/Navbar";
import { HeroSection } from "@/app/components/HeroSection";
import { TabsSection } from "@/app/components/TabsSection";
import { Footer } from "@/app/components/Footer";
import { getSources, getContributors } from "@/app/lib/data";

interface HomePageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const searchQuery = params.q;

  const [sources, contributors] = await Promise.all([
    getSources(searchQuery),
    getContributors(),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar searchQuery={searchQuery} />
      <HeroSection />
      <TabsSection sources={sources} contributors={contributors} />
      <Footer />
    </div>
  );
}
