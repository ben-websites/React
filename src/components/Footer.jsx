import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'

function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-slate-950 text-slate-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-xl font-black text-white">Ben Store</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Modern everyday pieces selected for simple, confident dressing.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Shop</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Browse clothing, accessories, product details, and ratings before choosing your favorites.
          </p>
        </div>
        <div className="space-y-3 text-sm text-slate-300">
          <h2 className="text-xl font-black text-white">Contact</h2>
          <a className="flex items-center gap-3" href="mailto:sabihuddin309@gmail.com">
            <FontAwesomeIcon icon={faEnvelope} /> sabihuddin309@gmail.com
          </a>
          <a className="flex items-center gap-3 href="tel:+923242244688">
            <FontAwesomeIcon icon={faPhone} /> +92 324 2244688
          </a>
          <p className="flex items-center gap-3">
            <FontAwesomeIcon icon={faLocationDot} />  Korangi, Karachi, Pakistan
          </p>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-4 text-center text-sm text-slate-400">
        Copyright 2026 Ben Store. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
