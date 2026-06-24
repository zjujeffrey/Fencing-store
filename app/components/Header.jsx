import {Suspense} from 'react';
import {Await, Link, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

const navItems = [
  ['Foil', '/shop?category=foil'],
  ['Epee', '/shop?category=epee'],
  ['Sabre', '/shop?category=sabre'],
  ['Starter Kits', '/shop?category=starter-kits'],
  ['Club Orders', '/club'],
  ['Sizing', '/pages/sizing'],
];

export function Header({isLoggedIn, cart}) {
  return (
    <header className="bc-header">
      <HeaderMenuMobileToggle />
      <Link className="bc-wordmark" prefetch="intent" to="/">
        BLADECRAFT
      </Link>
      <nav className="bc-header-links" aria-label="Primary navigation">
        {navItems.map(([label, to]) => (
          <NavLink key={label} prefetch="intent" to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  );
}

export function HeaderMenu({viewport}) {
  const {close} = useAside();
  return (
    <nav className={`header-menu-${viewport}`} role="navigation">
      <NavLink end onClick={close} to="/">
        Home
      </NavLink>
      {navItems.map(([label, to]) => (
        <NavLink key={label} onClick={close} to={to}>
          {label}
        </NavLink>
      ))}
      <NavLink onClick={close} to="/collections/all">
        All equipment
      </NavLink>
    </nav>
  );
}

function HeaderCtas({isLoggedIn, cart}) {
  const {open} = useAside();

  return (
    <nav className="bc-header-actions" aria-label="Store tools">
      <NavLink className="bc-account-link" prefetch="intent" to="/account">
        <Suspense fallback="Account">
          <Await resolve={isLoggedIn} errorElement="Account">
            {(loggedIn) => (loggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <button
        aria-label="Open search"
        className="bc-header-action"
        onClick={() => open('search')}
        type="button"
      >
        Search
      </button>
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      aria-label="Open menu"
      className="bc-menu-toggle"
      onClick={() => open('mobile')}
      type="button"
    >
      <span />
      <span />
      <span />
    </button>
  );
}

function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();
  return (
    <a
      className="bc-header-action"
      href="/cart"
      onClick={(event) => {
        event.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      Cart ({count === null ? '–' : count})
    </a>
  );
}

function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}
