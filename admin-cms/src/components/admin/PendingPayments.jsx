import React from 'react';
import { Search, X, Users, MapPin, Navigation, Car, Radio, Compass, MessageSquare, Edit2, Shield, Trash2, Phone, FileText, Check, DollarSign, Download, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import Button from '../Button';

const PendingPayments = ({ activeTab }) => {
  return (
    <>
{/* TAB: Dedicated Pending Payments Section */}
          {activeTab === 'pending-payments' && (
            <div className="tab-pane">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CreditCard color="#ef4444" size={28} /> Pending Payments & Dues Control
                  </h2>
                  <p className="tab-subtitle">
                    Dedicated view for outstanding partner balances. Dues uncollected on the same day automatically roll over daily with aging indicators until cleared.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Search partner, phone, plate..." 
                      value={pendingSearch}
                      onChange={(e) => setPendingSearch(e.target.value)}
                      style={{ padding: '8px 12px 8px 34px', width: '220px', fontSize: '13px' }}
                    />
                    <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>

                  <select 
                    className="input-field" 
                    value={pendingFilter} 
                    onChange={(e) => setPendingFilter(e.target.value)}
                    style={{ 
                      padding: '8px 12px', 
                      width: '210px', 
                      fontSize: '13px', 
                      fontWeight: '600',
                      color: '#ffffff',
                      background: '#1a2035',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all" style={{ background: '#1a2035', color: '#ffffff' }}>All Pending Dues</option>
                    <option value="same-day" style={{ background: '#1a2035', color: '#3b82f6' }}>Pending Today (Same Day)</option>
                    <option value="rolled-over" style={{ background: '#1a2035', color: '#f59e0b' }}>Rolled Over (1+ Days)</option>
                    <option value="critical-overdue" style={{ background: '#1a2035', color: '#ef4444' }}>Critical Overdue (&gt; 3 Days)</option>
                  </select>

                  <Button 
                    variant="outline" 
                    onClick={downloadPendingPaymentsCSV}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '38px', borderColor: '#ef4444', color: '#ef4444' }}
                  >
                    <FileText size={16} /> Export Pending Dues (CSV)
                  </Button>
                </div>
              </div>

              {/* Summary Cards Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase' }}>Total Outstanding Dues</span>
                    <AlertCircle size={20} color="#ef4444" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', marginTop: '8px', marginBottom: '0' }}>
                    -₹{pendingPaymentsData.summary.totalOutstanding}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Across all active partner accounts</span>
                </div>

                <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase' }}>Due Today (Same Day)</span>
                    <Check size={20} color="#3b82f6" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', marginTop: '8px', marginBottom: '0' }}>
                    -₹{pendingPaymentsData.summary.totalSameDay}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Incurred today & pending collection</span>
                </div>

                <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase' }}>Rolled-Over Dues</span>
                    <TrendingUp size={20} color="#f59e0b" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', marginTop: '8px', marginBottom: '0' }}>
                    -₹{pendingPaymentsData.summary.totalRolledOver}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Uncollected from previous days</span>
                </div>

                <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#a855f7', textTransform: 'uppercase' }}>Pending Partners</span>
                    <Users size={20} color="#a855f7" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', marginTop: '8px', marginBottom: '0' }}>
                    {pendingPaymentsData.summary.pendingPartnersCount}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Drivers with balance due &gt; ₹0</span>
                </div>
              </div>

              {/* Table of Pending Payments */}
              {filteredPendingPayments.length === 0 ? (
                <p className="empty-state">No pending payment dues matching your criteria.</p>
              ) : (
                <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflowX: 'auto', background: 'rgba(255,255,255,0.01)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Partner Name</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Contact</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Vehicle Plate</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Cash Collected</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Pending Due Amount</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>First Incurred Date</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Aging / Days Pending</th>
                        <th style={{ padding: '16px', fontWeight: '700', textAlign: 'center' }}>Rollover Status</th>
                        <th style={{ padding: '16px', fontWeight: '700', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPendingPayments.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
                          <td style={{ padding: '16px', fontWeight: '600' }}>{p.name}</td>
                          <td style={{ padding: '16px', color: 'var(--text-main)', fontWeight: '500' }}>{p.phone}</td>
                          <td style={{ padding: '16px', color: 'var(--text-main)' }}>
                            {p.manufacturer} {p.model} (<span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '600' }}>{p.plate}</span>)
                          </td>
                          <td style={{ padding: '16px', fontWeight: '600', color: 'var(--primary)' }}>₹{p.cashCollected}</td>
                          <td style={{ padding: '16px', fontWeight: '800', color: '#ef4444', fontSize: '15px' }}>-₹{p.toBePaid}</td>
                          <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>{p.pendingDateFormatted}</td>
                          <td style={{ padding: '16px', fontWeight: '700' }}>
                            {p.daysPending === 0 ? (
                              <span style={{ color: '#3b82f6' }}>0 Days (Today)</span>
                            ) : p.daysPending === 1 ? (
                              <span style={{ color: '#f59e0b' }}>1 Day Overdue</span>
                            ) : (
                              <span style={{ color: '#ef4444' }}>{p.daysPending} Days Overdue</span>
                            )}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: '4px',
                              background: p.daysPending === 0 ? 'rgba(59,130,246,0.1)' : p.daysPending < 3 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.15)',
                              color: p.daysPending === 0 ? '#3b82f6' : p.daysPending < 3 ? '#f59e0b' : '#ef4444',
                              border: `1px solid ${p.daysPending === 0 ? 'rgba(59,130,246,0.3)' : p.daysPending < 3 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.4)'}`,
                              borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: '800'
                            }}>
                              {p.statusLabel}
                            </span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <Button 
                                variant="primary" 
                                style={{ padding: '6px 12px', fontSize: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: '700' }}
                                onClick={() => {
                                  setSelectedLedgerDriver(drivers.find(d => d.id === p.id) || p);
                                  setCollectAmount(p.toBePaid);
                                  setShowCollectCashModal(true);
                                }}
                              >
                                ✅ Payment Received
                              </Button>
                              <Button 
                                variant="outline" 
                                style={{ padding: '6px 10px', fontSize: '12px', borderColor: '#3b82f6', color: '#3b82f6' }}
                                onClick={() => {
                                  const driverObj = drivers.find(d => d.id === p.id) || p;
                                  setMessageModalDriver(driverObj);
                                  fetchChatMessages(driverObj.email);
                                }}
                              >
                                <MessageSquare size={14} /> Reminder
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          
    </>
  );
};

export default PendingPayments;
