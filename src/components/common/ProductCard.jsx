import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddCart = () => {
    console.log('Added to cart:', product.name);
    alert(`✓ ${product.name} added to cart!`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log('Wishlist toggled:', product.name);
    alert(`${isWishlisted ? 'Removed from' : 'Added to'} wishlist`);
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id || 1}`);
  };

  return (
    <div className="product-card">
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

        <button className="btn-add-cart" onClick={handleAddCart}>Add to Cart</button>
      </div>
    </div>
  );
}
