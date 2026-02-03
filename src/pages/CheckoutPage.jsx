import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, getAuthToken, userAPI, paymentAPI } from '../utils/apiClient';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

// Helper to load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const [shippingMethod, setShippingMethod] = useState('default');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agentId, setAgentId] = useState('');
  const [agents, setAgents] = useState([]);
  const [agentVerified, setAgentVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState({ name: '', street: '', city: '', state: '', zip: '', phone: '' });
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

  useEffect(() => {
    // Fetch active agents for dropdown (public endpoint)
    const fetchAgents = async () => {
      try {
        const list = await userAPI.getAgents();
        setAgents(list || []);
      } catch (err) {
        console.warn('Failed to load agents', err);
      }
    };
    fetchAgents();
  }, []);

  const handleVerifyAgent = () => {
    if (agentId) {
      const selected = agents.find(a => a._id === agentId);
      if (selected) {
        toast.success(`Agent ${selected.firstName} ${selected.lastName} verified successfully!`);
        setAgentVerified(true);
        return;
      }
    }
    toast.warn('Please select a valid Agent');
  };

  const handlePlaceOrder = async () => {
    if (!getAuthToken()) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    if (displayItems.length === 0) {
      toast.warn('Your cart is empty. Please add items before placing an order.');
      navigate('/');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Basic validation for shipping address
      if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.zip) {
        toast.warn('Please fill the shipping address (street, city, zip)');
        setLoading(false);
        return;
      }

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
        shippingAddress,
        paymentMethod,
        shippingMethod,
        agentId: agentId || null,
        status: 'PENDING'
      };

      // 1. Create Internal Order
      const internalOrder = await orderAPI.create(orderData);
      const internalOrderId = internalOrder._id;

      // 2. Handle Payment Flow
      if (paymentMethod === 'upi' || paymentMethod === 'card') {
        const res = await loadRazorpayScript();

        if (!res) {
          toast.error('Razorpay SDK failed to load. Are you online?');
          setLoading(false);
          return;
        }

        // Create Razorpay Order
        const rzpOrder = await paymentAPI.createRazorpayOrder({
          amount: total,
          receipt: `receipt_${internalOrderId}`
        });

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SBZYkGtAZQOKHX',
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: 'SalonPro E-Commerce',
          description: 'Payment for your order',
          order_id: rzpOrder.id,
          handler: async function (response) {
            try {
              // Verify Payment
              const verifyRes = await paymentAPI.verifyPayment({
                ...response,
                orderId: internalOrderId
              });

              if (verifyRes.status === 'success') {
                toast.success('Payment successful! Order confirmed.');
                await clearCart();
                navigate('/my-orders');
              } else {
                toast.error('Payment verification failed.');
              }
            } catch (err) {
              console.error('Verification Error:', err);
              toast.error('An error occurred during payment verification.');
            }
          },
          prefill: {
            name: shippingAddress.name,
            contact: shippingAddress.phone
          },
          theme: {
            color: '#3b82f6'
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setLoading(false);
        return;
      }

      // If COD, just complete the flow
      try {
        await clearCart();
        console.log('Cart cleared after order placement');
      } catch (clearErr) {
        console.warn('Failed to clear cart:', clearErr);
      }

      toast.success('Order placed successfully! Your order has been confirmed.');
      setTimeout(() => navigate('/my-orders'), 2000);
    } catch (err) {
      toast.error(err.message || 'Failed to place order. Please try again.');
      setError(err.message || 'Failed to place order. Please try again.');
      console.error('Order placement error:', err);
    } finally {
      if (paymentMethod === 'cod') {
        setLoading(false);
      }
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
              </div>

              <div className="shipping-form">
                <input type="text" placeholder="Recipient name" value={shippingAddress.name || ''} onChange={e => setShippingAddress(s => ({ ...s, name: e.target.value }))} />
                <input type="text" placeholder="Street address" value={shippingAddress.street || ''} onChange={e => setShippingAddress(s => ({ ...s, street: e.target.value }))} />
                <div className="form-row">
                  <input type="text" placeholder="City" value={shippingAddress.city || ''} onChange={e => setShippingAddress(s => ({ ...s, city: e.target.value }))} />
                  <input type="text" placeholder="State" value={shippingAddress.state || ''} onChange={e => setShippingAddress(s => ({ ...s, state: e.target.value }))} />
                </div>
                <div className="form-row">
                  <input type="text" placeholder="ZIP / PIN" value={shippingAddress.zip || ''} onChange={e => setShippingAddress(s => ({ ...s, zip: e.target.value }))} />
                  <input type="tel" placeholder="Phone" value={shippingAddress.phone || ''} onChange={e => setShippingAddress(s => ({ ...s, phone: e.target.value }))} />
                </div>
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
                <select value={agentId} onChange={(e) => { setAgentId(e.target.value); setAgentVerified(false); }} className="agent-input">
                  <option value="">— Select Agent (optional) —</option>
                  {agents.map(a => (
                    <option key={a._id} value={a._id}>{a.firstName} {a.lastName} — {a.email}</option>
                  ))}
                </select>
                <button className="verify-btn" onClick={handleVerifyAgent} disabled={!agentId}>Verify</button>
              </div>

              {agentVerified && (
                <div className="agent-verified">
                  <span className="check">✓</span>
                  <span className="verified-text">Agent Verified: {agents.find(a => a._id === agentId)?.firstName || ''} {agents.find(a => a._id === agentId)?.lastName || ''}</span>
                  <span className="tier">Commission Tier • {agents.find(a => a._id === agentId)?.agentProfile?.commissionRate || 0}%</span>
                  <button className="change-btn" onClick={() => { setAgentId(''); setAgentVerified(false); }}>Change</button>
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

              {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

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
