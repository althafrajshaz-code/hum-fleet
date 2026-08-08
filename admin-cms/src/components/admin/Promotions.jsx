import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Promotions = ({ activeTab }) => {
  const [promotions, setPromotions] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [maxUsage, setMaxUsage] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const fetchPromotions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/promotions?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setPromotions(data);
      }
    } catch (err) {
      console.error('Failed to fetch promotions:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'promotions') {
      fetchPromotions();
    }
  }, [activeTab]);

  const handleCreatePromo = async (e) => {
    e.preventDefault();
    if (!promoCode || !discountValue) {
      alert('Please fill in code and discount value.');
      return;
    }

    const payload = {
      code: promoCode,
      discountType,
      discountValue,
      maxUsage,
      validUntil
    };

    try {
      const res = await fetch(`${API_BASE}/api/promotions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('New promo code created successfully!');
        setPromoCode('');
        setDiscountValue('');
        setMaxUsage('');
        setValidUntil('');
        fetchPromotions();
      }
    } catch (err) {
      console.error('Error creating promo:', err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch(`${API_BASE}/api/promotions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchPromotions();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleDeletePromo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promotional code?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/promotions/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchPromotions();
      }
    } catch (err) {
      console.error('Error deleting promo:', err);
    }
  };

  return (
    <>
      {/* TAB: Promotions */}
      {activeTab === 'promotions' && (
        <div className="tab-pane animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag size={24} color="var(--primary)" /> Promotions & Offer Codes
            </h2>
            <p className="tab-subtitle">Manage discount promo codes and promotional campaigns.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginTop: '20px' }}>
              {/* Create New Promo */}
              <form onSubmit={handleCreatePromo} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>Create New Promo</h3>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>Promo Code</label>
                  <input type="text" className="input-field" placeholder="e.g. SUMMER50" style={{ textTransform: 'uppercase' }} value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>Discount Type</label>
                  <select className="input-field" value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>Discount Value</label>
                  <input type="number" className="input-field" placeholder="e.g. 50" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} required min="0" step="0.01" />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>Max Usage (Optional)</label>
                  <input type="number" className="input-field" placeholder="e.g. 100" value={maxUsage} onChange={(e) => setMaxUsage(e.target.value)} min="1" />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>Valid Until (Optional)</label>
                  <input type="date" className="input-field" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                </div>
                <button type="submit" style={{ background: 'var(--primary)', color: '#000', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Generate Code</button>
              </form>

              {/* Active Promos List */}
              <div className="glass-card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '16px' }}>Active Promotional Codes</h3>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Discount</th>
                        <th>Usage</th>
                        <th>Expires</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promotions.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No promotional codes found.</td>
                        </tr>
                      ) : (
                        promotions.map(promo => (
                          <tr key={promo.id || promo._id} style={{ opacity: promo.status === 'Inactive' ? 0.6 : 1 }}>
                            <td><strong style={{ color: 'var(--primary)', letterSpacing: '1px' }}>{promo.code}</strong></td>
                            <td>{promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `₹${promo.discountValue} OFF`}</td>
                            <td>{promo.usedCount || 0}/{promo.maxUsage || 'Unlim'}</td>
                            <td>{promo.validUntil ? new Date(promo.validUntil).toLocaleDateString() : 'Never'}</td>
                            <td>
                              <span style={{ color: promo.status === 'Active' ? '#10b981' : '#ef4444', fontWeight: 'bold', fontSize: '12px' }}>
                                {promo.status || 'Active'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                  onClick={() => handleToggleStatus(promo.id || promo._id, promo.status || 'Active')}
                                  style={{ background: 'transparent', color: promo.status === 'Active' ? '#ef4444' : '#10b981', border: `1px solid ${promo.status === 'Active' ? '#ef4444' : '#10b981'}`, borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}
                                >
                                  {promo.status === 'Active' ? 'Deactivate' : 'Activate'}
                                </button>
                                <button 
                                  onClick={() => handleDeletePromo(promo.id || promo._id)}
                                  style={{ background: 'transparent', color: '#ef4444', border: 'none', padding: '4px', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Promotions;
