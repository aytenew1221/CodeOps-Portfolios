import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Addis Eats",
  description: "Ethiopian food ordering application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <Link href="/">Addis Eats</Link>

            {" | "}

            <Link href="/menu">Menu</Link>

            {" | "}

            <Link href="/checkout">Checkout</Link>

            {" | "}

            <Link href="/orders">Orders</Link>
          </nav>
        </header>

        {children}

        <footer>
          <p>© 2026 Addis Eats</p>
        </footer>
      </body>
    </html>
  );
}
