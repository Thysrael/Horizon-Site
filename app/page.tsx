import { Navbar } from "@/app/components/Navbar";
import { HeroSection } from "@/app/components/HeroSection";
import { TabsSection } from "@/app/components/TabsSection";
import { Footer } from "@/app/components/Footer";
import { getSources, getContributors, getUserVotedSourceIds } from "@/app/lib/data";
import { auth } from "@/auth";

interface HomePageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const searchQuery = params.q;

  const session = await auth();

  const [sources, contributors, userVotedSourceIds] = await Promise.all([
    getSources(searchQuery),
    getContributors(),
    session?.user?.id ? getUserVotedSourceIds(session.user.id) : Promise.resolve(new Set<string>()),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar searchQuery={searchQuery} />
      <HeroSection />
      <TabsSection sources={sources} contributors={contributors} userVotedSourceIds={userVotedSourceIds} />
      <Footer />
    </div>
  );
}
