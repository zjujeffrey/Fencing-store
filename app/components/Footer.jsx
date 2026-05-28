import {NavLink} from 'react-router';

/**
 * @param {FooterProps}
 */
export function Footer() {
  return (
    <footer className="flex flex-col justify-between gap-7 border-t border-[#d9e0e7] bg-white px-5 py-10 md:flex-row md:px-14">
      <div>
        <NavLink className="inline-flex items-center gap-3 font-black" to="/">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-[#c92337] text-xs text-white">
            BC
          </span>
          <span>BladeCraft</span>
        </NavLink>
        <p className="mt-4 max-w-sm text-[#61707f]">
          Independent fencing supply for athletes, clubs, and coaches.
        </p>
      </div>
      <nav className="flex flex-wrap gap-5 font-black">
        <NavLink to="/shop">Shop</NavLink>
        <NavLink to="/collections/all">Catalog</NavLink>
        <NavLink to="/club">Club Orders</NavLink>
        <NavLink to="/cart">Cart</NavLink>
      </nav>
    </footer>
  );
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
