export function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-orange-400 to-red-500 text-white text-xs font-bold">
              H
            </div>
            <span className="text-sm text-gray-600">© 2026 Horizon. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">GitHub</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Twitter</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
