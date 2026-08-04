import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
function Footer() {

 const location = useLocation();

  if (location.pathname.startsWith("/admin")) {
    return null;
  }
  
  return (
    <footer className="mt-20 bg-slate-950 text-white">

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-5">

      

        <div>

          <h2 className="text-3xl font-black text-emerald-400">
            Ben's Store
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-300">
            Ben Store offers premium fashion, clothing, shoes and accessories
            with quality, affordability and fast delivery across Pakistan.
          </p>

        </div>

        <div>

          <h3 className="mb-5 text-xl font-bold">
            Quick Links
          </h3>

          <ul className="space-y-3 text-slate-300">

            <li>
              <Link to="/" className="hover:text-emerald-400">
                Home
              </Link>
            </li>

            <li>
              <Link to="/products" className="hover:text-emerald-400">
                Products
              </Link>
            </li>

            <li>
              <Link to="/about" className="hover:text-emerald-400">
                About
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-emerald-400">
                Contact
              </Link>
            </li>

            <li>
              <Link to="/services" className="hover:text-emerald-400">
                Services
              </Link>
            </li>

          </ul>

        </div>
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

            <a href="mailto:sabihuddin309@gmail.com"
  className="flex items-center gap-3">
  <FontAwesomeIcon icon={faEnvelope} />
  <span>sabihuddin309@gmail.com</span>
</a>
<a href="tel:+923242244688"
  className="flex items-center gap-3">
  <FontAwesomeIcon icon={faPhone} />
  <span>+92 324 2244688</span>
</a>
<div className="flex items-center gap-3">
  <FontAwesomeIcon icon={faLocationDot} />
  <span>Korangi, Karachi, Pakistan</span>
</div>
          </div>

        </div>

      </div>

      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-400">

        © 2026 Ben Store. All Rights Reserved. | Designed by Ben Store Team

      </div>

    </footer>
  );
}

export default Footer;
