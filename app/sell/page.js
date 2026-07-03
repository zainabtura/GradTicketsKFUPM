"use client";
import { useEffect, useState } from "react";
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, updateDoc, where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { notifyTelegram } from "../../lib/telegram";
import { useAuth } from "../auth-context";
import Nav from "../components/Nav";
import PhoneGate from "../components/PhoneGate";

const TYPE_LABEL = {
  graduation: "Graduation Ceremony",
  honor_girls: "Honor Ceremony - Girls",
  honor_first: "Honor Ceremony - First Honor",
  honor_second: "Honor Ceremony - Second Honor",
  honor_third: "Honor Ceremony - Third Honor",
};

const TYPE_BADGE = {
  graduation: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  honor_girls: "bg-purple-50 text-purple-700 ring-purple-200",
  honor_first: "bg-yellow-50 text-yellow-800 ring-yellow-200",
  honor_second: "bg-slate-100 text-slate-700 ring-slate-200",
  honor_third: "bg-orange-50 text-orange-700 ring-orange-200",
};

const inputClass =
  "w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition";
const selectClass =
  inputClass + " appearance-none pr-10 bg-no-repeat bg-[right_0.85rem_center] bg-[length:0.7rem] bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2364748b%22%3E%3Cpath%20d%3D%22M5.5%207.5L10%2012l4.5-4.5z%22%2F%3E%3C%2Fsvg%3E')]";

function SellInner() {
  const { user, profile } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [ticketType, setTicketType] = useState("graduation");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "listings"), where("sellerId", "==", user.uid));
    return onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setMyListings(items);
    });
  }, [user]);

  if (profile?.blocked) {
    return (
      <main className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <div className="text-4xl mb-3">🚫</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">Account blocked</h2>
          <p className="text-sm text-red-600">
            Your account has been blocked from listing tickets. If you believe this is a mistake, please contact the page owner.
          </p>
        </div>
      </main>
    );
  }

  async function createListing(e) {
    e.preventDefault();
    if (!price || !quantity) return;
    setSubmitting(true);
    const listing = {
      sellerId: user.uid,
      sellerName: profile.name || user.displayName,
      sellerPhone: profile.phone,
      ticketType,
      price: Number(price),
      quantity: Number(quantity),
    };
    await addDoc(collection(db, "listings"), { ...listing, createdAt: serverTimestamp() });
    notifyTelegram(listing);
    setPrice(""); setQuantity(""); setSubmitting(false);
  }

  async function updateQty(id, qty) {
    const n = Number(qty);
    if (isNaN(n) || n < 0) return;
    await updateDoc(doc(db, "listings", id), { quantity: n });
  }

  async function removeListing(id) {
    if (!confirm("Delete this listing?")) return;
    await deleteDoc(doc(db, "listings", id));
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Sell Tickets</h1>
        <p className="text-sm text-slate-500 mt-1">List your extra tickets and manage them anytime.</p>
      </div>

      <form onSubmit={createListing} className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
        <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs flex items-center justify-center font-bold">+</span>
          Create new listing
        </h2>
        <div className="grid sm:grid-cols-3 gap-3 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Type</label>
            <select value={ticketType} onChange={(e) => setTicketType(e.target.value)} className={selectClass}>
              {Object.entries(TYPE_LABEL).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Price (SAR)</label>
            <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} placeholder="500" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Quantity</label>
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputClass} placeholder="1" required />
          </div>
        </div>
        <button
          disabled={submitting}
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-semibold disabled:opacity-50 transition shadow-md shadow-indigo-200"
        >
          {submitting ? "Adding..." : "Add listing"}
        </button>
      </form>

      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-semibold text-slate-900">My listings</h2>
        <span className="text-sm text-slate-500">{myListings.length} total</span>
      </div>

      {myListings.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">
          <div className="text-3xl mb-2">📋</div>
          <div className="text-slate-700 font-medium">No listings yet</div>
          <div className="text-sm text-slate-500 mt-1">Add your first ticket above.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {myListings.map((l) => (
            <div key={l.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 flex-wrap hover:shadow-sm transition">
              <div className="flex-1 min-w-[200px]">
                <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ring-1 ring-inset mb-1.5 ${TYPE_BADGE[l.ticketType] || "bg-slate-100 text-slate-700 ring-slate-200"}`}>
                  {TYPE_LABEL[l.ticketType]}
                </span>
                <div className="text-sm text-slate-600">
                  <span className="font-bold text-slate-900">{l.price}</span> SAR per ticket
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Remaining</label>
                <input
                  type="number" min="0" defaultValue={l.quantity}
                  onBlur={(e) => {
                    if (Number(e.target.value) !== l.quantity) updateQty(l.id, e.target.value);
                  }}
                  className="w-20 border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                />
              </div>
              <button
                onClick={() => removeListing(l.id)}
                className="text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function SellPage() {
  return (
    <>
      <Nav />
      <PhoneGate>
        <SellInner />
      </PhoneGate>
    </>
  );
}
