import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/app/components/Navbar";

export const metadata: Metadata = {
  title: "Sponsors | Horizon",
  description: "Meet Modelflare, Horizon's lead sponsor, and supporting sponsors Compshare and OfoxAI.",
};

const modelflareUrl = "https://modelflare.dev/sign-up?utm_source=github&utm_campaign=horizon";

const supportingSponsors = [
  {
    name: "Compshare",
    url: "https://www.compshare.cn/?ytag=GPU_YY_git_Horizon",
    image: "/sponsors/compshare.png",
    width: 220,
    height: 88,
    description: "Compshare currently supports Horizon. Compshare is UCloud's AI cloud platform, offering cost-effective monthly and pay-as-you-go domestic model agent plans starting from RMB 49/month, as well as stable officially relayed overseas models. It supports Claude Code, Codex, and API usage, with enterprise-grade high concurrency, 24/7 technical support, and self-service invoicing.",
    offer: "Register through their link to receive a free RMB 5 trial credit.",
    action: "Visit Compshare",
  },
  {
    name: "OfoxAI",
    url: "https://ofox.ai/?utm_source=github&utm_medium=sponsorship&utm_content=horizon",
    image: "/sponsors/ofoxai.svg",
    width: 1920,
    height: 1080,
    description: "OfoxAI is a unified AI API platform bringing together text, image, and video models from multiple providers. With OpenAI-compatible endpoints and native Anthropic and Gemini interfaces, developers can access models for AI applications, agents, and content creation through one platform.",
    offer: null,
    action: "Explore OfoxAI models and APIs",
  },
];

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar showSearch={false} />

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50 sm:p-10">
          <header className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Sponsors</h1>
            <p className="mt-6 text-base leading-8 text-gray-600">
              Horizon is an open-source, self-hosted project maintained in spare time. Thank you to the sponsors who help support the project.
            </p>
          </header>

          <section aria-labelledby="lead-sponsor" className="mt-10 border-t border-gray-100 pt-10">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id="lead-sponsor" className="text-2xl font-semibold text-gray-900">Lead sponsor</h2>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-800">Featured partner</span>
            </div>

            <article className="mt-6 overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-lg shadow-orange-100/50">
              <div className="grid items-center gap-6 bg-gradient-to-br from-orange-50 to-amber-50 p-6 sm:p-8 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-orange-700">Modelflare</h3>
                  <p className="mt-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
                    Full strength. Stable.<br />Nothing watered down.
                  </p>
                  <p className="mt-4 text-base leading-7 text-gray-600">Global SOTA models at a lower cost.</p>
                  <p className="mt-5 text-sm font-medium leading-7 text-gray-700">GPT · Claude · Gemini · Grok<br />40+ image and video models</p>
                </div>
                <a href={modelflareUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-2xl bg-gray-950 shadow-sm ring-1 ring-orange-100 transition-shadow hover:shadow-md">
                  <Image src="/sponsors/modelflare.png" alt="Modelflare" width={2370} height={1200} sizes="(max-width: 767px) 100vw, 400px" className="h-auto w-full" />
                </a>
              </div>

              <div className="p-6 sm:p-8">
                <p className="text-lg font-semibold text-gray-900">Thanks to Modelflare for sponsoring this project!</p>
                <p className="mt-4 text-base leading-8 text-gray-600">
                  Operated by US-based Havenbyte LLC, Modelflare supports GPT, Claude, Gemini, Grok, and other leading models through common compatible protocols, plus 40+ image and video models.
                </p>
                <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
                  <h4 className="font-semibold text-gray-900">Daily cache hit guarantees</h4>
                  <dl className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      { label: "Price-first", rate: "65%" },
                      { label: "Stable", rate: "75%" },
                      { label: "Premium", rate: "85%" },
                    ].map(({ label, rate }) => (
                      <div key={label}>
                        <dt className="text-xs font-medium text-gray-500 sm:text-sm">{label}</dt>
                        <dd className="mt-1 text-2xl font-bold tracking-tight text-orange-700 sm:text-3xl">{rate}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 text-sm leading-7 text-gray-600">
                    Selected OpenAI groups guarantee these daily cache hit rates. If eligible requests fall short, Modelflare refunds the difference, visible on the usage dashboard after settlement.
                  </p>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-orange-50 p-5">
                    <h4 className="font-semibold text-gray-900">GPT discount group</h4>
                    <p className="mt-2 text-sm leading-7 text-gray-700">A single top-up of <strong>US$20</strong> unlocks a <strong>0.015x</strong> price multiplier.</p>
                  </div>
                  <div className="rounded-2xl bg-orange-50 p-5">
                    <h4 className="font-semibold text-gray-900">Claude discount group</h4>
                    <p className="mt-2 text-sm leading-7 text-gray-700">A single top-up of <strong>US$50</strong> unlocks a <strong>0.03x</strong> price multiplier.</p>
                  </div>
                </div>
                <a href={modelflareUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:opacity-95 sm:w-auto">
                  Register via our exclusive link <span aria-hidden="true" className="ml-2">→</span>
                </a>
              </div>
            </article>
          </section>

          <section aria-labelledby="supporting-sponsors" className="mt-12 border-t border-gray-200 pt-10">
            <h2 id="supporting-sponsors" className="text-2xl font-semibold text-gray-900">Supporting sponsors</h2>
            <div className="mt-6 divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200">
              {supportingSponsors.map((sponsor) => (
                <article key={sponsor.name} className="grid gap-5 p-6 sm:grid-cols-[180px_1fr] sm:gap-8">
                  <a href={sponsor.url} target="_blank" rel="noreferrer" className="flex min-h-28 items-center justify-center self-start rounded-xl border border-gray-100 bg-white p-4 transition-colors hover:border-orange-200">
                    <Image src={sponsor.image} alt={`${sponsor.name} logo`} width={sponsor.width} height={sponsor.height} sizes="180px" className="h-auto max-h-28 w-full max-w-[180px] object-contain" />
                  </a>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{sponsor.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-gray-600">{sponsor.description}</p>
                    {sponsor.offer && <p className="mt-3 text-sm leading-7 text-gray-600">{sponsor.offer}</p>}
                    <a href={sponsor.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center text-sm font-semibold text-orange-700 underline decoration-orange-200 underline-offset-4 hover:text-orange-800">
                      {sponsor.action} <span aria-hidden="true" className="ml-2">→</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="become-sponsor" className="mt-12 border-t border-gray-100 pt-10">
            <h2 id="become-sponsor" className="text-2xl font-semibold text-gray-900">Become a sponsor</h2>
            <p className="mt-4 text-base leading-8 text-gray-600">
              If Horizon helps you build a better personal news radar, run a team briefing, or test your AI platform with real workflows, sponsorship is welcome. Sponsors receive a mention in the README and a dedicated showcase entry on the project site.
            </p>
            <p className="mt-4 text-base leading-8 text-gray-600">
              Want to appear here? Email{" "}
              <a href="mailto:thysrael@163.com" className="font-medium text-orange-600 underline decoration-orange-200 underline-offset-4 hover:text-orange-700">thysrael@163.com</a>{" "}
              or{" "}
              <a href="https://github.com/Thysrael/Horizon/issues/new" target="_blank" rel="noreferrer" className="font-medium text-orange-600 underline decoration-orange-200 underline-offset-4 hover:text-orange-700">open an issue</a>{" "}
              and mention that you are interested in sponsoring Horizon.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
