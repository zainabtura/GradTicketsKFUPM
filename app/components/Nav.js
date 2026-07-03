"use client";
import Link from "next/link";
import { useAuth } from "../auth-context";

export default function Nav() {
  const { user, profile, login, logout } = useAuth();
  return (
    <nav className="glass sticky top-0 z-50 border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm">🎓</span>
          <span className="text-base">Grad Tickets</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/buy" className="px-3 py-1.5 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition">Buy</Link>
          <Link href="/sell" className="px-3 py-1.5 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition">Sell</Link>
          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 hidden sm:inline px-2">{profile?.name || user.displayName}</span>
              <button onClick={logout} className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition">
                Sign out
              </button>
            </div>
          ) : (
            <button onClick={login} className="text-sm bg-slate-900 text-white hover:bg-slate-800 px-4 py-1.5 rounded-lg transition shadow-sm">
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
