import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SubmitForm } from "./SubmitForm";
import { SignInButton } from "../components/SignInButton";

export default async function SubmitPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8">
              <h1 className="mb-3 text-3xl font-bold text-gray-900">
                Submit a News Source
              </h1>
              <p className="text-gray-600">
                Share a valuable source of technical or academic news with the community.
              </p>
            </div>

            <div className="rounded-2xl border border-white/50 bg-white/80 p-8 shadow-xl shadow-orange-500/5 backdrop-blur-sm">
              <div className="py-8">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <svg
                    className="h-8 w-8 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                  Sign in Required
                </h2>
                <p className="mb-6 text-gray-600">
                  Please sign in with GitHub to submit a news source.
                </p>
                <SignInButton />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold text-gray-900">
              Submit a News Source
            </h1>
            <p className="text-gray-600">
              Share a valuable source of technical or academic news with the community.
              Your submission will be reviewed before appearing on the site.
            </p>
          </div>

          <div className="rounded-2xl border border-white/50 bg-white/80 p-8 shadow-xl shadow-orange-500/5 backdrop-blur-sm">
            <SubmitForm userId={session.user.id} />
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Submitted sources are reviewed by moderators before being published.
            Thank you for contributing to the community!
          </p>
        </div>
      </div>
    </main>
  );
}
