import React from 'react';
import { Search, X, Users, MapPin, Navigation, Car, Radio, Compass, MessageSquare, Edit2, Shield, Trash2, Phone, FileText, Check, DollarSign, Download, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import Button from '../Button';

const Promotions = ({ activeTab }) => {
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
                  <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>Create New Promo</h3>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>Promo Code</label>
                      <input type="text" className="input-field" placeholder="e.g. SUMMER50" style={{ textTransform: 'uppercase' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>Discount Type</label>
                      <select className="input-field">
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (INR)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>Discount Value</label>
                      <input type="number" className="input-field" placeholder="e.g. 50" />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>Valid Until</label>
                      <input type="date" className="input-field" />
                    </div>
                    <button type="button" style={{ background: 'var(--primary)', color: '#000', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => alert('New promo code created successfully!')}>Generate Code</button>
                  </div>

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
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong style={{ color: 'var(--primary)', letterSpacing: '1px' }}>HUM50</strong></td>
                            <td>50% OFF</td>
                            <td>45/100</td>
                            <td>Dec 31, 2026</td>
                            <td><span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '12px' }}>Active</span></td>
                            <td><button style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>Deactivate</button></td>
                          </tr>
                          <tr>
                            <td><strong style={{ color: 'var(--primary)', letterSpacing: '1px' }}>WELCOME250</strong></td>
                            <td>₹250 OFF</td>
                            <td>912/Unlim</td>
                            <td>Never</td>
                            <td><span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '12px' }}>Active</span></td>
                            <td><button style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>Deactivate</button></td>
                          </tr>
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
