'use client'

interface NewsletterFormProps {
  variant?: 'dark' | 'light'
}

export default function NewsletterForm({ variant = 'dark' }: NewsletterFormProps) {
  const isDark = variant === 'dark'
  return (
    <form
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      onSubmit={(e) => {
        e.preventDefault()
        alert('Thanks for subscribing! (This is a sample website)')
      }}
    >
      <input
        type="email"
        placeholder="Enter your email address"
        className={`flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors ${
          isDark
            ? 'bg-ink-800 border border-ink-700 text-white placeholder-ink-500 focus:border-cream-200'
            : 'bg-white border border-ink-200 text-ink-900 placeholder-ink-400 focus:border-ink-400'
        }`}
      />
      <button
        type="submit"
        className="px-6 py-3 bg-cream-200 text-ink-900 font-semibold text-sm rounded-xl hover:bg-cream-300 transition-colors whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  )
}
