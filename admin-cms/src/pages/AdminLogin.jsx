import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';
import './Auth.css';

const API_BASE = (typeof window !== 'undefined' && window.location.hostname.includes('loca.lt'))
  ? 'https://hum-fleet-backend.loca.lt'
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? 'http://localhost:5000'
    : (import.meta.env.VITE_BACKEND_URL || 'http://187.127.165.79:5000');

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        localStorage.setItem('adminAuthenticated', 'true');
        navigate('/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid admin credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to operations authentication server.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card animate-fade-in">
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
            <Shield size={28} />
          </div>
          <h2>HUM Fleet Admin</h2>
          <p>Secure Operations Portal Access</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            borderRadius: '8px', 
            padding: '12px', 
            color: '#ef4444', 
            fontSize: '14px', 
            textAlign: 'center' 
          }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Admin Username</label>
            <input 
              type="text" 
              id="username" 
              className="input-field" 
              placeholder="Enter admin username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Security Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                className="input-field" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '40px' }}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button variant="primary" type="submit" className="full-width" style={{ marginTop: '8px' }}>
            <Lock size={16} /> Authenticate Portal
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
