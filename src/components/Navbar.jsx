import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

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
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

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
  const [profileOpen, setProfileOpen] = useState(false);
  const { storeOpen, settingsLoading } = useCart();
  const [profilePic, setProfilePic] = useState(
  localStorage.getItem("profilePic") || ""
);

  const navigate = useNavigate();
  const location = useLocation();

  const { cartCount } = useCart();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  useEffect(() => {
  const userId = localStorage.getItem("userId");

  if (!userId || !token) return;

  const getProfilePicture = async () => {
    try {
      const res = await axios.get(
        `https://bens-store.vercel.app/profile/${userId}`
      );

      if (res.data.success) {
        const user = res.data.data;

        if (user.profilePic) {
          setProfilePic(user.profilePic);
          localStorage.setItem("profilePic", user.profilePic);
        }
      }
    } catch (error) {
      console.log("Navbar profile error:", error);
    }
  };

  getProfilePicture();
}, [token]);

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
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      localStorage.removeItem("profilePic");

      setProfileOpen(false);
      setMenuOpen(false);

      toast.success("Logged out successfully");

      navigate("/login");
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200 bg-white shadow-sm">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* LOGO */}

        <NavLink
          to="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="grid h-10 w-10 place-items-center rounded bg-emerald-700 text-white">
            <FontAwesomeIcon icon={faShirt} />
          </div>

          <span className="text-2xl font-black text-black">
            Ben's Store
          </span>
        </NavLink>

        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="grid h-10 w-10 place-items-center rounded border border-stone-300 bg-white md:hidden"
        >
          <FontAwesomeIcon
            icon={menuOpen ? faXmark : faBars}
          />
        </button>

        {/* NAVIGATION */}

        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } absolute left-0 top-[73px] z-50 w-full flex-col gap-3 bg-white p-5 md:static md:flex md:w-auto md:flex-row md:items-center md:p-0`}
        >

          {/* NORMAL LINKS */}

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

          {/* ADMIN DASHBOARD */}

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

          {/* LOGIN / REGISTER */}

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

          {/* CART */}

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

          {/* USER PROFILE */}

          {token && (
            <>
              <button
  type="button"
  onClick={() => setProfileOpen(!profileOpen)}
  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-stone-100"
>
  {profilePic ? (
    <img
      src={profilePic}
      alt="Profile"
      className="h-7 w-7 rounded-full object-cover"
    />
  ) : (
    <FontAwesomeIcon icon={faUser} />
  )}

  {name || "User"}

  <span className="text-xs">
    {profileOpen ? "▲" : "▼"}
  </span>
</button>

              {/* PROFILE POPUP */}

              {profileOpen && (
                <div className="absolute right-28 top-16 z-[100] w-80 rounded-xl border border-stone-200 bg-white p-5 shadow-2xl">

                  {/* PROFILE HEADER */}

                  <div className="flex items-center gap-4 border-b border-stone-200 pb-4">

                   <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-emerald-100 bg-emerald-100">
  {profilePic ? (
    <img
      src={profilePic}
      alt="Profile"
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="grid h-full w-full place-items-center text-emerald-700">
      <FontAwesomeIcon
        icon={faUser}
        className="text-2xl"
      />
    </div>
  )}
</div>

                    <div>
                      <h3 className="text-lg font-black text-slate-950">
                        {name || "User"}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {role === "admin" ? "Administrator" : "Customer"}
                      </p>
                    </div>

                  </div>

                  {/* PROFILE DETAILS */}

                  <div className="space-y-4 py-5">

                    <div>
                      <p className="text-xs font-semibold text-slate-400">
                        Name
                      </p>

                      <p className="font-semibold text-slate-800">
                        {name || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-400">
                        Email
                      </p>

                      <p className="break-all font-semibold text-slate-800">
                        {email || "Not provided"}
                      </p>
                    </div>

                  </div>

                  {/* EDIT PROFILE */}

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      setMenuOpen(false);
                      navigate("/profile/edit");
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 font-bold text-white transition hover:bg-emerald-800"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />

                    Edit Profile
                  </button>

                </div>
              )}

              {/* LOGOUT */}

              <button
                type="button"
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
     {!settingsLoading && !storeOpen && (
        <div className="w-full bg-red-600 px-4 py-3 text-center font-semibold text-white">
          Store is closed right now. You can browse our products, but ordering is currently unavailable.
        </div>
      )}
  );
}

export default Navbar;
