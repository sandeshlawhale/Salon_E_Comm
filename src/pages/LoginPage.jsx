import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('customer');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      // Map UI userType to Context ROLES
      let role = ROLES.USER;
      if (userType === 'admin') role = ROLES.ADMIN;
      else if (userType === 'agent') role = ROLES.AGENT;

      login(role);

      // Navigation is now handled by the login function updating state? 
      // No, login() sets state, we still need to navigate.
      // Or we can rely on ProtectedRoute to redirect if we came from there?
      // But here we are explicit.

      if (role === ROLES.ADMIN) {
        navigate('/admin');
      } else if (role === ROLES.AGENT) {
        navigate('/agent-dashboard'); // App.jsx uses /agent-dashboard
      } else {
        navigate('/dashboard'); // Go to User Dashboard instead of Home for consistency
      }
    } else {
      alert('Please fill all fields');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your SalonPro account</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Login As</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="userType"
                  value="customer"
                  checked={userType === 'customer'}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Customer
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="userType"
                  value="agent"
                  checked={userType === 'agent'}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Agent
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="userType"
                  value="admin"
                  checked={userType === 'admin'}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Admin
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" /> Remember me
            </label>
          </div>

          <button type="submit" className="btn-login-submit">Sign In</button>

          <div className="login-footer">
            <p>Don't have an account? <button type="button" className="link-button" onClick={() => alert('Signup page coming soon')}>Sign Up</button></p>
            <p><button type="button" className="link-button" onClick={() => alert('Password reset coming soon')}>Forgot Password?</button></p>
          </div>
        </form>
      </div>

      <div className="login-benefits">
        <h3>Why Login?</h3>
        <ul>
          <li>Track your orders in real-time</li>
          <li>Access exclusive deals and offers</li>
          <li>Manage your wishlist</li>
          <li>Faster checkout process</li>
          <li>Earn rewards and commissions</li>
        </ul>
      </div>
    </div>
  );
}
