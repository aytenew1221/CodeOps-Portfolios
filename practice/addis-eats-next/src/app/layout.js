import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <Link href="/">Addis Eats</Link> <Link href="/menu">Menu</Link>{" "}
            <Link href="/cart">Cart</Link>{" "}
            <Link href="/checkout">Checkout</Link>
          </nav>
        </header>

        <main>{children}</main>

        <footer>
          <p>© 2026 Addis Eats</p>
        </footer>
      </body>
    </html>
  );
}
