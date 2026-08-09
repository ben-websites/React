import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Swal from "sweetalert2";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBars,
  faXmark,
  faBagShopping,
  faRightToBracket,
  faUserPlus,
  faRightFromBracket,
  faGaugeHigh,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { useCart } from "../contextApi/CartDataContext";

const API_URL = "https://bens-store.vercel.app";

const links = [
  {
    path: "/",
    label: "Home",
  },
  {
    path: "/products",
    label: "Products",
  },
  {
    path: "/about",
    label: "About",
  },
  {
    path: "/contact",
    label: "Contact",
  },
  {
    path: "/services",
    label: "Services",
  },
  {
    path: "/myorders",
    label: "My Orders",
  },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [settings, setSettings] = useState({
    storeName: "Ben Store",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const { cartCount } = useCart();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_URL}/settings`);

      if (res.data.success) {
        setSettings(res.data.data);
      }
    } catch (error) {
      console.log("Settings error:", error);
    }
  };

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: `Are you sure you want to logout from ${settings.storeName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");

      toast.success("Logged out successfully");

      navigate("/login");
    }
  };

  return (
    <nav className="border-b border-stone-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-black text-emerald-700"
        >
          {settings.storeName}
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            // Only show My Orders to logged-in users
            if (link.path === "/myorders" && !token) {
              return null;
            }

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `rounded px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-emerald-700 text-white"
                      : "text-slate-700 hover:bg-emerald-700 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">

          {/* Admin Dashboard */}
          {token && role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-emerald-700 text-white"
                    : "bg-white hover:bg-emerald-700 hover:text-white"
                }`
              }
            >
              <FontAwesomeIcon icon={faGaugeHigh} />
              Dashboard
            </NavLink>
          )}

          {/* Login / Register */}
          {!token && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-blue-600 hover:text-white"
                  }`
                }
              >
                <FontAwesomeIcon icon={faRightToBracket} />
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-emerald-700 text-white"
                      : "bg-white hover:bg-emerald-700 hover:text-white"
                  }`
                }
              >
                <FontAwesomeIcon icon={faUserPlus} />
                Register
              </NavLink>
            </>
          )}

          {/* Cart */}
          {token && role === "user" && (
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? "bg-emerald-700 text-white"
                    : "bg-white hover:bg-emerald-700 hover:text-white"
                }`
              }
            >
              <FontAwesomeIcon icon={faBagShopping} />

              Cart

              <span className="grid min-h-5 min-w-5 place-items-center rounded bg-amber-400 px-1 text-xs font-black text-slate-950">
                {cartCount}
              </span>
            </NavLink>
          )}

          {/* User */}
          {token && (
            <>
              <div className="inline-flex items-center gap-2 rounded bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
                <FontAwesomeIcon icon={faUser} />
                {name}
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="grid h-10 w-10 place-items-center rounded border border-stone-300 bg-white md:hidden"
        >
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-stone-200 bg-white px-6 py-4 md:hidden">

          <div className="flex flex-col gap-2">

            {links.map((link) => {
              if (link.path === "/myorders" && !token) {
                return null;
              }

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded px-4 py-3 font-semibold ${
                      isActive
                        ? "bg-emerald-700 text-white"
                        : "hover:bg-emerald-700 hover:text-white"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              );
            })}

            {/* Mobile Admin */}
            {token && role === "admin" && (
              <NavLink
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="rounded px-4 py-3 font-semibold hover:bg-emerald-700 hover:text-white"
              >
                <FontAwesomeIcon
                  icon={faGaugeHigh}
                  className="mr-2"
                />
                Dashboard
              </NavLink>
            )}

            {/* Mobile Login/Register */}
            {!token && (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded px-4 py-3 font-semibold hover:bg-blue-600 hover:text-white"
                >
                  <FontAwesomeIcon
                    icon={faRightToBracket}
                    className="mr-2"
                  />
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded px-4 py-3 font-semibold hover:bg-emerald-700 hover:text-white"
                >
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    className="mr-2"
                  />
                  Register
                </NavLink>
              </>
            )}

            {/* Mobile Cart */}
            {token && role === "user" && (
              <NavLink
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="rounded px-4 py-3 font-semibold hover:bg-emerald-700 hover:text-white"
              >
                <FontAwesomeIcon
                  icon={faBagShopping}
                  className="mr-2"
                />
                Cart ({cartCount})
              </NavLink>
            )}

            {/* Mobile User */}
            {token && (
              <>
                <div className="rounded bg-slate-100 px-4 py-3 font-semibold">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-2"
                  />
                  {name}
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded bg-red-600 px-4 py-3 text-left font-semibold text-white"
                >
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="mr-2"
                  />
                  Logout
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
