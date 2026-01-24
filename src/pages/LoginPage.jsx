import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('customer');
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Map UI userType to Context ROLES
    let role = ROLES.USER;
    if (userType === 'admin') role = ROLES.ADMIN;
    else if (userType === 'agent') role = ROLES.AGENT;

    if (isLogin) {
      const success = login(email, password, role);
      if (success) {
        navigateAfterAuth(role);
      } else {
        setError('Invalid credentials. Try "test" as email prefix or Register new account.');
      }
    } else {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const result = register({ email, password, name, role });
      if (result.success) {
        navigateAfterAuth(role);
      } else {
        setError(result.message);
      }
    }
  };

  const navigateAfterAuth = (role) => {
    if (role === ROLES.ADMIN) {
      navigate('/admin');
    } else if (role === ROLES.AGENT) {
      navigate('/agent-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Sign in to your SalonPro account' : 'Join SalonPro today'}</p>
        </div>

        {error && <div className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>{isLogin ? 'Login As' : 'Register As'}</label>
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

          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

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

          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          {isLogin && (
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
            </div>
          )}

          <button type="submit" className="btn-login-submit">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>

          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button type="button" className="link-button" onClick={toggleMode} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
            {isLogin && <p><button type="button" className="link-button" onClick={() => alert('Password reset coming soon')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Forgot Password?</button></p>}
          </div>
        </form>
      </div>

      <div className="login-benefits">
        <h3>{isLogin ? 'Why Login?' : 'Why Join Us?'}</h3>
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
