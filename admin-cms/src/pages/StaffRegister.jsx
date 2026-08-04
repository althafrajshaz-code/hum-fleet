import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, UserPlus, CheckCircle, Upload } from 'lucide-react';
import Button from '../components/Button';
import './Auth.css';

const API_BASE = 'https://server-ashen-beta.vercel.app';

const StaffRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'staff',
    position: '',
    bankDetails: { accountNo: '', ifscCode: '', bankName: '' },
    documents: { aadhaarFront: null, aadhaarBack: null, panFront: null, panBack: null, bankProof: null }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e, docName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          documents: { ...prev.documents, [docName]: reader.result }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/employee/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSuccess('Registration successful! Please wait for Admin approval.');
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Registration failed.');
        setSuccess('');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to authentication server.');
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ padding: '40px 20px', minHeight: '100vh', overflowY: 'auto' }}>
      <div className="auth-card glass-card animate-fade-in" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="auth-header">
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '14px', 
            background: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px auto',
            color: 'white',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
          }}>
            <UserPlus size={28} />
          </div>
          <h2>Staff Registration</h2>
          <p>Complete your profile to request access</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', padding: '12px', color: '#ef4444', fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', padding: '16px', color: '#10b981', fontSize: '14px', textAlign: 'center', marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={24} />
            {success}
            <Button variant="outline" onClick={() => navigate('/staff/login')} style={{ marginTop: '8px' }}>
              Go to Login
            </Button>
          </div>
        )}

        {!success && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <h3 style={{ fontSize: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '16px' }}>Basic Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="input-field" placeholder="Full name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input type="text" className="input-field" placeholder="Username" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select className="input-field" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div className="form-group">
                <label>Position</label>
                <input type="text" className="input-field" placeholder="e.g. Support Staff" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? "text" : "password"} className="input-field" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ paddingRight: '40px' }} required />
                  <button type="button" onClick={() => setShowPassword(prev => !prev)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', margin: '24px 0 16px 0' }}>Bank Account Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Bank Name</label>
                <input type="text" className="input-field" placeholder="e.g. HDFC Bank" value={formData.bankDetails.bankName} onChange={(e) => setFormData({...formData, bankDetails: {...formData.bankDetails, bankName: e.target.value}})} required />
              </div>
              <div className="form-group">
                <label>IFSC Code</label>
                <input type="text" className="input-field" placeholder="IFSC Code" value={formData.bankDetails.ifscCode} onChange={(e) => setFormData({...formData, bankDetails: {...formData.bankDetails, ifscCode: e.target.value}})} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Account Number</label>
                <input type="text" className="input-field" placeholder="Account Number" value={formData.bankDetails.accountNo} onChange={(e) => setFormData({...formData, bankDetails: {...formData.bankDetails, accountNo: e.target.value}})} required />
              </div>
            </div>

            <h3 style={{ fontSize: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', margin: '24px 0 16px 0' }}>KYC Documents</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Aadhaar Front</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="file" id="aadhaarFront" accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => handleFileChange(e, 'aadhaarFront')} required />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('aadhaarFront').click()} style={{ width: '100%', justifyContent: 'center' }}>
                    <Upload size={16} /> {formData.documents.aadhaarFront ? 'Uploaded' : 'Upload File'}
                  </Button>
                </div>
              </div>
              <div className="form-group">
                <label>Aadhaar Back</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="file" id="aadhaarBack" accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => handleFileChange(e, 'aadhaarBack')} required />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('aadhaarBack').click()} style={{ width: '100%', justifyContent: 'center' }}>
                    <Upload size={16} /> {formData.documents.aadhaarBack ? 'Uploaded' : 'Upload File'}
                  </Button>
                </div>
              </div>
              <div className="form-group">
                <label>PAN Front</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="file" id="panFront" accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => handleFileChange(e, 'panFront')} required />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('panFront').click()} style={{ width: '100%', justifyContent: 'center' }}>
                    <Upload size={16} /> {formData.documents.panFront ? 'Uploaded' : 'Upload File'}
                  </Button>
                </div>
              </div>
              <div className="form-group">
                <label>PAN Back</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="file" id="panBack" accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => handleFileChange(e, 'panBack')} required />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('panBack').click()} style={{ width: '100%', justifyContent: 'center' }}>
                    <Upload size={16} /> {formData.documents.panBack ? 'Uploaded' : 'Upload File'}
                  </Button>
                </div>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Cancelled Check / Passbook Front</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="file" id="bankProof" accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => handleFileChange(e, 'bankProof')} required />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('bankProof').click()} style={{ width: '100%', justifyContent: 'center' }}>
                    <Upload size={16} /> {formData.documents.bankProof ? 'Uploaded' : 'Upload File'}
                  </Button>
                </div>
              </div>
            </div>

            <Button variant="primary" type="submit" className="full-width" style={{ marginTop: '24px' }} disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Register Profile'}
            </Button>
            
            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>
              Already have an account? <a href="/staff/login" onClick={(e) => { e.preventDefault(); navigate('/staff/login'); }} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Login here</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StaffRegister;
