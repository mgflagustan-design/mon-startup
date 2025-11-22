import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin-authenticated') === 'true';
  });
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('admin-token') || '';
  });

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('admin-authenticated', 'true');
    } else {
      localStorage.removeItem('admin-authenticated');
    }
  }, [isAuthenticated]);

  function login(token) {
    setAdminToken(token);
    setIsAuthenticated(true);
    localStorage.setItem('admin-token', token);
  }

  function logout() {
    setAdminToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-authenticated');
  }

  return (
    <AdminContext.Provider value={{ isAuthenticated, adminToken, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}

