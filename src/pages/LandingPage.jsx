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
          <div className="hero-actions animate-fade-in delay-200">
            <Button variant="primary" size="large" onClick={() => navigate('/passenger/login')}>
              Book a Ride <ArrowRight size={20} />
            </Button>
            <Button variant="outline" size="large" onClick={() => navigate('/driver/login')}>
              Become a Driver <ArrowRight size={20} />
            </Button>
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
