import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../state/CartContext.jsx';

export function Header() {
  const { totals } = useCart();

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? 'text-brand' : 'text-gray-500 hover:text-gray-900'
    }`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight text-brand">
          Mon Threads
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink to="/" className={navLinkClass} end>
            Catalog
          </NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            Cart ({totals.quantity})
          </NavLink>
          <NavLink to="/admin" className={navLinkClass}>
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

