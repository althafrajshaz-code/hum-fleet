import React, { useState, useEffect } from 'react';
import { Shield, Users, Car, DollarSign, Settings, Eye, Check, X, AlertCircle, CreditCard, Upload, FileText } from 'lucide-react';
import Button from '../components/Button';
import './AdminDashboard.css';

// Initial Mock Drivers for Approval (fallback)
const INITIAL_DRIVERS = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh.k@gmail.com',
    phone: '+91 98765 43210',
    manufacturer: 'Tata',
    model: 'Nexon',
    year: '2023',
    plate: 'DL 3C AY 4567',
    status: 'Pending',
    photos: { front: 'front_nexon.jpg', rear: 'rear_nexon.jpg', left: 'left_nexon.jpg', right: 'right_nexon.jpg', inside: 'inside_nexon.jpg' },
    docs: { rc: 'rc_rajesh.pdf', pollution: 'puc_rajesh.pdf', insurance: 'insurance_rajesh.pdf', fitness: 'fitness_rajesh.pdf' }
  }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('approvals');
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  
  // System control states
  const [baseFare, setBaseFare] = useState('50.00');
  const [ratePerKm, setRatePerKm] = useState('15.00');
  const [minRatePerHour, setMinRatePerHour] = useState('100.00');
  const [surgeMultiplier, setSurgeMultiplier] = useState('1.0');
  const [systemStatus, setSystemStatus] = useState('online');

  // Payment Gateway states
  const [gatewayType, setGatewayType] = useState('upi'); // 'upi' | 'bank'
  const [upiId, setUpiId] = useState('humfleet@okaxis');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNo, setAccountNo] = useState('50100481293845');
  const [ifscCode, setIfscCode] = useState('HDFC0000123');
  const [accountHolder, setAccountHolder] = useState('HUM FLEET PLATFORMS PVT LTD');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Fetch all drivers and settings
  const fetchDrivers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/drivers');
      if (res.ok) {
        const data = await res.json();
        setDrivers(data && data.length > 0 ? data : INITIAL_DRIVERS);
      } else {
        setDrivers(INITIAL_DRIVERS);
      }
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setDrivers(INITIAL_DRIVERS);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/settings');
      if (res.ok) {
        const data = await res.json();
        setBaseFare(data.baseFare || '50.00');
        setRatePerKm(data.ratePerKm || '15.00');
        setMinRatePerHour(data.minRatePerHour || '100.00');
        setSurgeMultiplier(data.surgeMultiplier || '1.0');
        setSystemStatus(data.systemStatus || 'online');
        setGatewayType(data.gatewayType || 'upi');
        setUpiId(data.upiId || '');
        setBankName(data.bankName || '');
        setAccountNo(data.accountNo || '');
        setIfscCode(data.ifscCode || '');
        setAccountHolder(data.accountHolder || '');
        setQrCodeUrl(data.qrCodeUrl || '');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchSettings();
  }, []);

  // Simulated ride stats
  const totalDrivers = drivers.length; 
  const approvedDrivers = drivers.filter(d => d.status === 'Approved').length;
  const pendingDrivers = drivers.filter(d => d.status === 'Pending').length;

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/drivers/${id}/approve`, {
        method: 'POST'
      });
      if (res.ok) {
        alert('Driver approved and activated!');
        fetchDrivers();
        setSelectedDriver(null);
      } else {
        alert('Failed to approve driver.');
      }
    } catch (err) {
      console.error(err);
      alert('Error approving driver.');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/drivers/${id}/reject`, {
        method: 'POST'
      });
      if (res.ok) {
        alert('Driver application rejected.');
        fetchDrivers();
        setSelectedDriver(null);
      } else {
        alert('Failed to reject driver.');
      }
    } catch (err) {
      console.error(err);
      alert('Error rejecting driver.');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseFare,
          ratePerKm,
          minRatePerHour,
          surgeMultiplier,
          systemStatus,
          gatewayType,
          upiId,
          bankName,
          accountNo,
          ifscCode,
          accountHolder,
          qrCodeUrl
        })
      });
      if (res.ok) {
        alert('System and Payment Gateway settings updated successfully!');
        fetchSettings();
      } else {
        alert('Failed to update settings.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving settings.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container container">
        {/* Sidebar Nav */}
        <aside className="admin-sidebar glass-card">
          <div className="admin-profile">
            <div className="admin-avatar">
              <Shield size={24} />
            </div>
            <div>
              <h3>Admin Panel</h3>
              <p>HUM Fleet Control</p>
            </div>
          </div>
          <nav className="admin-nav">
            <button 
              className={`admin-nav-item ${activeTab === 'approvals' ? 'active' : ''}`}
              onClick={() => setActiveTab('approvals')}
            >
              <Users size={18} /> Driver Approvals ({pendingDrivers})
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} /> System Controls
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="admin-content glass-card">
          {/* Stats Bar */}
          <div className="admin-stats-row">
            <div className="admin-stat-box">
              <span className="stat-label">Total Drivers</span>
              <span className="stat-value">{totalDrivers}</span>
            </div>
            <div className="admin-stat-box">
              <span className="stat-label">Pending Approval</span>
              <span className="stat-value text-gradient">{pendingDrivers}</span>
            </div>
            <div className="admin-stat-box">
              <span className="stat-label">Active Rides</span>
              <span className="stat-value">12</span>
            </div>
            <div className="admin-stat-box">
              <span className="stat-label">System State</span>
              <span className="stat-value" style={{ color: systemStatus === 'online' ? 'var(--primary)' : '#ef4444' }}>
                {systemStatus.toUpperCase()}
              </span>
            </div>
          </div>

          <hr className="divider" />

          {/* TAB 1: Driver Approvals */}
          {activeTab === 'approvals' && (
            <div className="tab-pane">
              <h2>Driver Approvals Queue</h2>
              <p className="tab-subtitle">Review applicant registration profiles, uploaded vehicle photos, and mandatory legal documents.</p>

              {drivers.length === 0 ? (
                <p className="empty-state">No new applications at the moment.</p>
              ) : (
                <div className="approval-layout">
                  <div className="drivers-list">
                    {drivers.map(driver => (
                      <div 
                        key={driver.id} 
                        className={`driver-list-card ${selectedDriver?.id === driver.id ? 'selected' : ''}`}
                        onClick={() => setSelectedDriver(driver)}
                      >
                        <div className="driver-info-header">
                          <h4>{driver.name}</h4>
                          <span className={`status-badge badge-${driver.status.toLowerCase()}`}>
                            {driver.status}
                          </span>
                        </div>
                        <p className="driver-car">{driver.manufacturer} {driver.model} ({driver.year})</p>
                        <p className="driver-plate">{driver.plate}</p>
                      </div>
                    ))}
                  </div>

                  <div className="driver-details-panel">
                    {selectedDriver ? (
                      <div className="details-scrollable">
                        <h3>Review Profile: {selectedDriver.name}</h3>
                        <div className="profile-grid">
                          <div><strong>Phone:</strong> {selectedDriver.phone}</div>
                          <div><strong>Email:</strong> {selectedDriver.email}</div>
                          <div><strong>Vehicle Make:</strong> {selectedDriver.manufacturer}</div>
                          <div><strong>Vehicle Model:</strong> {selectedDriver.model}</div>
                          <div><strong>Mfg. Year:</strong> {selectedDriver.year}</div>
                          <div><strong>Plate No:</strong> {selectedDriver.plate}</div>
                        </div>

                        {/* Vehicle Photos */}
                        <div className="doc-section">
                          <h4>Uploaded Vehicle Photos</h4>
                          <div className="admin-docs-grid">
                            {Object.entries(selectedDriver.photos).map(([side, name]) => (
                              <div key={side} className="admin-doc-thumbnail">
                                <Car size={20} />
                                <span className="thumb-label">{side.charAt(0).toUpperCase() + side.slice(1)} view</span>
                                <span className="thumb-filename">{name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Vehicle Documents */}
                        <div className="doc-section">
                          <h4>Compliance Documents</h4>
                          <div className="admin-docs-grid">
                            <div className="admin-doc-thumbnail doc-pdf">
                              <FileText size={20} />
                              <span className="thumb-label">Registration (RC)</span>
                              <span className="thumb-filename">{selectedDriver.docs.rc}</span>
                            </div>
                            <div className="admin-doc-thumbnail doc-pdf">
                              <FileText size={20} />
                              <span className="thumb-label">Pollution (PUC)</span>
                              <span className="thumb-filename">{selectedDriver.docs.pollution}</span>
                            </div>
                            <div className="admin-doc-thumbnail doc-pdf">
                              <FileText size={20} />
                              <span className="thumb-label">Insurance</span>
                              <span className="thumb-filename">{selectedDriver.docs.insurance}</span>
                            </div>
                            <div className="admin-doc-thumbnail doc-pdf">
                              <FileText size={20} />
                              <span className="thumb-label">Fitness Cert.</span>
                              <span className="thumb-filename">{selectedDriver.docs.fitness}</span>
                            </div>
                          </div>
                        </div>

                        {selectedDriver.status === 'Pending' && (
                          <div className="action-buttons-row">
                            <Button 
                              variant="outline" 
                              onClick={() => handleReject(selectedDriver.id)}
                              style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }}
                            >
                              <X size={16} /> Reject Applicant
                            </Button>
                            <Button 
                              variant="primary" 
                              onClick={() => handleApprove(selectedDriver.id)}
                              style={{ flex: 1 }}
                            >
                              <Check size={16} /> Approve & Activate
                            </Button>
                          </div>
                        )}
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
          )}

          {/* TAB 2: System Settings */}
          {activeTab === 'settings' && (
            <div className="tab-pane">
              <h2>Total Control Settings</h2>
              <p className="tab-subtitle">Adjust rates, manage dynamic surges, and view active global system settings.</p>

              <form onSubmit={handleSaveSettings} className="admin-settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Base Ride Fare (INR)</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      value={baseFare}
                      onChange={(e) => setBaseFare(e.target.value)} 
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Rate per Kilometer (INR)</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      value={ratePerKm}
                      onChange={(e) => setRatePerKm(e.target.value)}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Minimum Rate per Hour (INR)</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      value={minRatePerHour}
                      onChange={(e) => setMinRatePerHour(e.target.value)}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Peak Surge Multiplier</label>
                    <select 
                      className="input-field"
                      value={surgeMultiplier}
                      onChange={(e) => setSurgeMultiplier(e.target.value)}
                      style={{ appearance: 'none', WebkitAppearance: 'none' }}
                    >
                      <option value="1.0">1.0x (Standard Rates)</option>
                      <option value="1.2">1.2x (Mild Demand)</option>
                      <option value="1.5">1.5x (High Surge)</option>
                      <option value="2.0">2.0x (Peak Hours)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ maxWidth: '50%' }}>
                    <label>Global System Mode</label>
                    <select 
                      className="input-field"
                      value={systemStatus}
                      onChange={(e) => setSystemStatus(e.target.value)}
                      style={{ appearance: 'none', WebkitAppearance: 'none' }}
                    >
                      <option value="online">Online (Accepting all users)</option>
                      <option value="maintenance">Maintenance (Admins Only)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={18} color="var(--primary)" /> Payment Gateway Configurations (For Driver Dues Collection)
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Configure the gateway details drivers will see when settling their platform commission dues.
                  </p>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Gateway Type</label>
                      <select 
                        className="input-field"
                        value={gatewayType}
                        onChange={(e) => setGatewayType(e.target.value)}
                        style={{ appearance: 'none', WebkitAppearance: 'none' }}
                      >
                        <option value="upi">UPI Address / QR Code</option>
                        <option value="bank">Direct Bank Transfer</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Account Holder / Beneficiary Name</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        placeholder="e.g. HUM FLEET PLATFORMS PVT LTD"
                        required
                      />
                    </div>
                  </div>

                  {gatewayType === 'upi' ? (
                    <div className="form-row">
                      <div className="form-group">
                        <label>UPI ID (VPA)</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. humfleet@okaxis"
                          required={gatewayType === 'upi'}
                        />
                      </div>
                      <div className="form-group">
                        <label>Upload UPI QR Code (Optional Image)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="file" 
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="qr-upload-input"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (evt) => setQrCodeUrl(evt.target.result);
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <label htmlFor="qr-upload-input" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-main)' }}>
                            <Upload size={14} /> Choose Image
                          </label>
                          {qrCodeUrl && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '12px', color: 'var(--primary)' }}>✓ Uploaded</span>
                              <button type="button" onClick={() => setQrCodeUrl('')} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}>Remove</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Bank Name</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="e.g. HDFC Bank"
                            required={gatewayType === 'bank'}
                          />
                        </div>
                        <div className="form-group">
                          <label>Account Number</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            value={accountNo}
                            onChange={(e) => setAccountNo(e.target.value)}
                            placeholder="e.g. 50100234567890"
                            required={gatewayType === 'bank'}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group" style={{ maxWidth: '50%' }}>
                          <label>IFSC Code</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            value={ifscCode}
                            onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                            placeholder="e.g. HDFC0000123"
                            required={gatewayType === 'bank'}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Button variant="primary" type="submit" style={{ marginTop: '16px' }}>
                  Save System Configuration
                </Button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
