import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../state/AdminContext.jsx';

export function AdminLoginPage() {
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAdmin();
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!token.trim()) {
      setError('Please enter an admin token');
      return;
    }

    // Simple validation - in production, you'd verify this with the backend
    login(token);
    navigate('/admin');
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-20">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter your admin token to access the dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                Admin Token
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter admin token"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            Contact your administrator if you don't have a token
          </p>
        </div>
      </div>
    </div>
  );
}

