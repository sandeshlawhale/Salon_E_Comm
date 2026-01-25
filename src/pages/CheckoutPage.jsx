import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, getAuthToken } from '../utils/apiClient';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const [shippingMethod, setShippingMethod] = useState('default');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agentId, setAgentId] = useState('');
  const [agentVerified, setAgentVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { items: cartItems, getCartTotal, clearCart } = useCart();
  const { totalPrice } = getCartTotal();

  // Use cart items or mock data as fallback
  const displayItems = cartItems && cartItems.length > 0 ? cartItems : [
    { productName: 'Professional Argan Oil 100ml', quantity: 2, price: 4200, productImage: 'https://images.unsplash.com/photo-1585110396000-c9ffd4d4b35c?w=100&h=100&fit=crop' },
    { productName: 'Deep Hydration Mask 500ml', quantity: 1, price: 6850, productImage: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100&h=100&fit=crop' }
  ];

  const subtotal = totalPrice || 11050;
  const discount = -Math.round(subtotal * 0.10); // 10% discount
  const tax = Math.round(subtotal * 0.18); // 18% tax
  const shipping = 0;
  const total = subtotal + discount + tax + shipping;

  const handleVerifyAgent = () => {
    if (agentId) {
      alert(`Agent ${agentId} verified successfully!`);
      setAgentVerified(true);
    } else {
      alert('Please enter Agent ID');
    }
  };

  const handlePlaceOrder = async () => {
    if (!getAuthToken()) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    if (displayItems.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      navigate('/');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: displayItems.map(item => ({
          name: item.productName || item.name,
          quantity: item.quantity,
          price: item.price,
          productId: item.productId
        })),
        subtotal,
        discount,
        tax,
        shipping,
        total,
        paymentMethod,
        shippingMethod,
        agentId: agentVerified ? agentId : null,
        status: 'PENDING'
      };

      const response = await orderAPI.create(orderData);
      
      // Clear cart after successful order
      try {
        await clearCart();
        console.log('Cart cleared after order placement');
      } catch (clearErr) {
        console.warn('Failed to clear cart:', clearErr);
      }
      
      alert('Order placed successfully! Your order has been confirmed.');
      // Navigate to my orders or home
      setTimeout(() => navigate('/my-orders'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
      console.error('Order placement error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
          <div className="checkout-header">
            <h1>Checkout & Tagging</h1>
            <p>Finalize your professional order and ensure agent attribution for commissions.</p>
          </div>

          <div className="checkout-grid">
            {/* Left Section */}
            <div className="checkout-form">
              {/* Shipping Address */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-number">1</span>
                  <h2>Shipping Address</h2>
                  <button className="add-btn">Add Now</button>
                </div>

                <div className="address-card selected">
                  <div className="radio-select">
                    <input type="radio" checked readOnly />
                  </div>
                  <div className="address-content">
                    <h4>The Royal Groom Salon - Corporate</h4>
                    <p className="gst">GSTIN: 29AAAA0000A1Z5</p>
                    <p className="address-text">245, Bridgate Road, Ashok Nagar, Bangalore, KA 560025</p>
                    <p className="phone">Ph: +91 98765 43210</p>
                  </div>
                  <button className="edit-btn">✎</button>
                </div>

                <div className="address-card">
                  <div className="radio-select">
                    <input type="radio" />
                  </div>
                  <div className="address-content">
                    <h4>Elite Salon Supplies - Warehouse</h4>
                    <p className="gst">GSTIN: 29BBBBB0000B1Z5</p>
                    <p className="address-text">Sector 4, HSR Layout, Bangalore, KA 560102</p>
                    <p className="phone">Ph: +91 98765 43211</p>
                  </div>
                  <button className="edit-btn">✎</button>
                </div>
              </div>

              {/* Agent Attribution */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-number">2</span>
                  <h2>Agent Attribution</h2>
                </div>

                <p className="section-description">
                  Was this sale assisted by a Salon Agent? Enter their ID to ensure they receive commission.
                </p>

                <div className="agent-input-group">
                  <input
                    type="text"
                    placeholder="Enter Agent ID (e.g., AGT-1029)"
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    className="agent-input"
                  />
                  <button className="verify-btn" onClick={handleVerifyAgent}>Verify Agent</button>
                </div>

                {agentVerified && (
                  <div className="agent-verified">
                    <span className="check">✓</span>
                    <span className="verified-text">Agent Verified: Rajesh Kumar</span>
                    <span className="tier">Elite Professional Club • Commission Tier [1.5%]</span>
                    <button className="change-btn">Change</button>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-number">3</span>
                  <h2>Payment Method</h2>
                </div>

                <div className="payment-options">
                  <label className="payment-option">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                    />
                    <span className="payment-icon">💳</span>
                    <span className="payment-text">UPI (GPay, PhonePe, Paytm)</span>
                  </label>

                  <label className="payment-option">
                    <input 
                      type="radio" 
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <span className="payment-icon">💰</span>
                    <span className="payment-text">Credit / Debit Cards</span>
                  </label>

                  <label className="payment-option">
                    <input 
                      type="radio" 
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <span className="payment-icon">📦</span>
                    <span className="payment-text">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <p className="terms">
                  By placing order, you agree to SalonPro Terms of Service and Refund Policy
                </p>
              </div>
            </div>

            {/* Right Section - Order Summary */}
            <div className="order-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>
                <span className="item-count">{displayItems.length} items</span>

                <div className="items-list">
                  {displayItems.map((item, idx) => (
                    <div key={idx} className="summary-item">
                      <img src={item.productImage || item.image} alt={item.productName || item.name} />
                      <div className="item-details">
                        <p className="item-name">{item.productName || item.name}</p>
                        <p className="item-qty">Qty: {item.quantity} x ₹{Math.round(item.price / item.quantity)}</p>
                      </div>
                      <span className="item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row">
                  <span>Bag Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span>B2B Volume Discount</span>
                  <span className="discount-amount">₹{Math.abs(discount).toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span>Tax (IGST @ 18%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping (Express)</span>
                  <span className={shipping === 0 ? 'free' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>

                <div className="summary-divider"></div>

                <div className="total-row">
                  <span>TOTAL PAYABLE</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <div className="promo-tip">
                  <span>💡</span>
                  <span>Pro Tip: Add 8 more items to unlock "Wholesale" discount of 5%</span>
                </div>

                {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
                
                <button 
                  className="btn-place-order" 
                  onClick={handlePlaceOrder}
                  disabled={loading || (!agentVerified && agentId === '')}
                >
                  {loading ? 'Processing...' : 'PLACE ORDER NOW'}
                </button>

                <div className="security-note">
                  <span>🔒</span>
                  <span>You saved ₹1,105.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
