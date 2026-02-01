import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { authAPI, orderAPI, productAPI, userAPI, commissionAPI } from '../utils/apiClient';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, activeAgents: 0, totalCommissions: 0 });
  const [agents, setAgents] = useState([]);
  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // New agent creation state
  const [newAgent, setNewAgent] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', commissionRate: 10 });
  const [agentLoading, setAgentLoading] = useState(false);

  // Product editing state
  const [editingProductId, setEditingProductId] = useState(null);
  const [editQty, setEditQty] = useState(0);
  const [productSaving, setProductSaving] = useState(false);

  const createAgent = async (e) => {
    e.preventDefault();
    setAgentLoading(true);
    try {
      const payload = {
        firstName: newAgent.firstName,
        lastName: newAgent.lastName,
        email: newAgent.email,
        phone: newAgent.phone,
        password: newAgent.password,
        role: 'AGENT',
        agentProfile: { commissionRate: Number(newAgent.commissionRate) }
      };

      // Use userAPI.create so we don't overwrite current admin auth token
      await userAPI.create(payload);
      alert('Agent created successfully');
      setNewAgent({ firstName: '', lastName: '', email: '', phone: '', password: '', commissionRate: 10 });

      // Refresh agent list
      const users = await userAPI.getAll();
      setAgents((users || []).filter(u => u.role === 'AGENT'));
    } catch (err) {
      console.error('Failed to create agent', err);
      alert('Failed to create agent: ' + (err.message || 'Unknown error'));
    } finally {
      setAgentLoading(false);
    }
  };

  const startEditQty = (product) => {
    setEditingProductId(product._id);
    setEditQty(product.inventoryCount ?? 0);
  };

  const cancelEditQty = () => {
    setEditingProductId(null);
    setEditQty(0);
  };

  const saveQty = async (productId) => {
    setProductSaving(true);
    try {
      const body = { inventoryCount: Number(editQty) };
      if (Number(editQty) <= 0) body.status = 'OUT_OF_STOCK';
      else body.status = 'ACTIVE';
      const updated = await productAPI.update(productId, body);

      // Update local state
      setProducts(prev => prev.map(p => p._id === productId ? updated : p));
      setEditingProductId(null);
      setEditQty(0);
    } catch (err) {
      console.error('Failed to update product qty', err);
      alert('Failed to update product quantity');
    } finally {
      setProductSaving(false);
    }
  };

  // Pagination & refresh
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);

  useEffect(() => {
    // Ensure only ADMIN can access this page
    const checkAccess = async () => {
      try {
        const me = await authAPI.getMe();
        if (!me || me.role !== 'ADMIN') {
          // If agent logged in, send to agent dashboard
          if (me && me.role === 'AGENT') {
            navigate('/agent-dashboard');
          } else {
            navigate('/login');
          }
          return;
        }
      } catch (err) {
        // Not authorized
        navigate('/login');
        return;
      }

      // Load admin data only if authorized
      const fetchData = async () => {
        setLoading(true);
        try {
          const [ordersRes, allProducts, users, commissions] = await Promise.all([
            orderAPI.getAll({ page, limit }),
            productAPI.getAll(),
            userAPI.getAll(),
            commissionAPI.getAll()
          ]);

          const ordersList = (ordersRes && ordersRes.value) ? ordersRes.value : (ordersRes || []);
          const count = ordersRes && ordersRes.Count ? ordersRes.Count : ordersList.length;
          const totalRevenue = ordersList.reduce((sum, o) => sum + (o.total || 0), 0);

          const agentList = (users || []).filter(u => u.role === 'AGENT');
          const activeAgents = agentList.filter(a => a.isActive).length;

          const totalCommissions = (commissions || []).reduce((sum, c) => sum + (c.amountEarned || 0), 0);

          setStats({ totalRevenue, totalOrders: count, activeAgents, totalCommissions });
          setAgents(agentList);
          setProducts(allProducts || []);
          setRecentOrders(ordersList);
          setTotalOrdersCount(count);
        } catch (error) {
          console.error('Failed to load admin data', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();

      // Polling every 30 seconds
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    };

    checkAccess();
  }, [page, limit, navigate]);


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
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <p className="stat-label">TOTAL REVENUE</p>
                    <h3 className="stat-value">₹{stats.totalRevenue.toLocaleString()}</h3>
                    <span className="stat-change">{' '}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-content">
                    <p className="stat-label">TOTAL ORDERS</p>
                    <h3 className="stat-value">{stats.totalOrders}</h3>
                    <span className="stat-change">{' '}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <p className="stat-label">ACTIVE AGENTS</p>
                    <h3 className="stat-value">{stats.activeAgents}</h3>
                    <span className="stat-change">{' '}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <p className="stat-label">COMMISSIONS</p>
                    <h3 className="stat-value">₹{stats.totalCommissions.toLocaleString()}</h3>
                    <span className="stat-change">{' '}</span>
                  </div>
                </div>
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
                    <div className="col-points">Points</div>
                    <div className="col-orders">Orders</div>
                    <div className="col-status">Status</div>
                  </div>
                  {agents.map((agent, idx) => (
                    <div key={agent._id || idx} className="table-row">
                      <div className="col-name">
                        <div className="agent-avatar">{(agent.firstName || '').charAt(0)}</div>
                        <span>{agent.firstName} {agent.lastName}</span>
                      </div>
                      <div className="col-earnings">₹{agent.agentProfile?.totalEarnings ?? 0}</div>
                      <div className="col-points">{agent.agentProfile?.points ?? 0}</div>
                      <div className="col-orders">—</div>
                      <div className="col-status">
                        <span className={`status-badge ${agent.isActive ? 'approved' : 'pending'}`}>
                          {agent.isActive ? 'Active' : 'Inactive'}
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
                  {recentOrders.length === 0 && !loading && <p>No recent orders.</p>}
                  {recentOrders.map((order, idx) => (
                    <div key={order._id || idx} className="activity-item">
                      <div className="activity-icon">📦</div>
                      <div className="activity-details">
                        <p className="activity-title">Order {order.orderNumber} placed</p>
                        <p className="activity-subtitle">Items: {order.items?.length || 0}</p>
                        <p className="activity-customer">{order.customerId?.firstName} {order.customerId?.lastName}</p>
                        <p className="activity-agent">Agent: {order.agentId ? (order.agentId.firstName ? `${order.agentId.firstName} ${order.agentId.lastName}` : order.agentId) : '—'}</p>

                        <details>
                          <summary>View details</summary>
                          <div className="order-detail-expanded">
                            <h4>Items</h4>
                            {order.items?.map((it, i) => (
                              <div key={i}>{it.name} • Qty: {it.quantity} • ₹{it.priceAtPurchase}</div>
                            ))}

                            <h4 style={{ marginTop: 10 }}>Shipping Address</h4>
                            {order.shippingAddress ? (
                              <div>
                                <div>{order.shippingAddress.name}</div>
                                <div>{order.shippingAddress.street}, {order.shippingAddress.city} - {order.shippingAddress.zip}</div>
                                <div>{order.shippingAddress.phone}</div>
                              </div>
                            ) : (<div>—</div>)}

                            <div style={{ marginTop: 10 }}>
                              <label>Assign / Change Agent</label>
                              <select defaultValue={(order.agentId && order.agentId._id) ? order.agentId._id : (order.agentId || '')} onChange={async (e) => {
                                const agentId = e.target.value || null;
                                try {
                                  await orderAPI.assignAgent(order._id, agentId);
                                  alert('Agent assigned successfully');
                                  // refresh orders list
                                  const res = await orderAPI.getAll({ page, limit });
                                  const ordersList = (res && res.value) ? res.value : (res || []);
                                  setRecentOrders(ordersList);
                                  // refresh agents to show updated earnings if any
                                  const users = await userAPI.getAll();
                                  setAgents((users || []).filter(u => u.role === 'AGENT'));
                                } catch (err) {
                                  console.error('Failed to assign agent', err);
                                  alert('Failed to assign agent');
                                }
                              }}>
                                <option value="">— Unassigned —</option>
                                {agents.map(a => (
                                  <option key={a._id} value={a._id}>{a.firstName} {a.lastName} — {a.email}</option>
                                ))}
                              </select>
                            </div>

                            <div style={{ marginTop: 12 }}>
                              <label>Update Status</label>
                              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                                <select defaultValue={order.status} id={`status-select-${order._id}`}>
                                  <option value="PENDING">PENDING</option>
                                  <option value="PAID">PAID</option>
                                  <option value="PROCESSING">PROCESSING</option>
                                  <option value="SHIPPED">SHIPPED</option>
                                  <option value="DELIVERED">DELIVERED</option>
                                  <option value="COMPLETED">COMPLETED</option>
                                  <option value="CANCELLED">CANCELLED</option>
                                  <option value="REFUNDED">REFUNDED</option>
                                </select>
                                <button className="btn-action" onClick={async () => {
                                  const sel = document.getElementById(`status-select-${order._id}`);
                                  const status = sel ? sel.value : order.status;
                                  try {
                                    const updated = await orderAPI.updateStatus(order._id, status);
                                    console.log('Order updated:', updated);
                                    alert(`Order status updated to ${updated.status}`);

                                    const res = await orderAPI.getAll({ page, limit });
                                    const ordersList = (res && res.value) ? res.value : (res || []);
                                    setRecentOrders(ordersList);

                                    // refresh agents list as commission may have been awarded
                                    const users = await userAPI.getAll();
                                    setAgents((users || []).filter(u => u.role === 'AGENT'));
                                  } catch (err) {
                                    console.error('Failed to update status', err);
                                    alert('Failed to update order status: ' + (err.message || JSON.stringify(err)));
                                  }
                                }}>Update</button>
                              </div>
                            </div>
                          </div>
                        </details>
                      </div>
                      <div className="activity-value">₹{(order.total || 0).toLocaleString()}</div>
                      <div className={`activity-status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </div>
                    </div>
                  ))}

                  {/* Pagination Controls */}
                  <div className="pagination">
                    <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
                    <span className="page-info">Page {page} / {Math.max(1, Math.ceil(totalOrdersCount / limit))}</span>
                    <button className="page-btn" disabled={page >= Math.ceil(totalOrdersCount / limit)} onClick={() => setPage(p => p + 1)}>Next</button>
                    <select value={limit} onChange={e => setLimit(parseInt(e.target.value, 10))}>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'agents' && (
            <div className="tab-content">
              <div className="section-card">
                <h3>Manage Agents</h3>

                {/* Add Agent Form */}
                <form className="add-agent-form" onSubmit={createAgent}>
                  <div className="form-row">
                    <input type="text" placeholder="First name" value={newAgent.firstName} onChange={e => setNewAgent(s => ({ ...s, firstName: e.target.value }))} required />
                    <input type="text" placeholder="Last name" value={newAgent.lastName} onChange={e => setNewAgent(s => ({ ...s, lastName: e.target.value }))} required />
                  </div>
                  <div className="form-row">
                    <input type="email" placeholder="Email" value={newAgent.email} onChange={e => setNewAgent(s => ({ ...s, email: e.target.value }))} required />
                    <input type="tel" placeholder="Phone" value={newAgent.phone} onChange={e => setNewAgent(s => ({ ...s, phone: e.target.value }))} />
                  </div>
                  <div className="form-row">
                    <input type="password" placeholder="Password" value={newAgent.password} onChange={e => setNewAgent(s => ({ ...s, password: e.target.value }))} required />
                    <input type="number" placeholder="Commission %" value={newAgent.commissionRate} onChange={e => setNewAgent(s => ({ ...s, commissionRate: e.target.value }))} min={0} max={100} />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-action" disabled={agentLoading}>{agentLoading ? 'Creating...' : 'Create Agent'}</button>
                  </div>
                </form>

                <div className="agents-management">
                  {agents.map((agent, idx) => (
                    <div key={agent._id || idx} className="agent-card">
                      <div className="agent-info">
                        <div className="agent-avatar-lg">{(agent.firstName || '').charAt(0)}</div>
                        <div>
                          <h4>{agent.firstName} {agent.lastName}</h4>
                          <p>{agent.email}</p>
                        </div>
                      </div>
                      <div className="agent-stats">
                        <div className="stat">
                          <span className="label">Earnings</span>
                          <span className="value">₹{agent.agentProfile?.totalEarnings ?? 0}</span>
                        </div>
                        <div className="stat">
                          <span className="label">Points</span>
                          <span className="value">{agent.agentProfile?.points ?? 0}</span>
                        </div>
                        <div className="stat">
                          <span className="label">Status</span>
                          <span className="value">{agent.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                      <div className="agent-actions">
                        <button className="btn-action">View Details</button>
                      </div>
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
                <div className="inventory-grid">
                  {products.length === 0 && <p>No products found.</p>}
                  {products.map((p) => (
                    <div key={p._id} className="product-card">
                      <div className="product-info">
                        <div className="product-thumb">{(p.name || '').split(' ').slice(0,2).map(w=>w[0]).join('')}</div>
                        <div className="product-meta">
                          <h4 className="product-name">{p.name}</h4>
                          <p className="sku">{p.sku}</p>
                        </div>
                      </div>
                      <div className="product-stats">
                        <div className={`qty ${ (p.inventoryCount ?? 0) <= 5 ? 'low' : '' }`}>Qty: <strong>{p.inventoryCount ?? 0}</strong></div>
                        <div className={`status ${ (p.status || '').toLowerCase() }`}>{p.status}</div>
                      </div>

                      <div className="product-actions">
                        {editingProductId === p._id ? (
                          <div className="edit-controls">
                            <input type="number" value={editQty} onChange={e => setEditQty(e.target.value)} min={0} />
                            <button className="btn-action" onClick={() => saveQty(p._id)} disabled={productSaving}>{productSaving ? 'Saving...' : 'Save'}</button>
                            <button className="btn-action" onClick={cancelEditQty}>Cancel</button>
                          </div>
                        ) : (
                          <div className="edit-controls">
                            <button className="btn-action" onClick={() => startEditQty(p)}>Edit Qty</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
