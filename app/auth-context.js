"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRedirectResult(auth).catch((e) => console.error("Redirect sign-in error:", e));
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        setProfile(snap.exists() ? snap.data() : null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      if (e.code === "auth/popup-blocked" || e.code === "auth/popup-closed-by-user" || e.code === "auth/cancelled-popup-request") {
        await signInWithRedirect(auth, googleProvider);
      } else {
        console.error(e);
        alert("Sign-in failed: " + e.message);
      }
    }
  };
  const logout = () => signOut(auth);

  const savePhone = async (phone) => {
    if (!user) return;
    const data = { name: user.displayName, email: user.email, phone };
    await setDoc(doc(db, "users", user.uid), data, { merge: true });
    setProfile(data);
  };

  return (
    <AuthCtx.Provider value={{ user, profile, loading, login, logout, savePhone }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
