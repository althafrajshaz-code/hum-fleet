import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsDriver = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-main)', minHeight: '100vh' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)' }}>
        <ArrowLeft size={16} /> Back
      </button>
      
      <div className="glass-card animate-fade-in" style={{ padding: '40px' }}>
        <h1 style={{ marginBottom: '24px', color: 'var(--primary)', fontWeight: '900', fontSize: '28px' }}>HUM Fleet Partner Terms & Conditions</h1>
        
        <p style={{ marginBottom: '16px', lineHeight: '1.6' }}>
          Welcome to the HUM Fleet Partner Program. By registering as a driver, you agree to comply with and be bound by the following terms and conditions.
        </p>

        <h3 style={{ marginTop: '24px', marginBottom: '12px', fontWeight: '800' }}>1. Partner Registration & Compliance</h3>
        <p style={{ marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          To become a HUM Fleet partner, you must provide valid government-issued identification, a valid driver's license, vehicle registration, and proof of insurance. All documents must be kept up to date. You consent to background checks and routine daily facial verification.
        </p>

        <h3 style={{ marginTop: '24px', marginBottom: '12px', fontWeight: '800' }}>2. Vehicle Standards</h3>
        <p style={{ marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          Your vehicle must meet local regulatory standards and HUM Fleet's premium category requirements. The vehicle must be clean, well-maintained, and safe for passengers at all times. Failure to maintain vehicle quality may result in account suspension.
        </p>

        <h3 style={{ marginTop: '24px', marginBottom: '12px', fontWeight: '800' }}>3. Commissions & Platform Dues</h3>
        <p style={{ marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          HUM Fleet charges a 5% commission plus applicable GST (5%) on every completed ride. Your pending dues are tracked in the wallet. If your outstanding balance exceeds the ₹1,500 limit, you will only be able to accept prepaid (digital) trips until the balance is cleared via the payment gateway.
        </p>

        <h3 style={{ marginTop: '24px', marginBottom: '12px', fontWeight: '800' }}>4. Professional Conduct</h3>
        <p style={{ marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          As a partner, you are an independent contractor representing HUM Fleet. You must maintain professional decorum, drive safely, follow traffic laws, and provide excellent customer service. Refusing rides excessively or discriminating against passengers will lead to immediate deactivation.
        </p>

        <h3 style={{ marginTop: '24px', marginBottom: '12px', fontWeight: '800' }}>5. Payouts & Earnings</h3>
        <p style={{ marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          Earnings for prepaid digital rides will be transferred to your registered bank account according to our payout schedule. You are responsible for providing correct bank details (Account Number, IFSC, etc.). HUM Fleet is not responsible for payout delays caused by incorrect banking information.
        </p>

        <div style={{ marginTop: '40px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Last Updated: {new Date().toLocaleDateString('en-IN')} <br />
          If you have any questions about these terms, please contact HUM Fleet Administration.
        </div>
      </div>
    </div>
  );
};

export default TermsDriver;
