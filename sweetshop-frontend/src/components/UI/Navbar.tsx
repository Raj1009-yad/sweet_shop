// src/components/UI/Navbar.tsx
import { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const cart = useCart();
  const auth = useContext(AuthContext)!;
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    auth.logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto p-3 flex items-center justify-between">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-xl">
            SweetShop
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-5">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-indigo-600" : "text-gray-700"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? "text-indigo-600" : "text-gray-700"
            }
          >
            Admin
          </NavLink>

          {/* CART BUTTON */}
          <button
            onClick={() => navigate("/cart")}
            className="relative flex items-center gap-1"
          >
            🛒
            <span className="text-sm">{cart.totalCount}</span>
            <span className="text-sm font-medium">₹{cart.total}</span>
          </button>

          {/* LOGIN / LOGOUT */}
          {!auth.user ? (
            <Link
              to="/login"
              className="px-3 py-1 bg-indigo-600 text-white rounded"
            >
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

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMobileOpen((v) => !v)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden p-3 border-t flex flex-col gap-3 bg-white">

          <NavLink
            to="/"
            onClick={() => setMobileOpen(false)}
            className="text-gray-700"
          >
            Home
          </NavLink>

          <NavLink
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className="text-gray-700"
          >
            Admin
          </NavLink>

          {/* CART */}
          <button
            onClick={() => {
              setMobileOpen(false);
              navigate("/cart");
            }}
            className="text-gray-700 text-left"
          >
            🛒 Cart ({cart.totalCount}) — ₹{cart.total}
          </button>

          {/* LOGIN / LOGOUT */}
          {!auth.user ? (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-1 bg-indigo-600 text-white rounded w-fit"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="px-3 py-1 bg-red-500 text-white rounded w-fit"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
