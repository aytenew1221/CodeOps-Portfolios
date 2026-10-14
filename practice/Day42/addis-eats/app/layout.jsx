import "./globals.css";
import Link from "next/link";

import Providers from "./providers";
import CartBadge from "./cart/CartBadge";
import AuthNav from "./AuthNav";

export const metadata = {
  title: "Addis Eats",
  description: "Secure Ethiopian food ordering application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="border-b bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
              <Link
                href="/"
                className="text-2xl font-extrabold text-purple-700"
              >
                Addis Eats
              </Link>

              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <Link href="/" className="hover:text-purple-700">
                  Home
                </Link>

                <Link href="/menu" className="hover:text-purple-700">
                  Menu
                </Link>

                <Link href="/cart" className="hover:text-purple-700">
                  <CartBadge />
                </Link>

                <Link href="/checkout" className="hover:text-purple-700">
                  Checkout
                </Link>

                <AuthNav />
              </div>
            </nav>
          </header>

          {children}

          <footer className="mt-16 border-t bg-white">
            <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">
              Addis Eats · Authentication & Authorization
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
