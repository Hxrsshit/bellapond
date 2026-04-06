import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-cream-50">
      <p className="text-xs font-semibold tracking-widest uppercase text-ink-400 mb-4">404 — Not Found</p>
      <h1 className="font-serif text-5xl font-bold text-ink-900 mb-4">Page not found</h1>
      <p className="text-base text-ink-500 mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-ink-900 text-white text-sm font-semibold rounded-xl hover:bg-ink-700 transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/products"
          className="px-6 py-3 border border-ink-300 text-ink-800 text-sm font-semibold rounded-xl hover:bg-ink-50 transition-colors"
        >
          Shop Products
        </Link>
      </div>
    </div>
  )
}
