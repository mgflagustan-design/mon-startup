import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../state/CartContext.jsx';
import { useAdmin } from '../state/AdminContext.jsx';

export function Header() {
  const { totals } = useCart();
  const { isAuthenticated, logout } = useAdmin();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-brand font-semibold'
        : 'text-gray-600 hover:text-gray-900'
    }`;

  function handleAdminClick(e) {
    if (isAuthenticated) {
      e.preventDefault();
      logout();
      navigate('/');
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-brand hover:text-brand/80 transition-colors"
        >
          Mon Threads
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink to="/" className={navLinkClass} end>
            Shop
          </NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            Cart
            {totals.quantity > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">
                {totals.quantity}
              </span>
            )}
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/admin" className={navLinkClass}>
                Dashboard
              </NavLink>
              <button
                onClick={handleAdminClick}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/admin/login" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

