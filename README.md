# 🎓 Graduation Tickets

A simple website for buying and selling graduation/honor ceremony tickets among classmates, built for KFUPM's graduation ceremony.

**Stack:** Next.js 14, React, Firebase (Auth + Firestore), Tailwind CSS

## Features
- Sign in with Google
- Add WhatsApp phone number on first sign-in
- **Buy page**: browse all available tickets, filter by type, contact seller via WhatsApp
- **Sell page**: create listings (type, price in SAR, quantity), update remaining quantity, delete listings
- Listings with 0 quantity are hidden from the buy page automatically

## Setup (one-time)

### 1. Install dependencies
```bash
cd ~/Documents/graduation-tickets
npm install
```

### 2. Create a Firebase project
1. Go to https://console.firebase.google.com → **Add project**
2. Once created, click **Web** (`</>`) to register a web app — copy the config values
3. In **Build → Authentication → Sign-in method**, enable **Google**
4. In **Build → Firestore Database**, click **Create database** (start in *test mode* for now)

### 3. Add your Firebase config
Copy `.env.local.example` to `.env.local` and paste the values from your Firebase web app config:
```bash
cp .env.local.example .env.local
```

### 4. Firestore security rules (recommended)
In Firebase console → Firestore → Rules, paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == uid;
    }
    match /listings/{id} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.sellerId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.sellerId;
    }
  }
}
```

### 5. Run it
```bash
npm run dev
```
Open http://localhost:3000

## Deploy (optional)
Push to GitHub and import the project on https://vercel.com — add the same `NEXT_PUBLIC_FIREBASE_*` env vars in Vercel project settings. Then in Firebase → Authentication → Settings → **Authorized domains**, add your Vercel URL.
