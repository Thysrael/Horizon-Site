import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { VotedSourcesExport } from "./VotedSourcesExport";

export default async function MyVotesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const votes = await prisma.vote.findMany({
    where: { userId: session.user.id },
    include: {
      source: {
        include: {
          submitter: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const sources = votes.map((v) => v.source);
  const votedSourceIds = new Set(sources.map((s) => s.id));

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-12">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-orange-500 transition-colors">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium">My Votes</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Voted Sources</h1>
          <p className="mt-2 text-gray-600">
            Sources you&apos;ve voted for. You can remove votes at any time.
          </p>
        </div>

        <VotedSourcesExport sources={sources} votedSourceIds={votedSourceIds} />
      </div>
    </main>
  );
}
