"use client";
import { useState } from "react";
import { useAuth } from "../auth-context";

export default function PhoneGate({ children }) {
  const { user, profile, loading, login, savePhone } = useAuth();
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <div className="p-16 text-center">
        <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl mb-4 shadow-md">
            🔒
          </div>
          <h2 className="text-xl font-bold mb-2">Sign in required</h2>
          <p className="text-sm text-slate-600 mb-6">Sign in with your Google account to continue.</p>
          <button
            onClick={login}
            className="w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition shadow-sm flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
              <path fill="#fff" d="M21.35 11.1H12v3.2h5.35c-.5 2.4-2.5 3.8-5.35 3.8-3.2 0-5.8-2.6-5.8-5.8s2.6-5.8 5.8-5.8c1.4 0 2.7.5 3.7 1.4l2.4-2.4C16.5 3.9 14.4 3 12 3 7 3 3 7 3 12s4 9 9 9c5.2 0 8.7-3.7 8.7-8.8 0-.5-.05-1-.15-1.5z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </main>
    );
  }

  if (!profile?.phone) {
    return (
      <main className="max-w-md mx-auto px-6 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-2xl mb-4 shadow-md">
            📱
          </div>
          <h2 className="text-xl font-bold mb-2">Add your WhatsApp number</h2>
          <p className="text-sm text-slate-600 mb-5">
            Buyers will use this to contact you. Use international format (e.g. <span className="font-mono text-slate-700">9665XXXXXXXX</span>).
          </p>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ""))}
            placeholder="9665XXXXXXXX"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 mb-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
          <button
            disabled={!phone || saving}
            onClick={async () => { setSaving(true); await savePhone(phone); setSaving(false); }}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 transition shadow-md shadow-indigo-200"
          >
            {saving ? "Saving..." : "Save & continue"}
          </button>
        </div>
      </main>
    );
  }

  return children;
}
