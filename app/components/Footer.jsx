import {NavLink} from 'react-router';

const footerGroups = [
  {
    title: 'Shop',
    links: [
      ['All equipment', '/collections/all'],
      ['Foil', '/shop?category=foil'],
      ['Epee', '/shop?category=epee'],
      ['Sabre', '/shop?category=sabre'],
    ],
  },
  {
    title: 'Support',
    links: [
      ['Sizing', '/pages/sizing'],
      ['Contact', '/pages/contact'],
      ['FAQ', '/pages/faq'],
      ['Cart', '/cart'],
    ],
  },
  {
    title: 'Programs',
    links: [
      ['Club orders', '/club'],
      ['Starter kits', '/shop?category=starter-kits'],
      ['Account', '/account'],
      ['Journal', '/blogs/journal'],
    ],
  },
];

export function Footer() {
  return (
    <footer className="bc-footer">
      <div className="bc-footer-main">
        <div className="bc-footer-brand">
          <NavLink to="/">BLADECRAFT</NavLink>
          <p>
            Performance fencing equipment for athletes, coaches, clubs, and
            programs.
          </p>
        </div>
        {footerGroups.map((group) => (
          <nav key={group.title}>
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
        <span>© {new Date().getFullYear()} Bladecraft</span>
        <div>
          <NavLink to="/policies">Policies</NavLink>
          <NavLink to="/pages/contact">Contact</NavLink>
        </div>
      </div>
    </footer>
  );
}
