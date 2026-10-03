import Link from "next/link";

export default function MenuLayout({ children }) {
  return (
    <div className="menu-layout">
      <aside className="sidebar">
        <h3>Categories</h3>

        <ul>
          <li>
            <Link href="/menu">All Dishes</Link>
          </li>

          <li>
            <Link href="/menu?category=traditional">Traditional</Link>
          </li>

          <li>
            <Link href="/menu?category=vegetarian">Vegetarian</Link>
          </li>

          <li>
            <Link href="/menu?category=fast-food">Fast Food</Link>
          </li>
        </ul>
      </aside>

      <div>{children}</div>
    </div>
  );
}
