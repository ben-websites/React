import { useState, useEffect } from "react";
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
  faShirt,
  faBagShopping,
  faRightToBracket,
  faUserPlus,
  faRightFromBracket,
  faGaugeHigh,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import { useCart } from "../contextApi/CartDataContext";

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
    maintenanceMode: false,
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

  async function fetchSettings() {
    try {
      const res = await axios.get(
        "https://bens-store.vercel.app/settings"
      );

      if (res.data.success) {
        setSettings(res.data.data);
      }
    } catch (error) {
      console.log("Settings error:", error);
    }
  }

  // Don't show navbar in admin panel
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout from Ben Store?",
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
    <nav className="sticky top-0 z-50 border-b border-stone-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}

        <NavLink
          to="/"
          className="flex items-center gap-3"
        >
          <div className="grid h-10 w-10 place-items-center rounded bg-emerald-700 text-white">
            <FontAwesomeIcon icon={faShirt} />
          </div>

          <span className="text-2xl font-black text-black">
            {settings.storeName}
          </span>
        </NavLink>

        {/* Mobile button */}

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="grid h-10 w-10 place-items-center rounded border border-stone-300 bg-white md:hidden"
        >
          <FontAwesomeIcon
            icon={menuOpen ? faXmark : faBars}
          />
        </button>

        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } absolute left-0 top-[73px] z-50 w-full flex-col gap-3 bg-white p-5 md:static md:flex md:w-auto md:flex-row md:items-center md:p-0`}
        >

          {/* Normal Links */}

          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-emerald-700 text-white"
                    : "hover:bg-emerald-700 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Admin Dashboard */}

          {token && role === "admin" && (
            <NavLink
              to="/admin"
              onClick={() => setMenuOpen(false)}
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
                onClick={() => setMenuOpen(false)}
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
                onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
              <div className="inline-flex items-center gap-2 rounded bg-white px-4 py-2 text-sm font-semibold text-slate-800">
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
      </div>
    </nav>
  );
}

export default Navbar;
