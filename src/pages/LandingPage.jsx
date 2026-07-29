import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, MapPin, Clock } from 'lucide-react';
import Button from '../components/Button';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-bg"></div>
        <div className="container hero-content">
          <h1 className="hero-title animate-fade-in">
            Move with <span className="text-gradient">Freedom</span>.<br />
            Earn with <span className="text-gradient">Pride</span>.
          </h1>
          <p className="hero-subtitle animate-fade-in delay-100">
            HUM Fleet is the premium mobility platform designed to bring you reliable rides and rewarding driving experiences.
          </p>
          <div className="hero-actions animate-fade-in delay-200" style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', width: '100%' }}>
              
              {/* Passenger Card */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)' }}>Passenger Portal</span>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 8px 0' }}>Request a ride, track dynamic matches, and pay securely.</p>
                <Button variant="primary" size="large" onClick={() => navigate('/passenger/login')} style={{ width: '100%', justifyContent: 'center' }}>
                  Log In <ArrowRight size={18} />
                </Button>
                <button onClick={() => navigate('/passenger/signup')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', marginTop: '6px' }}>
                  Create Account
                </button>
              </div>
              
              {/* Driver Card */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--secondary)' }}>Driver Partner</span>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 8px 0' }}>Drive on your schedule, set custom rates, and track earnings.</p>
                <Button variant="outline" size="large" onClick={() => navigate('/driver/login')} style={{ width: '100%', justifyContent: 'center' }}>
                  Log In <ArrowRight size={18} />
                </Button>
                <button onClick={() => navigate('/driver/signup')} style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontWeight: '700', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', marginTop: '6px' }}>
                  Apply to Drive
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      
      <div className="features-section container">
        <div className="feature-card glass-card animate-fade-in delay-100">
          <div className="feature-icon"><MapPin size={24} /></div>
          <h3>Anywhere, Anytime</h3>
          <p>Get a ride in minutes, track your driver in real-time, and arrive safely.</p>
        </div>
        <div className="feature-card glass-card animate-fade-in delay-200">
          <div className="feature-icon"><ShieldCheck size={24} /></div>
          <h3>Safety First</h3>
          <p>All rides are tracked, and our drivers are background-checked for your peace of mind.</p>
        </div>
        <div className="feature-card glass-card animate-fade-in delay-300">
          <div className="feature-icon"><Clock size={24} /></div>
          <h3>Flexible Earnings</h3>
          <p>Drive on your own schedule and earn competitive rates with daily payouts.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
