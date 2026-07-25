import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import Button from '../components/Button';
import './Auth.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      navigate('/admin');
    } else {
      setError('Invalid admin credentials. Hint: admin / admin123');
    }
  };

  return (
    <div className="auth-page" style={{ background: '#09090b', minHeight: '100vh', padding: 0 }}>
      <div className="auth-card glass-card animate-fade-in" style={{ background: 'rgba(24, 24, 27, 0.7)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#f8fafc' }}>
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
          <h2 style={{ color: '#f8fafc' }}>HUM Fleet Admin</h2>
          <p style={{ color: '#94a3b8' }}>Secure Operations Portal Access</p>
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
            <label htmlFor="username" style={{ color: '#f8fafc' }}>Admin Username</label>
            <input 
              type="text" 
              id="username" 
              className="input-field" 
              placeholder="Enter admin username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#f8fafc', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" style={{ color: '#f8fafc' }}>Security Password</label>
            <input 
              type="password" 
              id="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#f8fafc', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              required 
            />
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
