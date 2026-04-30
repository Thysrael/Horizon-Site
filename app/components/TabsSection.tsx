import { TabView } from "./ClientHome";
import type { Source, Contributor, CommunityStats } from "../types";

interface TabsSectionProps {
  sources: Source[];
  contributors: Contributor[];
  stats: CommunityStats;
  userVotedSourceIds?: Set<string>;
}

export function TabsSection({ sources, contributors, stats, userVotedSourceIds }: TabsSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-gray-50/50 to-white py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.03),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TabView sources={sources} contributors={contributors} stats={stats} userVotedSourceIds={userVotedSourceIds} />
      </div>
    </section>
  );
}
