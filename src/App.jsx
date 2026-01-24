import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import AgentDashboard from './pages/AgentDashboard';
import CategoryPage from './pages/CategoryPage';
import BecomeSeller from './pages/BecomeSeller';
import AgentRewards from './pages/AgentRewards';
import HelpCenter from './pages/HelpCenter';
import MainLayout from './components/layout/MainLayout';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Site Routes with Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/become-seller" element={<BecomeSeller />} />
          <Route path="/agent-rewards" element={<AgentRewards />} />
          <Route path="/help" element={<HelpCenter />} />
        </Route>

        {/* Admin Routes (without main layout) */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/agent-dashboard" element={<AgentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
