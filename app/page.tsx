export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black">
      <main className="flex flex-col items-center justify-center px-6">
        <h1 className="text-center text-4xl font-light leading-tight tracking-tight text-black dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block">
            AI curates the news.
          </span>
          <span className="mt-2 block text-zinc-500 dark:text-zinc-400 sm:mt-4">
            You just read.
          </span>
        </h1>
      </main>
    </div>
  );
}
