import { useEffect, useState } from "react";
import axios from "axios";

import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";

const API_URL = "https://bens-store.vercel.app";

function Footer() {
  const location = useLocation();

  const [settings, setSettings] = useState({
    storeName: "Ben Store",
    storeEmail: "hello@benstore.com",
    storePhone: "+92 300 0000000",
    storeAddress: "Karachi, Pakistan",
  });

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

  // Don't show footer inside admin panel
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-white">

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-5">

        {/* Store */}
        <div>

          <h2 className="text-3xl font-black text-emerald-400">
            {settings.storeName}
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-300">
            {settings.storeName} offers premium fashion, clothing,
            shoes and accessories with quality, affordability and
            fast delivery across Pakistan.
          </p>

        </div>

        {/* Quick Links */}
        <div>

          <h3 className="mb-5 text-xl font-bold">
            Quick Links
          </h3>

          <ul className="space-y-3 text-slate-300">

            <li>
              <Link
                to="/"
                className="hover:text-emerald-400"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/products"
                className="hover:text-emerald-400"
              >
                Products
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="hover:text-emerald-400"
              >
                About
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="hover:text-emerald-400"
              >
                Contact
              </Link>
            </li>

            <li>
              <Link
                to="/services"
                className="hover:text-emerald-400"
              >
                Services
              </Link>
            </li>

          </ul>

        </div>

        {/* Customer Service */}
        <div>

          <h3 className="mb-5 text-xl font-bold">
            Customer Service
          </h3>

          <ul className="space-y-3 text-slate-300">

            <li>Help Center</li>
            <li>Shipping Policy</li>
            <li>Return Policy</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>

          </ul>

        </div>

        {/* Categories */}
        <div>

          <h3 className="mb-5 text-xl font-bold">
            Categories
          </h3>

          <ul className="space-y-3 text-slate-300">

            <li>Men's Fashion</li>
            <li>Women's Fashion</li>
            <li>Shoes</li>
            <li>Accessories</li>
            <li>New Arrivals</li>

          </ul>

        </div>

        {/* Contact */}
        <div>

          <h3 className="mb-5 text-xl font-bold">
            Contact Us
          </h3>

          <div className="space-y-4 text-slate-300">

            {/* Email */}
            <a
              href={`mailto:${settings.storeEmail}`}
              className="flex items-center gap-3 hover:text-emerald-400"
            >
              <FontAwesomeIcon icon={faEnvelope} />
              {settings.storeEmail}
            </a>

            {/* Phone */}
            <a
              href={`tel:${settings.storePhone}`}
              className="flex items-center gap-3 hover:text-emerald-400"
            >
              <FontAwesomeIcon icon={faPhone} />
              {settings.storePhone}
            </a>

            {/* Address */}
            <p className="flex items-center gap-3">
              <FontAwesomeIcon icon={faLocationDot} />
              {settings.storeAddress}
            </p>

          </div>

        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-400">

        © {new Date().getFullYear()} {settings.storeName}.
        All Rights Reserved. | Designed by {settings.storeName} Team

      </div>

    </footer>
  );
}

export default Footer;
