import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HeatPumpClarity — NYS Clean Heat Incentives Made Simple",
  description:
    "Find out what heat pump incentives you qualify for under the NYS Clean Heat program. Plain English, no jargon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc]">
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563eb] text-white font-bold text-sm">
                HP
              </div>
              <span className="text-lg font-semibold text-gray-900">
                HeatPumpClarity
              </span>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-4 text-sm">
              <Link
                href="/eligibility"
                className="rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                Check Eligibility
              </Link>
              <Link
                href="/contractor"
                className="rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                Contractors
              </Link>
              <Link
                href="/admin"
                className="rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t bg-white py-8 mt-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} HeatPumpClarity. All rights reserved.</p>
              <p className="text-xs max-w-md text-center sm:text-right">
                Incentive amounts shown are estimates. Final eligibility and
                amounts depend on current program rules and utility requirements.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
