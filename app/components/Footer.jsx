import {NavLink} from 'react-router';

const footerGroups = [
  {
    title: 'Shop',
    links: [
      ['Starter kits', '/shop?category=starter-kits'],
      ['Weapons', '/shop?category=weapons'],
      ['Masks', '/shop?category=masks'],
      ['Apparel', '/shop?category=clothing'],
      ['All gear', '/collections/all'],
    ],
  },
  {
    title: 'Programs',
    links: [
      ['Individual fencers', '/collections/all'],
      ['Club orders', '/club'],
      ['Program starter kits', '/shop?category=starter-kits'],
      ['Sizing support', '/pages/sizing'],
    ],
  },
  {
    title: 'Support',
    links: [
      ['Contact us', '/pages/contact'],
      ['Sizing guide', '/pages/sizing'],
      ['Returns', '/policies/refund-policy'],
      ['Privacy', '/policies/privacy-policy'],
      ['Shopping cart', '/cart'],
    ],
  },
  {
    title: 'Connect',
    links: [
      ['My account', '/account'],
      ['Search', '/search'],
      ['Club enquiries', '/club'],
      ['Contact Bladecraft', '/pages/contact'],
    ],
  },
];

export function Footer() {
  return (
    <>
      <footer className="bc-footer">
        <div className="bc-footer-main">
          <div className="bc-footer-brand">
            <NavLink to="/">BLADECRAFT</NavLink>
            <p>
              Performance fencing equipment selected for athletes, coaches,
              clubs, and growing programs.
            </p>
          </div>
          {footerGroups.map((group) => (
            <nav aria-label={`${group.title} links`} key={group.title}>
              <h2>{group.title}</h2>
              {group.links.map(([label, to]) => (
                <NavLink key={label} to={to}>
                  {label}
                </NavLink>
              ))}
            </nav>
          ))}
        </div>
        <div className="bc-footer-bottom">
          <span>© {new Date().getFullYear()} Bladecraft Fencing Gear</span>
          <div>
            <NavLink to="/policies/privacy-policy">Privacy</NavLink>
            <NavLink to="/policies/refund-policy">Returns</NavLink>
            <NavLink to="/pages/contact">Contact</NavLink>
          </div>
        </div>
      </footer>
      <div className="bc-footer-credit">
        Bladecraft · Equipment for deliberate athletes
      </div>
    </>
  );
}
