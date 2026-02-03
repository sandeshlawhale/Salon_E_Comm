import React, { useState, useEffect } from 'react';
import ProductCard from '../components/common/ProductCard';
import CategoryCard from '../components/common/CategoryCard';
import { productAPI } from '../utils/apiClient';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';
import dealsData from '../data/deals.json';
import './HomePage.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 22, seconds: 19 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('[HomePage] Fetching products from API...');
        // Try to fetch from API
        const apiProducts = await productAPI.getAll({ status: 'ACTIVE' });

        console.log('[HomePage] API returned:', apiProducts);

        if (Array.isArray(apiProducts) && apiProducts.length > 0) {
          console.log('[HomePage] Using API products - count:', apiProducts.length);
          console.log('[HomePage] Sample product:', {
            _id: apiProducts[0]._id,
            name: apiProducts[0].name,
            id: apiProducts[0].id
          });
          setProducts(apiProducts);
          setTrendingProducts(apiProducts.slice(0, 6));
        } else {
          console.warn('[HomePage] API returned empty/invalid data, using mock data');
          setProducts(productsData.products);
          setTrendingProducts(productsData.products.slice(6, 12));
        }
      } catch (err) {
        console.error('[HomePage] Failed to fetch from API:', err.message);
        console.warn('[HomePage] Using mock data as fallback');
        // Fallback to mock data if API fails
        setProducts(productsData.products);
        setTrendingProducts(productsData.products.slice(6, 12));
      }

      // Load categories and deals from mock data (these might come from API later)
      setCategories(categoriesData.categories);
      setDeals(dealsData.dealsOfTheDay);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleShopRange = () => {
    console.log('Shop the range clicked');
    alert('Opening product range...');
  };

  const handleViewAll = () => {
    console.log('View all deals clicked');
    alert('Showing all deals of the day');
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">B2B EXCLUSIVE</div>
          <h1 className="hero-title">Upgrade Your Salon.</h1>
          <p className="hero-description">
            Get up to 40% discount on L'Oreal and Dyson professional range for licensed salon owners.
          </p>
          <button className="btn-hero" onClick={handleShopRange}>SHOP THE RANGE</button>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1586880244406-556ebe35f282?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Salon Products"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Deals of the Day */}
      <section className="deals-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Deals of the Day</h2>
            <div className="timer">
              <span className="timer-label">Time Left:</span>
              <span className="timer-time">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
            <button className="view-all" onClick={handleViewAll}>VIEW ALL</button>
          </div>
          <div className="deals-grid">
            {deals.map(deal => (
              <div key={deal.id} className="deal-card">
                <div className="deal-image-wrapper">
                  <img src={deal.image} alt={deal.name} className="deal-image" />
                  <div className="deal-discount">{deal.discount}</div>
                </div>
                <div className="deal-info">
                  <p className="deal-brand">{deal.brand}</p>
                  <h4 className="deal-name">{deal.name}</h4>
                  <div className="deal-prices">
                    <span className="deal-price">₹{deal.price.toLocaleString()}</span>
                    <span className="deal-original">₹{deal.originalPrice.toLocaleString()}</span>
                  </div>
                  <button className="btn-add-deal" onClick={() => alert(`Added ${deal.name} to cart!`)}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="trending-section">
        <div className="container">
          <h2 className="section-title">Trending in Salon Supplies</h2>
          <div className="products-grid">
            {trendingProducts.map(product => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">FAST</div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable delivery to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">SAFE</div>
              <h3>Secure Payments</h3>
              <p>100% secure transactions with multiple payment options</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">REAL</div>
              <h3>Authentic Products</h3>
              <p>Guaranteed genuine professional products</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">HELP</div>
              <h3>Expert Support</h3>
              <p>24/7 customer support from industry experts</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
