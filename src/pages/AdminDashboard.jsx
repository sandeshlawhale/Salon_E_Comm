import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'TOTAL REVENUE', value: '₹12,45,000', change: '+12.5%', icon: '📈' },
    { label: 'TOTAL ORDERS', value: '3,240', change: '+8.2%', icon: '📦' },
    { label: 'ACTIVE AGENTS', value: '850', change: '+5.1%', icon: '👥' },
    { label: 'COMMISSIONS', value: '₹1,85,000', change: '+10.4%', icon: '💰' },
  ];

  const agents = [
    { name: 'Rahul Arora', earnings: '₹42.5k', orders: '142 Orders', status: 'Gold Tier' },
    { name: 'Sonia Patel', earnings: '₹31.2k', orders: '98 Orders', status: 'Silver Tier' },
    { name: 'Manoj Kumar', earnings: '₹28.9k', orders: '87 Orders', status: 'Bronze' },
  ];

  const recentOrders = [
    { id: 'FL-8832', product: 'Pro Salon Dryer X2', customer: 'Elite Salon & Spa', value: '₹12,400', status: 'SUCCESS' },
    { id: 'LK-3945', product: 'Luxury Keratin Kit', customer: 'Glow Unisex Salon', value: '₹12,200', status: 'APPROVED' },
    { id: 'HS-2156', product: 'Hydraulic Styling Chair', customer: 'The Grooming Room', value: '₹34,000', status: 'PENDING' },
  ];

  return (
    <MainLayout>
      <div className="admin-dashboard">
        <div className="container">
          <div className="admin-header">
            <h1>Admin Console</h1>
            <p>Welcome back, Admin. Here's your performance overview.</p>
          </div>

          <div className="admin-nav">
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-btn ${activeTab === 'agents' ? 'active' : ''}`}
              onClick={() => setActiveTab('agents')}
            >
              Manage Agents
            </button>
            <button 
              className={`nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              Product Inventory
            </button>
            <button 
              className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              Reports
            </button>
          </div>

          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="stats-grid">
                {stats.map((stat, idx) => (
                  <div key={idx} className="stat-card">
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-content">
                      <p className="stat-label">{stat.label}</p>
                      <h3 className="stat-value">{stat.value}</h3>
                      <span className="stat-change">{stat.change} vs last month</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="charts-section">
                <div className="chart-card">
                  <h3>Sales vs. Commissions</h3>
                  <p className="chart-subtitle">Track monthly revenue growth against payout overhead</p>
                  <div className="chart-tabs">
                    <button className="chart-tab active">Daily</button>
                    <button className="chart-tab">Weekly</button>
                    <button className="chart-tab">Monthly</button>
                  </div>
                  <div className="chart-placeholder">
                    <div className="chart-line"></div>
                    <p>Sales Chart Visualization</p>
                  </div>
                </div>
              </div>

              {/* Top Agents */}
              <div className="section-card">
                <div className="section-header">
                  <h3>Top Agents</h3>
                  <button className="view-all-btn">View All</button>
                </div>
                <div className="agents-table">
                  <div className="table-header">
                    <div className="col-name">Agent Name</div>
                    <div className="col-earnings">Earnings</div>
                    <div className="col-orders">Orders</div>
                    <div className="col-status">Status</div>
                  </div>
                  {agents.map((agent, idx) => (
                    <div key={idx} className="table-row">
                      <div className="col-name">
                        <div className="agent-avatar">{agent.name.charAt(0)}</div>
                        <span>{agent.name}</span>
                      </div>
                      <div className="col-earnings">{agent.earnings}</div>
                      <div className="col-orders">{agent.orders}</div>
                      <div className="col-status">
                        <span className={`status-badge ${agent.status.toLowerCase().replace(' ', '-')}`}>
                          {agent.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="section-card">
                <div className="section-header">
                  <h3>Recent Activity</h3>
                  <button className="view-all-btn">Filter Activity</button>
                </div>
                <div className="activity-list">
                  {recentOrders.map((order, idx) => (
                    <div key={idx} className="activity-item">
                      <div className="activity-icon">📦</div>
                      <div className="activity-details">
                        <p className="activity-title">Order {order.id} placed</p>
                        <p className="activity-subtitle">{order.product}</p>
                        <p className="activity-customer">{order.customer}</p>
                      </div>
                      <div className="activity-value">{order.value}</div>
                      <div className={`activity-status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'agents' && (
            <div className="tab-content">
              <div className="section-card">
                <h3>Manage Agents</h3>
                <p>Agent management features coming soon...</p>
                <div className="agents-management">
                  {agents.map((agent, idx) => (
                    <div key={idx} className="agent-card">
                      <div className="agent-info">
                        <div className="agent-avatar-lg">{agent.name.charAt(0)}</div>
                        <div>
                          <h4>{agent.name}</h4>
                          <p>{agent.status}</p>
                        </div>
                      </div>
                      <div className="agent-stats">
                        <div className="stat">
                          <span className="label">Earnings</span>
                          <span className="value">{agent.earnings}</span>
                        </div>
                        <div className="stat">
                          <span className="label">Orders</span>
                          <span className="value">{agent.orders}</span>
                        </div>
                      </div>
                      <button className="btn-action">View Details</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="tab-content">
              <div className="section-card">
                <h3>Product Inventory</h3>
                <p>Inventory management features coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="tab-content">
              <div className="section-card">
                <h3>Advanced Reports</h3>
                <p>Detailed reporting features coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
