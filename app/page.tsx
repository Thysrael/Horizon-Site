import { Navbar } from "@/app/components/Navbar";
import { HeroSection } from "@/app/components/HeroSection";
import { TabsSection } from "@/app/components/TabsSection";
import { getSources, getContributors, getCommunityStats, getUserVotedSourceIds } from "@/app/lib/data";
import { auth } from "@/auth";

interface HomePageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const searchQuery = params.q;

  const session = await auth();

  const [sources, contributors, communityStats, userVotedSourceIds] = await Promise.all([
    getSources(searchQuery),
    getContributors(),
    getCommunityStats(),
    session?.user?.id ? getUserVotedSourceIds(session.user.id) : Promise.resolve(new Set<string>()),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar searchQuery={searchQuery} />
      <HeroSection />
      <TabsSection sources={sources} contributors={contributors} stats={communityStats} userVotedSourceIds={userVotedSourceIds} />
    </div>
  );
}
