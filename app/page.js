import Link from "next/link";
import Nav from "./components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 pt-16 pb-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-slate-200 text-xs font-medium text-slate-600 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            For graduates of 2026
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-700 bg-clip-text text-transparent mb-5">
            Graduation Tickets
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            A simple way to buy and sell tickets for the graduation and honor ceremonies — straight to your classmates' WhatsApp.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          <Link
            href="/buy"
            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-7 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100 transition-all"
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:scale-110 transition-transform" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl mb-4 shadow-md">
                🛒
              </div>
              <h2 className="font-bold text-xl mb-2">Buy Tickets</h2>
              <p className="text-sm text-slate-600 mb-4">Browse all available tickets, filter by type, and contact the seller in one click.</p>
              <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700 inline-flex items-center gap-1">
                Browse listings →
              </span>
            </div>
          </Link>

          <Link
            href="/sell"
            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-7 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100 transition-all"
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 group-hover:scale-110 transition-transform" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-2xl mb-4 shadow-md">
                💰
              </div>
              <h2 className="font-bold text-xl mb-2">Sell Tickets</h2>
              <p className="text-sm text-slate-600 mb-4">List your extra tickets, set your price in SAR, and update or remove them anytime.</p>
              <span className="text-sm font-medium text-purple-600 group-hover:text-purple-700 inline-flex items-center gap-1">
                List a ticket →
              </span>
            </div>
          </Link>
        </div>

        {process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL && (
          <div className="mt-10 max-w-3xl mx-auto bg-white/70 backdrop-blur border border-slate-200 rounded-2xl px-6 py-5 shadow-sm flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[220px]">
              <p className="font-semibold text-slate-900">Don't want to miss a ticket?</p>
              <p className="text-sm text-slate-500 mt-0.5">Get a Telegram notification every time a new ticket is listed.</p>
            </div>
            <a
              href={process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#229ED9] hover:bg-[#1a87bc] text-white font-semibold text-sm shadow-md shadow-blue-200 transition shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
              </svg>
              Join the channel
            </a>
          </div>
        )}

        <div className="mt-16 grid grid-cols-2 gap-4 max-w-md mx-auto text-center">
          <div className="p-4">
            <div className="text-2xl mb-1">🔒</div>
            <div className="text-xs font-semibold text-slate-700">Sign in with Google</div>
            <div className="text-xs text-slate-500 mt-1">Real names only</div>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-1">💬</div>
            <div className="text-xs font-semibold text-slate-700">Direct WhatsApp</div>
            <div className="text-xs text-slate-500 mt-1">Talk to sellers fast</div>
          </div>
        </div>
      </main>
    </>
  );
}
