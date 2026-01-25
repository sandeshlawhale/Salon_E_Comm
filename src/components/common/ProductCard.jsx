import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getAuthToken } from '../../utils/apiClient';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddCart = async (e) => {
    e.stopPropagation();
    
    if (!getAuthToken()) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    let productId = product._id || product.id;
    
    if (!productId) {
      alert('Product ID is missing');
      return;
    }

    // Convert numeric IDs to slug format (1 -> "product-1")
    if (typeof productId === 'number') {
      productId = `product-${productId}`;
    }

    setIsAdding(true);
    try {
      await addToCart(productId, 1);
      alert(`✓ ${product.name} added to cart!`);
    } catch (err) {
      console.error('Add to cart error:', err);
      alert(`Failed to add to cart: ${err.message}`);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log('Wishlist toggled:', product.name);
    alert(`${isWishlisted ? 'Removed from' : 'Added to'} wishlist`);
  };

  const handleProductClick = () => {
    // Use _id from API products, or id from mock data
    const productId = product._id || product.id || 1;
    navigate(`/product/${productId}`);
  };

  return (
    <div className="product-card" key={product._id || product.id}>
      <div className="product-image-wrapper" onClick={handleProductClick}>
        <img src={product.image} alt={product.name} className="product-image" />
        {product.badge && (
          <div className="product-badge">{product.badge}</div>
        )}
        {discount > 0 && (
          <div className="product-discount">-{discount}%</div>
        )}
        <button className="product-wishlist" onClick={handleWishlist}>
          {isWishlisted ? '♥' : '♡'}
        </button>
      </div>
      
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name" onClick={handleProductClick}>{product.name}</h3>
        
        <div className="product-rating">
          <span className="stars">★★★★★</span>
          <span className="rating-value">{product.rating}</span>
          <span className="reviews">({product.reviews})</span>
        </div>

        <div className="product-price">
          <span className="price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        <button className="btn-add-cart" onClick={handleAddCart} disabled={isAdding}>
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
