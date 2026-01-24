import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, ROLES } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import MainLayout from './components/layout/MainLayout';
import UserDashboardLayout from './layouts/UserDashboardLayout';

// Pages
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
import UserDashboard from './pages/user/UserDashboard';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Site Routes - Wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/become-seller" element={<BecomeSeller />} />
            <Route path="/agent-rewards" element={<AgentRewards />} />
            <Route path="/help" element={<HelpCenter />} />

            {/* Protected Checkout */}
            <Route path="/checkout" element={
              <ProtectedRoute requiredRole={ROLES.USER}>
                <CheckoutPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* Protected User Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole={ROLES.USER}>
              <UserDashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<UserDashboard />} />
          </Route>

          {/* Protected Admin Dashboard - Dev Branch Layout */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <AdminDashboard />
            </ProtectedRoute>
          }>
            {/* AdminDashboard might use sub-routes internally or handle tab state?
                   Reviewing AdminDashboard.jsx: It uses `activeTab` state. It does NOT use nested Routes.
                   So we don't need nested routes here. 
                   BUT Route /admin needs to match perfectly.
               */}
          </Route>

          {/* Protected Agent Dashboard - Dev Branch Layout */}
          <Route path="/agent-dashboard" element={
            <ProtectedRoute requiredRole={ROLES.AGENT}>
              <AgentDashboard />
            </ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
