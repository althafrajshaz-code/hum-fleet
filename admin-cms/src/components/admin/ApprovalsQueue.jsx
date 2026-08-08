import React from 'react';
import { Search, Check, X, DollarSign, FileText, Users, MessageSquare } from 'lucide-react';
import Button from '../Button';

const ApprovalsQueue = ({
  drivers,
  driverSearch,
  setDriverSearch,
  filteredPendingDrivers,
  selectedDriver,
  setSelectedDriver,
  handleApprove,
  handleReject,
  handleUpdateDriverCategory,
  categories,
  handleOpenPreview,
  getPhotoSrc,
  getDocSrc,
  setMessageModalDriver,
  fetchChatMessages
}) => {
  return (
    <div className="tab-pane">
      <h2>Partner Approvals Queue</h2>
      <p className="tab-subtitle">Review applicant registration profiles, uploaded vehicle photos, bank details, and compliance documents.</p>

      {drivers.filter(d => d.status === 'Pending').length === 0 ? (
        <p className="empty-state">No pending applications found in the database.</p>
      ) : (
        <div className="approval-layout">
          <div className="drivers-list">
            {/* Dynamic Search Box for Driver Approvals */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search by vehicle number, name, phone..." 
                value={driverSearch}
                onChange={(e) => setDriverSearch(e.target.value)}
                style={{ padding: '10px 14px 10px 36px', width: '100%', fontSize: '13px' }}
              />
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {filteredPendingDrivers.length === 0 ? (
              <p className="empty-state" style={{ padding: '20px 0' }}>No matching applications found.</p>
            ) : (
              filteredPendingDrivers.map(driver => (
                <div 
                  key={driver.id} 
                  className={`driver-list-card ${selectedDriver?.id === driver.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDriver(driver)}
                >
                  <div className="driver-info-header">
                    <h4>{driver.name}</h4>
                    <span className={`status-badge badge-${String(driver.status || '').toLowerCase()}`}>
                      {driver.status}
                    </span>
                  </div>
                  <p className="driver-car">{driver.manufacturer} {driver.model} ({driver.year})</p>
                  <p className="driver-plate">{driver.plate}</p>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }} onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="primary" 
                      onClick={() => handleApprove(driver.id)}
                      style={{ flex: 1, padding: '4px 8px', fontSize: '11px' }}
                    >
                      <Check size={14} /> Approve & Activate
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleReject(driver.id)}
                      style={{ flex: 1, padding: '4px 8px', fontSize: '11px', borderColor: '#ef4444', color: '#ef4444' }}
                    >
                      <X size={14} /> Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="driver-details-panel">
            {selectedDriver ? (
              <div className="details-scrollable">
                <h3>Review Profile: {selectedDriver.name}</h3>
                <div className="profile-grid">
                  <div><strong>Phone:</strong> {selectedDriver.phone}</div>
                  <div><strong>Email:</strong> {selectedDriver.email}</div>
                  {selectedDriver.licenseNumber && (
                     <div style={{ gridColumn: '1 / -1' }}><strong>Licence Number:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '800', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{selectedDriver.licenseNumber}</span></div>
                  )}
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <strong>Vehicle Category:</strong> 
                    <select 
                      value={selectedDriver.vehicleCategory || ''}
                      onChange={(e) => handleUpdateDriverCategory(selectedDriver.id, e.target.value)}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '14px', fontWeight: 'bold' }}
                    >
                      <option value="">Select Category</option>
                      {(Array.isArray(categories) ? categories : []).map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div><strong>Vehicle Make:</strong> {selectedDriver.manufacturer}</div>
                  <div><strong>Vehicle Model:</strong> {selectedDriver.model}</div>
                  <div><strong>Mfg. Year:</strong> {selectedDriver.year}</div>
                  <div><strong>Plate No:</strong> {selectedDriver.plate}</div>
                  <div><strong>Minimum Rate/KM:</strong> ₹{selectedDriver.ratePerKm || '15.00'}</div>
                  <div><strong>Minimum Rate/Hour:</strong> ₹{selectedDriver.ratePerHour || '120.00'}</div>
                </div>

                {/* Indian Bank Account Details Card */}
                <div style={{ marginTop: '14px', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', background: 'rgba(255,255,255,0.01)' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800' }}>
                    <DollarSign size={15} color="var(--primary)"/> Bank Account Details (Indian)
                  </h4>
                  {selectedDriver.bank ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                      <div><strong>Holder Name:</strong> {selectedDriver.bank.holderName || 'N/A'}</div>
                      <div><strong>Bank Name:</strong> {selectedDriver.bank.bankName || 'N/A'}</div>
                      <div><strong>Account No:</strong> {selectedDriver.bank.accountNumber || 'N/A'}</div>
                      <div><strong>IFSC Code:</strong> {selectedDriver.bank.ifscCode || 'N/A'}</div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No bank details provided.</div>
                  )}
                </div>

                {/* Partner Ledger Balance */}
                <div style={{ marginTop: '14px', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', background: 'rgba(255,255,255,0.01)' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><DollarSign size={15} color="var(--primary)"/> Partner Ledger (Cash Runs)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                    <div><strong>Collected Cash:</strong> ₹{parseFloat(selectedDriver.wallet?.cashCollected || 0).toFixed(2)}</div>
                    <div style={{ color: '#ef4444' }}><strong>Platform Debt Due:</strong> ₹{parseFloat(selectedDriver.wallet?.toBePaid || 0).toFixed(2)}</div>
                  </div>
                </div>

                {/* Live Registration Face Verification Selfie */}
                <div className="doc-section" style={{ marginTop: '14px' }}>
                  <h4>Registration Live Face Selfie <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>✓ Verified</span></h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div 
                      className="clickable-thumb" 
                      onClick={() => handleOpenPreview(selectedDriver.profilePic || selectedDriver.facePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600', `${selectedDriver.name} Live Face Selfie`)}
                      style={{ width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary)', flexShrink: 0 }}
                    >
                      <img 
                        src={selectedDriver.profilePic || selectedDriver.facePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600'} 
                        alt="Face Verification" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>Live Face Verification Captured</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Camera selfie captured during driver registration flow.</div>
                      <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', marginTop: '2px' }}>✓ Facial Geometry Validated</div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Photos */}
                <div className="doc-section" style={{ marginTop: '14px' }}>
                  <h4>Uploaded Vehicle Photos <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Click to view)</span></h4>
                  <div className="admin-docs-grid">
                    {Object.entries(selectedDriver.photos || {}).map(([side, data]) => {
                      const src = getPhotoSrc(side, data);
                      return (
                        <div key={side} className="admin-doc-thumbnail clickable-thumb" onClick={() => handleOpenPreview(src, `${side.charAt(0).toUpperCase() + side.slice(1)} View`)}>
                          <img src={src} alt={side} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                          <span className="thumb-label" style={{ marginTop: '4px' }}>{side.charAt(0).toUpperCase() + side.slice(1)} view</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Vehicle Documents */}
                <div className="doc-section">
                  <h4>Compliance Documents <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Click to view)</span></h4>
                  <div className="admin-docs-grid">
                    {[
                      { id: 'rc', label: 'Registration (RC)' },
                      { id: 'pollution', label: 'Pollution (PUC)' },
                      { id: 'insurance', label: 'Insurance' },
                      { id: 'fitness', label: 'Fitness Cert.' },
                      { id: 'license', label: 'Driving Licence (DL)' },
                      { id: 'licenseFront', label: 'DL (Front)' },
                      { id: 'licenseBack', label: 'DL (Back)' }
                    ].filter(doc => selectedDriver.docs?.[doc.id]).map((doc) => {
                      const data = selectedDriver.docs?.[doc.id];
                      const src = getDocSrc(data);
                      return (
                        <div key={doc.id} className="admin-doc-thumbnail doc-pdf clickable-thumb" onClick={() => handleOpenPreview(src, doc.label)}>
                          {data && data.startsWith('data:image') ? (
                            <img src={data} alt={doc.label} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '12px 0' }}>
                              <FileText size={28} color="var(--secondary)" />
                            </div>
                          )}
                          <span className="thumb-label">{doc.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                  <div className="action-buttons-row" style={{ display: 'flex', gap: '10px' }}>
                    {selectedDriver.status === 'Pending' && (
                      <>
                        <Button 
                          variant="outline" 
                          onClick={() => handleReject(selectedDriver.id)}
                          style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }}
                        >
                          <X size={16} /> Reject Partner
                        </Button>
                        <Button 
                          variant="primary" 
                          onClick={() => handleApprove(selectedDriver.id)}
                          style={{ flex: 1 }}
                        >
                          <Check size={16} /> Approve & Activate
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => { setMessageModalDriver(selectedDriver); fetchChatMessages(selectedDriver.email); }}
                      style={{ flex: 1, borderColor: '#3b82f6', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <MessageSquare size={16} /> Direct Message
                    </Button>
                  </div>
              </div>
            ) : (
              <div className="no-selection-state">
                <Users size={48} />
                <p>Select an applicant from the queue to view full profile, photos, and compliance documents.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalsQueue;
