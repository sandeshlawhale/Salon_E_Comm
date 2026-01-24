import React, { useState } from 'react';
import './AgentDashboard.css';

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample agent data
  const agentData = {
    name: 'Rahul Arora',
    tier: 'Gold',
    totalEarnings: '₹ 42,500',
    monthlyEarnings: '₹ 8,200',
    totalOrders: 245,
    monthlyOrders: 42,
    commissionRate: '8.5%',
    activeReferrals: 18,
    pendingCommission: '₹ 3,400'
  };

  const monthlyChartData = [
    { month: 'Jan', earnings: 5200 },
    { month: 'Feb', earnings: 6100 },
    { month: 'Mar', earnings: 7400 },
    { month: 'Apr', earnings: 6800 },
    { month: 'May', earnings: 8200 },
    { month: 'Jun', earnings: 8200 }
  ];

  const recentOrders = [
    {
      id: 'ORD-2024-001',
      customer: 'Priya Singh',
      product: 'Moisturizer 50ml',
      commission: '₹ 250',
      date: '2024-01-15',
      status: 'COMPLETED'
    },
    {
      id: 'ORD-2024-002',
      customer: 'Anjali Sharma',
      product: 'Hair Oil 200ml',
      commission: '₹ 180',
      date: '2024-01-14',
      status: 'COMPLETED'
    },
    {
      id: 'ORD-2024-003',
      customer: 'Neha Patel',
      product: 'Face Wash 100ml',
      commission: '₹ 185',
      date: '2024-01-14',
      status: 'PENDING'
    },
    {
      id: 'ORD-2024-004',
      customer: 'Deepika Kumar',
      product: 'Serum 30ml',
      commission: '₹ 200',
      date: '2024-01-13',
      status: 'COMPLETED'
    }
  ];

  const referralLinks = [
    { id: 1, code: 'RAHUL8520', clicks: 245, conversions: 18, revenue: '₹ 8,200' },
    { id: 2, code: 'RA-GOLD-85', clicks: 156, conversions: 12, revenue: '₹ 5,400' }
  ];

  const performanceMetrics = [
    { label: 'This Month', value: '₹ 8,200', change: '+12%', positive: true },
    { label: 'Conversion Rate', value: '7.3%', change: '+0.5%', positive: true },
    { label: 'Avg Order Value', value: '₹ 1,850', change: '-2%', positive: false }
  ];

  return (
    <div className="agent-dashboard">
      <div className="container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Agent Dashboard</h1>
            <p className="agent-greeting">Welcome back, {agentData.name}!</p>
          </div>
          <div className="tier-badge">
            <span className="tier-label">{agentData.tier} Tier</span>
            <div className="tier-progress" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Total Earnings</span>
              <span className="stat-icon">💰</span>
            </div>
            <div className="stat-value">{agentData.totalEarnings}</div>
            <div className="stat-subtitle">Lifetime</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Monthly Earnings</span>
              <span className="stat-icon">📊</span>
            </div>
            <div className="stat-value">{agentData.monthlyEarnings}</div>
            <div className="stat-subtitle">This Month</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Total Orders</span>
              <span className="stat-icon">📦</span>
            </div>
            <div className="stat-value">{agentData.totalOrders}</div>
            <div className="stat-subtitle">{agentData.monthlyOrders} this month</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Commission Rate</span>
              <span className="stat-icon">⭐</span>
            </div>
            <div className="stat-value">{agentData.commissionRate}</div>
            <div className="stat-subtitle">Gold Tier Benefits</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Recent Orders
            </button>
            <button
              className={`tab-button ${activeTab === 'referrals' ? 'active' : ''}`}
              onClick={() => setActiveTab('referrals')}
            >
              Referral Links
            </button>
            <button
              className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Account Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-content">
              <div className="content-row">
                <div className="chart-section">
                  <h3>Monthly Earnings Trend</h3>
                  <div className="simple-chart">
                    <div className="chart-bars">
                      {monthlyChartData.map((item, idx) => (
                        <div key={idx} className="bar-container">
                          <div
                            className="bar"
                            style={{ height: `${(item.earnings / 8500) * 100}%` }}
                            title={`₹${item.earnings}`}
                          ></div>
                          <span className="bar-label">{item.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="metrics-section">
                  <h3>Performance Metrics</h3>
                  <div className="metrics-list">
                    {performanceMetrics.map((metric, idx) => (
                      <div key={idx} className="metric-row">
                        <div>
                          <div className="metric-label">{metric.label}</div>
                          <div className="metric-value">{metric.value}</div>
                        </div>
                        <div className={`metric-change ${metric.positive ? 'positive' : 'negative'}`}>
                          {metric.change}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="info-cards">
                <div className="info-card">
                  <h4>Pending Commission</h4>
                  <p className="pending-amount">{agentData.pendingCommission}</p>
                  <button className="withdraw-btn">Request Withdrawal</button>
                </div>

                <div className="info-card">
                  <h4>Active Referrals</h4>
                  <p className="referrals-count">{agentData.activeReferrals}</p>
                  <button className="manage-btn">Manage Referrals</button>
                </div>

                <div className="info-card">
                  <h4>Next Tier Goal</h4>
                  <p className="tier-goal">₹ 5,000 more needed for Platinum</p>
                  <button className="progress-btn">View Progress</button>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="orders-content">
              <div className="orders-table">
                <div className="table-header">
                  <div className="col-id">Order ID</div>
                  <div className="col-customer">Customer</div>
                  <div className="col-product">Product</div>
                  <div className="col-commission">Commission</div>
                  <div className="col-date">Date</div>
                  <div className="col-status">Status</div>
                </div>
                {recentOrders.map((order) => (
                  <div key={order.id} className="table-row">
                    <div className="col-id">{order.id}</div>
                    <div className="col-customer">{order.customer}</div>
                    <div className="col-product">{order.product}</div>
                    <div className="col-commission">{order.commission}</div>
                    <div className="col-date">{order.date}</div>
                    <div className="col-status">
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Referrals Tab */}
          {activeTab === 'referrals' && (
            <div className="referrals-content">
              <div className="referral-header">
                <h3>Your Referral Links</h3>
                <button className="create-link-btn">+ Create New Link</button>
              </div>

              <div className="referral-cards">
                {referralLinks.map((link) => (
                  <div key={link.id} className="referral-card">
                    <div className="link-code">
                      <span className="code-label">Referral Code</span>
                      <div className="code-display">
                        <input
                          type="text"
                          value={link.code}
                          readOnly
                          className="code-input"
                        />
                        <button className="copy-btn" onClick={() => {
                          navigator.clipboard.writeText(link.code);
                          alert('Copied to clipboard!');
                        }}>
                          Copy
                        </button>
                      </div>
                    </div>

                    <div className="link-stats">
                      <div className="stat">
                        <span className="stat-name">Clicks</span>
                        <span className="stat-num">{link.clicks}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-name">Conversions</span>
                        <span className="stat-num">{link.conversions}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-name">Revenue</span>
                        <span className="stat-num">{link.revenue}</span>
                      </div>
                    </div>

                    <button className="details-btn">View Details</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-content">
              <div className="settings-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue={agentData.name} readOnly />
                </div>

                <div className="form-group">
                  <label>Agent ID</label>
                  <input type="text" defaultValue="AG-20240001" readOnly />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue="rahul.arora@example.com" />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" defaultValue="+91 98765 43210" />
                </div>

                <div className="form-group">
                  <label>Bank Account</label>
                  <input type="text" placeholder="Enter your bank account number" />
                </div>

                <div className="form-group">
                  <label>IFSC Code</label>
                  <input type="text" placeholder="Enter IFSC code" />
                </div>

                <div className="form-actions">
                  <button className="save-btn">Save Changes</button>
                  <button className="reset-btn">Reset Password</button>
                </div>
              </div>

              <div className="danger-zone">
                <h4>Danger Zone</h4>
                <button className="deactivate-btn">Deactivate Account</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
