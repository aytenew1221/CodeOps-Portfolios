import "./globals.css";
import Link from "next/link";
import Providers from "./providers";
import CartBadge from "./cart/CartBadge";

export const metadata = {
  title: "Addis Eats",
  description:
    "Addis Eats — Ethiopian food ordering and Day 41 data fetching demo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Providers>
          {/* Header */}
          <header className="border-b bg-white">
            <nav
              className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
              aria-label="Main navigation"
            >
              {/* Logo */}
              <Link
                href="/"
                className="text-2xl font-extrabold text-purple-700"
              >
                Addis Eats
              </Link>

              {/* Navigation */}
              <div className="flex items-center gap-5 text-sm font-medium">
                <Link href="/" className="transition hover:text-purple-700">
                  Home
                </Link>

                <Link href="/menu" className="transition hover:text-purple-700">
                  Menu
                </Link>

                <Link
                  href="/orders/1001"
                  className="transition hover:text-purple-700"
                >
                  Order #1001
                </Link>

                <Link
                  href="/tanstack"
                  className="transition hover:text-purple-700"
                >
                  TanStack Demo
                </Link>

                <Link
                  href="/cart"
                  className="transition hover:text-purple-700"
                  aria-label="Shopping cart"
                >
                  <CartBadge />
                </Link>
              </div>
            </nav>
          </header>

          {/* Page Content */}
          <main>{children}</main>

          {/* Footer */}
          <footer className="mt-16 border-t bg-white">
            <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">
              Addis Eats &middot; &copy; 2026
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
