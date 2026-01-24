import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [cartCount] = useState(3);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      console.log('Searching for:', searchValue);
      alert(`Searching for products: "${searchValue}"`);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleBecomeAgent = () => {
    navigate('/login');
  };

  const handleCart = () => {
    navigate('/checkout');
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <p className="header-promo">🎉 B2B EXCLUSIVE: Get up to 40% discount on professional ranges</p>
            <div className="header-top-links">
              <button className="header-link" onClick={handleBecomeAgent}>Become a Seller</button>
              <span className="separator">|</span>
              <button className="header-link" onClick={() => alert('Help Center - Contact us at support@salonpro.com')}>Help Center</button>
            </div>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container">
          <div className="header-content">
            <div className="logo" onClick={handleHome} style={{ cursor: 'pointer' }}>
              <span className="logo-icon">S</span>
              <span className="logo-text">SalonPro</span>
            </div>

            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for professional products, brands and more"
                className="search-input"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button type="submit" className="search-btn">🔍</button>
            </form>

            <div className="header-actions">
              <button className="btn-login" onClick={handleLogin}>Login</button>
              <button className="btn-primary" onClick={handleBecomeAgent}>Become an Agent</button>
              <button className="cart-icon" onClick={handleCart}>
                🛒
                <span className="cart-count">{cartCount}</span>
              </button>
              <button className="btn-menu">☰</button>
            </div>
          </div>
        </div>
      </div>

      <div className="header-nav">
        <div className="container">
          <nav className="navbar">
            <button className="nav-item" onClick={() => handleCategoryClick('Hair Care')}>Hair Care</button>
            <button className="nav-item" onClick={() => handleCategoryClick('Skin Care')}>Skin Care</button>
            <button className="nav-item" onClick={() => handleCategoryClick('Tools')}>Tools</button>
            <button className="nav-item" onClick={() => handleCategoryClick('Furniture')}>Furniture</button>
            <button className="nav-item" onClick={() => handleCategoryClick('Makeup')}>Makeup</button>
            <button className="nav-item" onClick={() => handleCategoryClick('Nails')}>Nails</button>
            <button className="nav-item" onClick={() => handleCategoryClick('Spa')}>Spa</button>
            <button className="nav-item" onClick={() => handleCategoryClick('Grooming')}>Grooming</button>
          </nav>
        </div>
      </div>
    </header>
  );
}

