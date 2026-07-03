import "./globals.css";
import { AuthProvider } from "./auth-context";

export const metadata = { title: "Graduation Tickets", description: "Buy & sell graduation tickets" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="text-slate-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
