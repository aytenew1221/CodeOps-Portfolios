import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <>
      <Navbar />

      <main className="container">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Addis Eats</p>
      </footer>
    </>
  );
}

export default Layout;
