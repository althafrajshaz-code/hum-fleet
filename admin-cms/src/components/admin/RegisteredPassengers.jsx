import React from 'react';
import { Search, X, Users, MapPin, Navigation, Car, Radio, Compass, MessageSquare, Edit2, Shield, Trash2, Phone, FileText, Check, DollarSign, Download, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import Button from '../Button';

const RegisteredPassengers = ({ activeTab, setShowAddPassengerModal, passengerSearch, setPassengerSearch, filteredPassengers, handleDeletePassenger, page = 1, setPage = () => {}, totalPages = 1, totalItems = 0 }) => {
  return (
    <>
{/* TAB 2: Registered Passengers (Users) */}
          {activeTab === 'passengers' && (
            <div className="tab-pane">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2>Registered Customers (Users)</h2>
                  <p className="tab-subtitle">Database of passenger accounts registered to request and book rides on the platform.</p>
                </div>
                <button 
                  onClick={() => setShowAddPassengerModal(true)}
                  style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  + Add New Passenger
                </button>
              </div>

              {/* Dynamic Search Box for Passengers */}
              <div style={{ position: 'relative', margin: '14px 0 14px 0', maxWidth: '350px' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Search passengers (name, email, phone...)" 
                  value={passengerSearch}
                  onChange={(e) => setPassengerSearch(e.target.value)}
                  style={{ padding: '10px 14px 10px 36px', width: '100%', fontSize: '13px' }}
                />
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              {filteredPassengers.length === 0 ? (
                <p className="empty-state">No matching registered passengers found.</p>
              ) : (
                <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflowX: 'auto', background: 'rgba(255,255,255,0.01)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '16px', fontWeight: '700' }}>ID</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Name</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Rating</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Email Address</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Mobile Number</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Total Spent</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>GST Paid</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPassengers.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
                          <td style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)', fontSize: '12px' }}>{p.id || p._id}</td>
                          <td style={{ padding: '16px', fontWeight: '600' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', color: '#3b82f6' }}>
                                {p.profilePic ? <img src={p.profilePic} alt={p.name || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (p.name?.charAt(0) || 'U')}
                              </div>
                              <span>{p.name || 'Unknown User'}</span>
                            </div>
                          </td>
                          <td style={{ padding: '16px', color: '#f59e0b', fontWeight: '700' }}>★ {p.rating || '5.0'}</td>
                          <td style={{ padding: '16px', color: 'var(--text-main)' }}>{p.email}</td>
                          <td style={{ padding: '16px', color: 'var(--text-main)' }}>{p.phone}</td>
                          <td style={{ padding: '16px', fontWeight: '600', color: 'var(--primary)' }}>₹{parseFloat(p.wallet?.totalSpent || 0).toFixed(2)}</td>
                          <td style={{ padding: '16px', color: '#f59e0b' }}>₹{parseFloat(p.wallet?.taxPaid || 0).toFixed(2)}</td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <button
                                title="Message Passenger"
                                onClick={() => setMessageModalPassenger(p)}
                                style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <MessageSquare size={14} />
                              </button>
                              <button
                                title="Delete Passenger"
                                onClick={() => {
                                  if (window.confirm(`WARNING: Are you sure you want to PERMANENTLY delete passenger ${p.name}?`)) {
                                    handleDeletePassenger(p.id);
                                  }
                                }}
                                style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {/* Pagination Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Showing Page {page} of {totalPages} (Total: {totalItems} items)
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button 
                    variant="outline" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{ opacity: page === 1 ? 0.5 : 1, padding: '6px 12px' }}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || totalPages === 0}
                    style={{ opacity: page === totalPages || totalPages === 0 ? 0.5 : 1, padding: '6px 12px' }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}

          
    </>
  );
};

export default RegisteredPassengers;
