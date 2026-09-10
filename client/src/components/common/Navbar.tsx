import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ShoppingCart,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  // Get logged-in user from Texora localStorage
  const user = JSON.parse(
    localStorage.getItem("texora-user") || "null"
  );

  const handleLogout = () => {
    // Remove Texora authentication data
    localStorage.removeItem("texora-token");
    localStorage.removeItem("texora-user");

    alert("Logged out successfully!");

    navigate("/");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <ShoppingBag size={18} />
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-900">
            Texora
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">

          <Link
            to="/marketplace"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Marketplace
          </Link>

          <Link
            to="/suppliers"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            For Suppliers
          </Link>

          <Link
            to="/about"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            About
          </Link>

        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
          >
            <ShoppingCart size={21} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Logged In User */}
          {user ? (
            <>
              {/* User Info */}
              <div className="hidden items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 md:flex">
                <User
                  size={17}
                  className="text-indigo-600"
                />

                <div className="flex flex-col leading-tight">
                  <span className="text-xs text-slate-500">
                    Logged in as
                  </span>

                  <span className="text-sm font-semibold text-slate-800">
                    {user.name?.split(" ")[0] || "User"}
                  </span>
                </div>
              </div>

              {/* Dashboard */}
              <Link
                to={
                  user.role === "supplier"
                    ? "/supplier/dashboard"
                    : "/buyer/dashboard"
                }
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:px-4"
              >
                <LayoutDashboard size={18} />

                <span className="hidden lg:block">
                  Dashboard
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600 sm:px-4"
              >
                <LogOut size={17} />

                <span className="hidden sm:block">
                  Logout
                </span>
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="hidden rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:block"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
              >
                Get Started
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;