import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/app/components/Navbar";

export const metadata: Metadata = {
  title: "Sponsors | Horizon",
  description: "Sponsorship information and current sponsors for Horizon.",
};

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar showSearch={false} />

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-200/50 sm:p-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Sponsors</h1>
            <p className="mt-6 text-base leading-8 text-gray-600">
              Horizon is an open-source, self-hosted project maintained in spare time. If Horizon helps you build a better personal news radar, run a team briefing, or test your AI platform with real workflows, sponsorship is welcome.
            </p>
            <p className="mt-4 text-base leading-8 text-gray-600">
              Want to appear here? Email{" "}
              <a
                href="mailto:thysrael@163.com"
                className="font-medium text-orange-600 underline decoration-orange-200 underline-offset-4 hover:text-orange-700"
              >
                thysrael@163.com
              </a>{" "}
              or{" "}
              <a
                href="https://github.com/Thysrael/Horizon/issues/new"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-orange-600 underline decoration-orange-200 underline-offset-4 hover:text-orange-700"
              >
                open an issue
              </a>{" "}
              and mention that you are interested in sponsoring Horizon.
            </p>
          </div>

          <section className="mt-10 border-t border-gray-100 pt-10">
            <h2 className="text-2xl font-semibold text-gray-900">Sponsorship options</h2>
            <ul className="mt-5 space-y-3 text-base text-gray-600">
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span>A sponsor mention in the README</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span>A dedicated showcase entry on the project site</span>
              </li>
            </ul>
          </section>

          <section className="mt-10 border-t border-gray-100 pt-10">
            <h2 className="text-2xl font-semibold text-gray-900">Current sponsors</h2>

            <div className="mt-6 rounded-3xl border border-orange-100 bg-orange-50/60 p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="w-full max-w-[240px] shrink-0">
                  <a
                    href="https://www.compshare.cn/?ytag=GPU_YY_git_Horizon"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center rounded-2xl bg-white p-5 shadow-sm ring-1 ring-orange-100"
                  >
                    <Image
                      src="/sponsors/compshare.png"
                      alt="Compshare / 优云智算 logo"
                      width={220}
                      height={88}
                      className="h-auto w-full"
                    />
                  </a>

                  <a
                    href="https://www.compshare.cn/?ytag=GPU_YY_git_Horizon"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:opacity-95"
                  >
                    Visit sponsor
                  </a>
                </div>

                <div className="max-w-3xl">
                  <a
                    href="https://www.compshare.cn/?ytag=GPU_YY_git_Horizon"
                    target="_blank"
                    rel="noreferrer"
                    className="text-2xl font-semibold text-gray-900 hover:text-orange-700"
                  >
                    优云智算 / Compshare
                  </a>
                  <p className="mt-4 text-base leading-8 text-gray-700">
                    Thanks to Compshare for sponsoring this project. Compshare is UCloud&apos;s AI cloud platform, offering cost-effective monthly and pay-as-you-go domestic model agent plans starting from RMB 49/month, as well as stable officially relayed overseas models.
                  </p>
                  <p className="mt-4 text-base leading-8 text-gray-700">
                    It supports Claude Code, Codex, and API usage, with enterprise-grade high concurrency, 24/7 technical support, and self-service invoicing. Register through the sponsor link to receive a free RMB 5 trial credit.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-100 bg-cyan-50/60 p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="w-full max-w-[240px] shrink-0">
                  <a
                    href="https://go.apimart.ai/gh-horizon"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center rounded-2xl bg-white p-5 shadow-sm ring-1 ring-cyan-100"
                  >
                    <Image
                      src="/sponsors/apimart.jpg"
                      alt="APIMart logo"
                      width={2172}
                      height={724}
                      className="h-auto w-full"
                    />
                  </a>

                  <a
                    href="https://go.apimart.ai/gh-horizon"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-green-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95"
                  >
                    Visit sponsor
                  </a>
                </div>

                <div className="max-w-3xl">
                  <a
                    href="https://go.apimart.ai/gh-horizon"
                    target="_blank"
                    rel="noreferrer"
                    className="text-2xl font-semibold text-gray-900 hover:text-cyan-700"
                  >
                    APIMart
                  </a>
                  <p className="mt-4 text-base leading-8 text-gray-700">
                    Thanks to APIMart for sponsoring this project! APIMart is a low-cost API platform for AI image &amp; video generation: GPT-Image-2 from $0.006/image, 160+ images per dollar.
                  </p>
                  <p className="mt-4 text-base leading-8 text-gray-700">
                    One async API covers both image and video: submit a task, get an ID, and fetch results via polling or callback. Batch tens of thousands of images without timeouts, switch models without changing code, and pay as you go with no monthly fee.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
