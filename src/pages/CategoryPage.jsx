import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import productsData from '../data/products.json';
import './CategoryPage.css';

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setLoading(true);
    const timer = setTimeout(() => {
      // Filter products by category (case-insensitive)
      const filteredProducts = productsData.products.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      );
      setProducts(filteredProducts);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [category]);

  return (
    <div className="category-page">
      <div className="category-header">
        <div className="container">
          <h1 className="category-title">{category}</h1>
          <p className="category-count">{products.length} products found</p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length > 0 ? (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No products found in {category}</p>
            <p>Browse other categories or check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
