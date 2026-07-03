"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Nav from "../components/Nav";

const TYPE_LABEL = {
  graduation: "Graduation Ceremony",
  honor_girls: "Honor Ceremony - Girls",
  honor_first: "Honor Ceremony - First Honor",
  honor_second: "Honor Ceremony - Second Honor",
  honor_third: "Honor Ceremony - Third Honor",
};

const isHonor = (t) => t && t.startsWith("honor");

const TYPE_BADGE = {
  graduation: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  honor_girls: "bg-purple-50 text-purple-700 ring-purple-200",
  honor_first: "bg-yellow-50 text-yellow-800 ring-yellow-200",
  honor_second: "bg-slate-100 text-slate-700 ring-slate-200",
  honor_third: "bg-orange-50 text-orange-700 ring-orange-200",
};

const TYPE_GRADIENT = {
  graduation: "from-indigo-500 to-blue-500",
  honor_girls: "from-purple-500 to-pink-500",
  honor_first: "from-yellow-400 to-amber-500",
  honor_second: "from-slate-400 to-slate-500",
  honor_third: "from-orange-400 to-red-500",
};

function waLink(phone, name, listing) {
  const clean = (phone || "").replace(/[^\d]/g, "");
  const msg = encodeURIComponent(
    `Hi ${name || ""}, I'd like to buy your ${TYPE_LABEL[listing.ticketType]} ticket(s) listed for ${listing.price} SAR.`
  );
  return `https://wa.me/${clean}?text=${msg}`;
}

const selectClass =
  "w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition bg-no-repeat bg-[right_0.85rem_center] bg-[length:0.7rem] bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2364748b%22%3E%3Cpath%20d%3D%22M5.5%207.5L10%2012l4.5-4.5z%22%2F%3E%3C%2Fsvg%3E')]";

export default function BuyPage() {
  const [listings, setListings] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    let blocked = new Set();
    const q = query(collection(db, "listings"), where("quantity", ">", 0));
    const unsub = onSnapshot(q, async (snap) => {
      if (blocked.size === 0) {
        try {
          const bs = await getDocs(query(collection(db, "users"), where("blocked", "==", true)));
          bs.forEach((d) => blocked.add(d.id));
        } catch {}
      }
      const items = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((l) => !blocked.has(l.sellerId));
      items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setListings(items);
    });
    return unsub;
  }, []);

  let filtered =
    typeFilter === "all" ? listings :
    typeFilter === "honor_all" ? listings.filter((l) => isHonor(l.ticketType)) :
    listings.filter((l) => l.ticketType === typeFilter);

  if (sortBy === "price_asc") {
    filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortBy === "price_desc") {
    filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Available Tickets</h1>
            <p className="text-sm text-slate-500 mt-1">Browse and contact sellers directly via WhatsApp.</p>
          </div>
          {process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL && (
            <a
              href={process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Join our Telegram channel to get notified about new ticket listings"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#229ED9] hover:bg-[#1a87bc] text-white font-semibold text-sm shadow-sm transition"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
              </svg>
              Notify me on new listings
            </a>
          )}
        </div>

        <div className="bg-white/70 backdrop-blur border border-slate-200 rounded-2xl p-4 mb-6 flex gap-3 flex-wrap items-end shadow-sm">
          <div className="flex-1 min-w-[220px]">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Ticket type</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectClass}>
              <option value="all">All types</option>
              <option value="graduation">Graduation Ceremony</option>
              <option value="honor_all">Honor Ceremony — All</option>
              <option value="honor_girls">Honor Ceremony — Girls</option>
              <option value="honor_first">Honor Ceremony — First Honor</option>
              <option value="honor_second">Honor Ceremony — Second Honor</option>
              <option value="honor_third">Honor Ceremony — Third Honor</option>
            </select>
          </div>
          <div className="flex-1 min-w-[220px]">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Sort by</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
              <option value="newest">Newest first</option>
              <option value="price_asc">Price: low → high</option>
              <option value="price_desc">Price: high → low</option>
            </select>
          </div>
          {(typeFilter !== "all" || sortBy !== "newest") && (
            <button
              onClick={() => { setTypeFilter("all"); setSortBy("newest"); }}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 px-3 py-2.5"
            >
              Clear
            </button>
          )}
        </div>

        <div className="text-sm text-slate-500 mb-4">
          <span className="font-medium text-slate-700">{filtered.length}</span> listing{filtered.length === 1 ? "" : "s"} available
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">🎟️</div>
            <div className="text-slate-700 font-medium mb-1">No tickets available</div>
            <div className="text-sm text-slate-500">Check back later or adjust your filters.</div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((l) => (
              <div key={l.id} className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all">
                <div className={`absolute top-0 left-5 right-5 h-1 rounded-b-full bg-gradient-to-r ${TYPE_GRADIENT[l.ticketType] || "from-slate-400 to-slate-500"}`} />
                <div className="flex justify-between items-start gap-2 mb-4">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ring-1 ring-inset ${TYPE_BADGE[l.ticketType] || "bg-slate-100 text-slate-700 ring-slate-200"}`}>
                    {TYPE_LABEL[l.ticketType]}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-3xl font-extrabold tracking-tight">{l.price}</span>
                  <span className="text-sm font-medium text-slate-500">SAR</span>
                </div>
                <div className="text-xs text-slate-500 mb-4">per ticket</div>

                <div className="flex items-center justify-between text-sm py-3 border-y border-slate-100 mb-4">
                  <div className="text-slate-600">
                    <span className="font-semibold text-slate-900">{l.quantity}</span> available
                  </div>
                  <div className="text-slate-500 truncate ml-3">{l.sellerName}</div>
                </div>

                <a
                  href={waLink(l.sellerPhone, l.sellerName, l)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm shadow-emerald-200"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  Contact on WhatsApp
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
