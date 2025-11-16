import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { FiSearch, FiShoppingCart, FiLogOut, FiUser, FiMenu } from "react-icons/fi";

export default function Navbar() {
  const auth = useContext(AuthContext);
  const nav = useNavigate();

  // useCart will throw if provider missing (good for dev)
  const cart = useCart();

  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartItems = cart.items ?? [];
  const cartQty = cartItems.reduce((s, it) => s + it.qty, 0);
  const cartTotal = cart.total();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-bold text-xl">
            SS
          </div>
          <div>
            <div className="text-lg font-semibold">Sweet Shop</div>
            <div className="text-xs text-slate-500 -mt-0.5">Delicious delivered</div>
          </div>
        </Link>

        <div className="flex-1 flex items-center max-w-2xl ml-6">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-3 text-slate-400" />
            <input
              placeholder="Search sweets, e.g. Gulab Jamun"
              className="input pl-10"
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        </div>

        <div className="ml-4 flex items-center gap-3">
          {/* Cart button + dropdown */}
          <div className="relative">
            <button
              onClick={() => setCartOpen((s) => !s)}
              className="text-slate-700 hover:text-slate-900 inline-flex items-center gap-2"
              aria-expanded={cartOpen}
              aria-haspopup="true"
            >
              <FiShoppingCart size={18} />
              <span className="text-sm hidden md:inline">Cart</span>
              {cartQty ? (
                <span className="ml-1 inline-flex items-center justify-center bg-rose-500 text-white rounded-full text-xs w-5 h-5">
                  {cartQty}
                </span>
              ) : null}
            </button>

            {cartOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b text-sm font-medium">Your cart</div>

                {cartItems.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500">Your cart is empty.</div>
                ) : (
                  <div className="max-h-64 overflow-auto">
                    {cartItems.map((it) => (
                      <div key={it.id} className="flex items-center justify-between px-4 py-2 hover:bg-slate-50">
                        <div>
                          <div className="text-sm font-medium">{it.name}</div>
                          <div className="text-xs text-slate-500">Qty: {it.qty}</div>
                        </div>
                        <div className="text-sm">₹{(it.price * it.qty).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="px-4 py-3 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium">Total</div>
                    <div className="text-sm">₹{cartTotal.toFixed(2)}</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        nav("/checkout");
                      }}
                      className="btn-primary flex-1"
                    >
                      Checkout
                    </button>

                    <button
                      onClick={() => {
                        cart.buyAll();
                        setCartOpen(false);
                      }}
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      Buy All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!auth?.user ? (
            <>
              <Link to="/login" className="px-3 py-1 text-sm text-slate-700 hover:bg-slate-100 rounded">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Sign up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-1 rounded hover:bg-slate-50">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                  <FiUser />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium">{auth.user.email}</div>
                  <div className="text-xs text-slate-500">{auth.user.role}</div>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-slate-50">
                    Profile
                  </Link>
                  {auth.user.role === "admin" && (
                    <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-slate-50">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      auth.logout();
                      nav("/");
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button className="ml-1 md:hidden p-2 rounded hover:bg-slate-100" aria-label="menu">
            <FiMenu />
          </button>
        </div>
      </div>
    </header>
  );
}
