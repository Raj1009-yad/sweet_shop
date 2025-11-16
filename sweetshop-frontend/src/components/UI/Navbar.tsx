// src/components/UI/Navbar.tsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { listSweets } from "../../api/sweets"; // correct relative path
import toast from "react-hot-toast";

export default function Navbar() {
  const cart = useCart();
  const auth = AuthContext!;
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // simple search navigate
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // navigate to home with query param or implement your search handler
    navigate(/?q=${encodeURIComponent(search)});
  };

  const handleLogout = () => {
    try {
      // AuthContext is created as a React context. Use with useContext where you consume it.
      const ctx = (window as any)._AUTH_CONTEXT_ as any;
      // fallback — prefer using useContext(AuthContext) inside components that can access it.
      if (ctx?.logout) ctx.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out");
      navigate("/login");
    } catch {
      // fallback behaviour
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-xl">
            SweetShop
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sweets..."
              className="p-2 border rounded"
            />
            <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">Search</button>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <NavLink to="/" className={({ isActive }) => (isActive ? "text-indigo-600" : "text-gray-700")}>
            Home
          </NavLink>

          <NavLink to="/admin" className={({ isActive }) => (isActive ? "text-indigo-600" : "text-gray-700")}>
            Admin
          </NavLink>

          <button
            onClick={() => {
              // open cart drawer or navigate
              navigate("/cart");
            }}
            title="Cart"
            className="relative"
          >
            🛒
            <span className="ml-1 text-sm">{cart.totalCount}</span>
            <span className="ml-2 text-sm font-medium">₹{cart.total}</span>
          </button>

          {localStorage.getItem("token") ? (
            <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded">
              Logout
            </button>
          ) : (
            <Link to="/login" className="px-3 py-1 bg-indigo-600 text-white rounded">
              Login
            </Link>
          )}

          <button className="md:hidden" onClick={() => setMobileOpen((s) => !s)}>
            ☰
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden p-2 border-t">
          <form onSubmit={handleSearch} className="flex gap-2 mb-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="p-2 border rounded flex-1" />
            <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">Go</button>
          </form>
          <div className="flex flex-col gap-2">
            <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/admin" onClick={() => setMobileOpen(false)}>Admin</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
