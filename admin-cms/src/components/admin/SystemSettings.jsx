import React from 'react';
import { MapPin, Phone, CreditCard, Upload } from 'lucide-react';
import Button from '../Button';

const SystemSettings = ({
  baseFare, setBaseFare,
  ratePerKm, setRatePerKm,
  minRatePerHour, setMinRatePerHour,
  surgeMultiplier, setSurgeMultiplier,
  systemStatus, setSystemStatus,
  voipMasking, setVoipMasking,
  gatewayType, setGatewayType,
  accountHolder, setAccountHolder,
  upiId, setUpiId,
  qrCodeUrl, setQrCodeUrl,
  bankName, setBankName,
  accountNo, setAccountNo,
  ifscCode, setIfscCode,
  handleSaveSettings,
  categories,
  catName, setCatName,
  catPassengers, setCatPassengers,
  catBaseFare, setCatBaseFare,
  catRatePerKm, setCatRatePerKm,
  editingCategory,
  handleStartEdit,
  handleCancelEdit,
  handleDeleteCategory,
  handleAddCategory
}) => {
  return (
    <div className="tab-pane" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h2>Total Control Settings</h2>
        <p className="tab-subtitle">Adjust rates, manage dynamic surges, and view active global system settings.</p>

        <form onSubmit={handleSaveSettings} className="admin-settings-form">
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
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
              <label>Driver Min Rate/KM (INR)</label>
              <input 
                type="number" 
                className="input-field" 
                value={ratePerKm}
                onChange={(e) => setRatePerKm(e.target.value)}
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Driver Min Rate/Hour (INR)</label>
              <input 
                type="number" 
                className="input-field" 
                value={minRatePerHour}
                onChange={(e) => setMinRatePerHour(e.target.value)}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
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
            <div className="form-group">
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

          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#f59e0b" /> Dynamic Surge Geofencing Zones
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Define specific zones that will override the global surge multiplier during high-demand events (e.g. Airports, Stadiums).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', background: 'rgba(245,158,11,0.05)', padding: '16px', borderRadius: '12px', border: '1px dashed #f59e0b' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>Active Zones</label>
                <div style={{ background: 'var(--bg-card)', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                    <span>Kochi International Airport</span>
                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>2.0x</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span>Jawaharlal Nehru Stadium</span>
                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>1.5x</span>
                  </div>
                </div>
                <button type="button" style={{ width: '100%', marginTop: '12px', background: 'transparent', border: '1px solid #f59e0b', color: '#f59e0b', padding: '6px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>+ Add New Zone</button>
              </div>
              <div style={{ background: '#121624', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px', minHeight: '120px' }}>
                [Interactive Map Placeholder for Drawing Geo-Fences]
              </div>
            </div>
          </div>

          {/* NUMBER MASKING (VOIP) SETTINGS */}
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={18} color="#3b82f6" /> Number Masking (VoIP) Privacy
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Enforce number masking to protect passenger and driver privacy. When enabled, all calls route through the HUM PBX system.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(59, 130, 246, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                  <input 
                    type="checkbox" 
                    checked={voipMasking} 
                    onChange={(e) => setVoipMasking(e.target.checked)} 
                    style={{ width: '18px', height: '18px', accentColor: '#3b82f6', cursor: 'pointer' }}
                  />
                  Enable Global Call Masking
                </label>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Status: <span style={{ color: voipMasking ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{voipMasking ? 'ACTIVE (Calls Routed via PBX)' : 'INACTIVE (Direct Dialing)'}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={18} color="var(--primary)" /> Payment Gateway Configurations (For Driver Dues Collection)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Configure the gateway details drivers will see when settling their platform commission dues.
            </p>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
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
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="admin-qr-upload-input"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => setQrCodeUrl(evt.target.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label htmlFor="admin-qr-upload-input" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-main)' }}>
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
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
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
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                  <div className="form-group">
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

      {/* Dynamic Vehicle Categories Manager Card */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
        <h2>Vehicle Categories Manager</h2>
        <p className="tab-subtitle">Configure available vehicle classes, max passenger seats, and separate pricing rates dynamically.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px', marginTop: '16px' }}>
          {/* Category Table */}
          <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflowX: 'auto', background: 'rgba(255,255,255,0.01)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '700' }}>Class Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: '700' }}>Max Passengers</th>
                  <th style={{ padding: '12px 16px', fontWeight: '700' }}>Base Fare</th>
                  <th style={{ padding: '12px 16px', fontWeight: '700' }}>Rate/KM</th>
                  <th style={{ padding: '12px 16px', fontWeight: '700', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(categories) ? categories : []).map((cat) => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{cat.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>{cat.maxPassengers} Passengers</td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--primary)' }}>₹{parseFloat(cat.baseFare).toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--primary)' }}>₹{parseFloat(cat.ratePerKm).toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleStartEdit(cat)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px', fontWeight: '700', marginRight: '10px' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id || cat._id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}
                        disabled={(Array.isArray(categories) ? categories : []).length <= 1} // Retain at least 1 category!
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add/Edit Class Form */}
          <form onSubmit={handleAddCategory} className="admin-settings-form" style={{ margin: 0, padding: '20px', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.01)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800' }}>
              {editingCategory ? 'Edit Vehicle Class' : 'Add Vehicle Class'}
            </h3>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Category Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. HUM SUV"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Max Passengers</label>
              <input 
                type="number" 
                className="input-field" 
                min="1"
                max="20"
                value={catPassengers}
                onChange={(e) => setCatPassengers(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="form-group" style={{ flex: 1, margin: 0 }}>
                <label>Base Fare (₹)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  min="0"
                  value={catBaseFare}
                  onChange={(e) => setCatBaseFare(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1, margin: 0 }}>
                <label>Rate / KM (₹)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  min="0"
                  value={catRatePerKm}
                  onChange={(e) => setCatRatePerKm(e.target.value)}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button variant="primary" type="submit" style={{ width: '100%' }}>
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </Button>
              {editingCategory && (
                <Button 
                  variant="outline" 
                  type="button" 
                  style={{ width: '100%', borderColor: '#ef4444', color: '#ef4444' }}
                  onClick={handleCancelEdit}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
