import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsPassenger = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-main)', minHeight: '100vh' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)' }}>
        <ArrowLeft size={16} /> Back
      </button>
      
      <div className="glass-card animate-fade-in" style={{ padding: '40px' }}>
        <h1 style={{ marginBottom: '24px', color: 'var(--primary)', fontWeight: '900', fontSize: '28px' }}>HUM Fleet Passenger Terms & Conditions</h1>
        
        <p style={{ marginBottom: '16px', lineHeight: '1.6' }}>
          Welcome to HUM Fleet. By accessing or using our application, you agree to be bound by these terms and conditions. Please read them carefully.
        </p>

        <h3 style={{ marginTop: '24px', marginBottom: '12px', fontWeight: '800' }}>1. User Account & Responsibilities</h3>
        <p style={{ marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          You must create an account to use the HUM Fleet services. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration.
        </p>

        <h3 style={{ marginTop: '24px', marginBottom: '12px', fontWeight: '800' }}>2. Booking & Fares</h3>
        <p style={{ marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          When you request a ride, you agree to pay the fare calculated by our platform. Fares are dynamic and may vary based on vehicle category, distance, and time. Pre-booking requires advance scheduling, and cancellation fees may apply if you cancel within a short timeframe before pickup.
        </p>

        <h3 style={{ marginTop: '24px', marginBottom: '12px', fontWeight: '800' }}>3. Passenger Conduct</h3>
        <p style={{ marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          Passengers are expected to treat drivers with respect and maintain a clean environment inside the vehicle. Any harassment, inappropriate behavior, or damage to the driver's vehicle will result in immediate account termination and potential legal action.
        </p>

        <h3 style={{ marginTop: '24px', marginBottom: '12px', fontWeight: '800' }}>4. Payment</h3>
        <p style={{ marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          Payments can be made via cash or digital wallet directly to the driver, or through our integrated secure payment gateway. All digital transactions are processed securely. HUM Fleet is not responsible for any disputes arising from cash payments.
        </p>

        <h3 style={{ marginTop: '24px', marginBottom: '12px', fontWeight: '800' }}>5. Liability & Safety</h3>
        <p style={{ marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          While we rigorously verify all HUM Fleet partners, the platform acts as an intermediary. We are not liable for any lost items, delays, or accidents. However, safety is our top priority, and we provide SOS features and trip tracking for your security.
        </p>

        <div style={{ marginTop: '40px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Last Updated: {new Date().toLocaleDateString('en-IN')} <br />
          If you have any questions about these terms, please contact HUM Fleet Support.
        </div>
      </div>
    </div>
  );
};

export default TermsPassenger;
