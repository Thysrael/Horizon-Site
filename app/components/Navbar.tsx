import Link from "next/link";
import {
  AnimatedLogo,
  AuthButton,
  MobileMenu,
  SearchInput,
} from "./ClientHome";

interface NavbarProps {
  searchQuery?: string;
}

export function Navbar({ searchQuery }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100/50 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <AnimatedLogo />
          </Link>
          <div className="hidden md:block h-6 w-px bg-gray-200" />
          <div className="hidden md:block">
            <SearchInput initialQuery={searchQuery} />
          </div>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
            Sources
          </Link>
          <Link href="/doc" className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
            Documents
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
            About
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <AuthButton />
          <Link
            href="/submit"
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-2 sm:px-4 text-sm font-medium text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 transition-all"
          >
            <span className="text-lg leading-none">+</span>
            <span className="hidden sm:inline">Submit</span>
          </Link>
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
