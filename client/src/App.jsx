import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header.jsx';
import { CatalogPage } from './pages/CatalogPage.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.jsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
