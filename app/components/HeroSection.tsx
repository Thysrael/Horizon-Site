import {
  AnimatedSlogan,
  FloatingParticles,
  TypingSubtitle,
} from "./ClientHome";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-gray-100 min-h-[70vh] flex items-center">
      <div className="absolute inset-0 bg-white" />
      <FloatingParticles />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-100" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="text-center">
          <AnimatedSlogan />
          <TypingSubtitle />
          <div className="mt-10 flex justify-center gap-4">
            <button className="group flex items-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-base font-medium text-white shadow-2xl shadow-gray-900/20 hover:shadow-gray-900/40 hover:-translate-y-1 transition-all duration-300">
              <svg className="h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Start
            </button>
            <a
              href="https://github.com/Thysrael/Horizon"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white/80 backdrop-blur-sm px-8 py-4 text-base font-medium text-gray-700 hover:bg-white hover:border-orange-300 hover:text-orange-600 transition-all duration-300"
            >
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
