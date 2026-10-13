import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/app/components/Navbar";

export const metadata: Metadata = {
  title: "Sponsors | Horizon",
  description: "Meet the lead sponsor and supporting sponsors of Horizon.",
};

const leadSponsor = {
  name: "Modelflare",
  url: "https://modelflare.dev/sign-up?utm_source=github&utm_campaign=horizon",
  image: "/sponsors/modelflare.png",
  imageBackground: "#030712",
  width: 2370,
  height: 1200,
  paragraphs: [
    "Modelflare: Full strength, stable, nothing watered down. Global SOTA models at a lower cost. Operated by US-based Havenbyte LLC, Modelflare supports GPT, Claude, Gemini, Grok, and other leading models through common compatible protocols, plus 40+ image and video models.",
    "Cache compensation is a highlight: selected OpenAI groups (price-first, stable, and premium) guarantee daily cache hit rates of 65%, 75%, or 85%, and if eligible requests fall short, Modelflare refunds the difference, visible on the usage dashboard after settlement.",
    "Special offers: a single top-up of US$20 unlocks the GPT discount group at a 0.015x price multiplier, and a single top-up of US$50 unlocks the Claude discount group at a 0.03x multiplier.",
  ],
  action: "Register via this exclusive link to get started",
};

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
            <h2 id="lead-sponsor" className="text-2xl font-semibold text-gray-900">Lead sponsor</h2>
            <article className="mt-6">
              <a href={leadSponsor.url} target="_blank" rel="noreferrer" className="block" style={{ backgroundColor: leadSponsor.imageBackground }}>
                <Image src={leadSponsor.image} alt={leadSponsor.name} width={leadSponsor.width} height={leadSponsor.height} sizes="(max-width: 767px) 100vw, 864px" className="h-auto max-h-72 w-full object-contain" />
              </a>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">Thanks to {leadSponsor.name} for sponsoring this project!</h3>
              {leadSponsor.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-base leading-8 text-gray-600">{paragraph}</p>
              ))}
              <a href={leadSponsor.url} target="_blank" rel="noreferrer" className="mt-4 inline-block font-medium text-orange-700 underline decoration-orange-200 underline-offset-4 hover:text-orange-800">
                {leadSponsor.action}
              </a>
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
