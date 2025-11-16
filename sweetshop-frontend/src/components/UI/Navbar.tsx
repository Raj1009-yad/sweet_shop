// src/components/UI/Navbar.tsx
import { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const cart = useCart();
  const auth = useContext(AuthContext)!;
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto p-3 flex items-center justify-between">

        <Link to="/" className="font-bold text-xl">
          SweetShop
        </Link>

        <div className="hidden md:flex items-center gap-5">

          <NavLink to="/" className="text-gray-700">Home</NavLink>

          <NavLink to="/admin" className="text-gray-700">Admin</NavLink>

          {/* Cart */}
          <button onClick={() => navigate("/cart")} className="relative">
            🛒 {cart.totalCount} items — ₹{cart.total}
          </button>

          {!auth.user ? (
            <Link to="/login" className="px-3 py-1 bg-indigo-600 text-white rounded">
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden p-3 flex flex-col gap-3 bg-white border-t">

          <NavLink to="/" onClick={() => setMobileOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/admin" onClick={() => setMobileOpen(false)}>
            Admin
          </NavLink>

          <button
            onClick={() => {
              setMobileOpen(false);
              navigate("/cart");
            }}
          >
            🛒 Cart: {cart.totalCount} items — ₹{cart.total}
          </button>

          {!auth.user ? (
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              Login
            </Link>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}
