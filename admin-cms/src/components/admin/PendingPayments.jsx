import React, { useState } from 'react';
import { Search, X, Users, MapPin, Navigation, Car, Radio, Compass, MessageSquare, Edit2, Shield, Trash2, Phone, FileText, Check, DollarSign, Download, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import Button from '../Button';

const PendingPayments = ({ 
  activeTab,
  pendingSearch,
  setPendingSearch,
  pendingFilter,
  setPendingFilter,
  downloadPendingPaymentsCSV,
  pendingPaymentsData,
  filteredPendingPayments,
  setSelectedLedgerDriver,
  setCollectAmount,
  setShowCollectCashModal,
  drivers,
  setMessageModalDriver,
  fetchChatMessages
}) => {
  const [billImage, setBillImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBill = async (driver) => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Watermark
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 4);
      ctx.font = 'bold 120px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('HUM FLEET', 0, 0);
      ctx.restore();

      // Header
      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, 0, canvas.width, 16);
      
      ctx.font = 'bold 42px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('HUM FLEET', canvas.width / 2, 80);

      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('PENDING DUES STATEMENT', canvas.width / 2, 115);

      // Separator
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 150);
      ctx.lineTo(550, 150);
      ctx.stroke();

      // Driver Info
      ctx.textAlign = 'left';
      
      ctx.font = 'bold 22px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('PARTNER DETAILS:', 50, 200);

      ctx.font = 'bold 32px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(driver.name || 'Unknown Partner', 50, 240);

      ctx.font = '24px sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Phone: ${driver.phone || 'N/A'}`, 50, 280);
      ctx.fillText(`Vehicle: ${driver.plate || 'N/A'}`, 50, 320);
      ctx.fillText(`Type: ${driver.manufacturer || ''} ${driver.model || ''}`, 50, 360);

      // Payment Box
      ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(50, 420, 500, 200, 16);
      } else {
        ctx.rect(50, 420, 500, 200);
      }
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.fillText('PENDING BALANCE TO PAY', canvas.width / 2, 470);

      ctx.font = 'bold 72px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`₹${driver.toBePaid || '0.00'}`, canvas.width / 2, 550);

      // Footer
      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Please clear your dues to continue receiving rides.', canvas.width / 2, 680);
      
      const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`Generated: ${date}`, canvas.width / 2, 730);

      const dataUrl = canvas.toDataURL('image/png');
      setBillImage({ dataUrl, driver });
    } catch (err) {
      console.error(err);
      alert('Failed to generate bill image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
{/* TAB: Dedicated Pending Payments Section */}
          {activeTab === 'payments' && (
            <div className="tab-pane animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <DollarSign color="#ef4444" size={28} /> Pending Payments & Dues Control
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
                              <Button 
                                variant="outline" 
                                style={{ padding: '6px 10px', fontSize: '12px', borderColor: '#a855f7', color: '#a855f7' }}
                                onClick={() => generateBill(p)}
                              >
                                <FileText size={14} /> Send Bill
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
            </div>
          )}

      {/* Bill Image Share Modal */}
      {billImage && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', maxWidth: '400px', width: '100%', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Share Bill to Partner</h3>
              <button onClick={() => setBillImage(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <img src={billImage.dataUrl} alt="Bill Preview" style={{ width: '100%', borderRadius: '8px', border: '1px solid #334155', marginBottom: '20px' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button 
                variant="primary"
                style={{ width: '100%', background: '#25D366', border: 'none', display: 'flex', justifyContent: 'center', gap: '8px', padding: '12px', fontWeight: 'bold' }}
                onClick={async () => {
                  try {
                    const res = await fetch(billImage.dataUrl);
                    const blob = await res.blob();
                    const file = new File([blob], `HUM_Bill_${billImage.driver.name.replace(/\s+/g, '_')}.png`, { type: 'image/png' });
                    
                    if (navigator.share) {
                      await navigator.share({
                        title: 'Pending Dues - HUM Fleet',
                        text: `Hello ${billImage.driver.name}, here is your pending dues statement from HUM Fleet.`,
                        files: [file]
                      });
                    } else {
                      alert('Native sharing is not supported on this browser. Please use the Download button and manually attach the image in WhatsApp.');
                    }
                  } catch (err) {
                    console.error('Share failed', err);
                  }
                }}
              >
                <MessageSquare size={18} /> Share via WhatsApp
              </Button>

              <a 
                href={billImage.dataUrl} 
                download={`HUM_Bill_${billImage.driver.name.replace(/\s+/g, '_')}.png`}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px', background: '#334155', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
              >
                <Download size={18} /> Download Image
              </a>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default PendingPayments;
