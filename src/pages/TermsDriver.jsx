import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

const Section = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: "16px", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "none", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: "var(--text-main)", fontWeight: "800", fontSize: "14px", textAlign: "left" }}
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div style={{ padding: "14px 18px", lineHeight: "1.8", color: "var(--text-muted)", fontSize: "13.5px" }}>
          {children}
        </div>
      )}
    </div>
  );
};

const TermsDriver = () => {
  const navigate = useNavigate();
  const effectiveDate = "05 September 2025";
  return (
    <div style={{ padding: "24px", maxWidth: "860px", margin: "0 auto", color: "var(--text-main)", minHeight: "100vh" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", background: "transparent", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", color: "var(--text-main)", fontWeight: "600" }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass-card animate-fade-in" style={{ padding: "32px 28px" }}>
        <h1 style={{ marginBottom: "6px", color: "var(--primary)", fontWeight: "900", fontSize: "24px" }}>
          HUM Fleet — Driver / Partner Terms & Conditions
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px" }}>Effective Date: {effectiveDate}</p>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px", lineHeight: "1.7" }}>
          This Agreement constitutes a legally binding contract between <strong>HUM Fleet</strong> ("Platform", "We", "Company") and you ("Driver", "Partner") under the <strong>Indian Contract Act, 1872</strong>. By registering on this platform, you unconditionally accept all clauses herein.
        </p>

        <Section title="1. Eligibility & Registration Requirements">
          <p>To be eligible as a HUM Fleet Partner Driver, you must:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Be at least <strong>18 years of age</strong> and a citizen or lawful resident of India.</li>
            <li>Hold a valid, active Commercial Driving Licence (CDL) issued under the <strong>Motor Vehicles Act, 1988</strong>.</li>
            <li>Possess a valid Vehicle Registration Certificate (RC) and active motor insurance.</li>
            <li>Pass our identity verification process including a valid government-issued photo ID (Aadhaar / PAN / Voter ID).</li>
            <li>Submit to a background check. Providing false, misleading, or forged documents will result in permanent deactivation and may attract criminal prosecution under the <strong>Indian Penal Code (IPC)</strong>.</li>
            <li>Consent to mandatory daily facial verification before going online each operational day.</li>
          </ul>
        </Section>

        <Section title="2. Nature of Relationship — Independent Contractor">
          <p>
            You are engaged as an <strong>independent contractor</strong> and not as an employee, agent, or partner of HUM Fleet. Nothing in this Agreement creates an employer-employee relationship. You retain full discretion over your working hours and routes. HUM Fleet does not guarantee any minimum number of rides or earnings. You are solely responsible for:
          </p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Payment of all applicable income taxes, professional taxes, and any other levies under Indian law.</li>
            <li>Compliance with all applicable central and state transport regulations.</li>
            <li>Maintaining valid vehicle fitness certificates, PUC certificates, and insurance at all times.</li>
          </ul>
        </Section>

        <Section title="3. Platform Commission & Dues">
          <p>HUM Fleet charges a <strong>5% platform commission</strong> on the total collected fare of every completed trip, plus a flat <strong>Rs.5.00 per-trip access fee</strong>. This is tracked in your in-app wallet as "Platform Dues".</p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>If total outstanding dues reach or exceed <strong>Rs.750.00</strong>, your ability to accept new cash trips will be suspended until dues are cleared.</li>
            <li>Dues must be cleared by contacting HUM Fleet Administration via the designated channel in the app.</li>
            <li>HUM Fleet reserves the right to revise commission rates with <strong>14 days prior notice</strong>.</li>
            <li>No GST is charged to drivers on platform commission at this time.</li>
          </ul>
        </Section>

        <Section title="4. Vehicle Standards & Safety">
          <p>Your vehicle must at all times:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Be roadworthy, clean, and in good mechanical condition.</li>
            <li>Meet emission norms prescribed under the <strong>Central Motor Vehicles Rules, 1989</strong>.</li>
            <li>Have valid third-party or comprehensive motor insurance.</li>
            <li>Match the vehicle category registered on your account.</li>
          </ul>
          <p style={{ marginTop: "10px" }}>HUM Fleet reserves the right to suspend your account if vehicle standards are not maintained.</p>
        </Section>

        <Section title="5. Professional Conduct & Obligations">
          <p>As a HUM Fleet Partner, you agree to:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Drive safely and follow all traffic laws under the <strong>Motor Vehicles Act, 1988</strong>.</li>
            <li>Never drive under the influence of alcohol, drugs, or any impairing substance.</li>
            <li>Treat all passengers with courtesy and professionalism.</li>
            <li>Not discriminate against passengers on any basis under the <strong>Constitution of India</strong>.</li>
            <li>Not share account credentials or allow another person to drive under your account.</li>
            <li>Adhere to a maximum driving shift of <strong>15 hours/day</strong> and a mandatory <strong>6-hour rest period</strong> thereafter, as enforced by the platform.</li>
            <li>Accept that excessive ride refusals or verified misconduct will lead to suspension or permanent deactivation.</li>
          </ul>
        </Section>

        <Section title="6. Earnings & Payouts">
          <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li><strong>Direct-to-Driver Payments:</strong> You collect the full trip fare directly from the passenger at the end of each ride.</li>
            <li>HUM Fleet does not hold passenger payments or process payouts to drivers for regular rides.</li>
            <li>Passengers may pay you via <strong>Cash</strong> or directly via <strong>UPI</strong> to your personal account.</li>
            <li>Because you collect 100% of the fare directly, you are solely responsible for periodically clearing your accumulated "Platform Dues" (commission) with HUM Fleet Administration to keep your account active.</li>
          </ul>
        </Section>

        <Section title="7. Data Collection & Privacy (DPDPA 2023)">
          <p>Under the <strong>Digital Personal Data Protection Act, 2023</strong> and the <strong>Information Technology Act, 2000</strong>, by registering you consent to collection and processing of:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Personal identification data (name, phone number, photo, Aadhaar/PAN).</li>
            <li>Real-time GPS location while you are active on the platform.</li>
            <li>Trip history, earnings data, and performance metrics.</li>
            <li>Daily facial verification photos (stored securely; not shared with third parties).</li>
          </ul>
          <p style={{ marginTop: "10px" }}>Your data will <strong>not be sold</strong> to third parties. It is used only for platform operations, safety, dispute resolution, and legal compliance. You may request data deletion via our Grievance Officer (see Section 11).</p>
        </Section>

        <Section title="8. Suspension & Termination">
          <p>HUM Fleet may suspend or permanently deactivate your account for:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Submitting fraudulent or forged documents.</li>
            <li>Verified harassment, misconduct, or violence against passengers.</li>
            <li>Driving under the influence of alcohol or drugs.</li>
            <li>Persistent non-payment of platform dues.</li>
            <li>Operating without a valid licence or insurance.</li>
            <li>Any conduct bringing the HUM Fleet brand into disrepute.</li>
          </ul>
          <p style={{ marginTop: "10px" }}>You may terminate this Agreement at any time by deactivating your account after clearing all outstanding dues.</p>
        </Section>

        <Section title="9. Intellectual Property">
          <p>
            The HUM Fleet name, logo, app interface, and all related trademarks are the exclusive property of HUM Fleet. You are granted a limited, non-exclusive, non-transferable licence to use the platform solely to provide transportation services. You may not reproduce, modify, or distribute any HUM Fleet content.
          </p>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>To the maximum extent permitted by Indian law, HUM Fleet total liability shall be limited to disputed commission dues within the last <strong>30 days</strong>. HUM Fleet shall not be liable for:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Loss of income due to platform downtime, ride cancellations, or passenger disputes.</li>
            <li>Accidents, injuries, or property damage during or after trips (governed by your insurance).</li>
            <li>Actions of third parties including passengers.</li>
          </ul>
        </Section>

        <Section title="11. Grievance Redressal (IT Rules 2021)">
          <p>In compliance with the <strong>IT (Intermediary Guidelines) Rules, 2021</strong>, you may contact our Grievance Officer for any complaints:</p>
          <div style={{ marginTop: "10px", padding: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "8px" }}>
            <p><strong>Grievance Officer:</strong> HUM Fleet Administration</p>
            <p><strong>Contact:</strong> Support channel available in the app</p>
            <p><strong>Response:</strong> Acknowledgement within 24 hours; Resolution within 15 working days.</p>
          </div>
        </Section>

        <Section title="12. Governing Law & Dispute Resolution">
          <p>
            This Agreement is governed by the laws of <strong>India</strong>. Disputes shall first be addressed through mutual negotiation. If unresolved within 30 days, matters shall be referred to <strong>arbitration</strong> under the <strong>Arbitration and Conciliation Act, 1996</strong>, seated in <strong>Kerala, India</strong>. The courts of Kerala shall have exclusive jurisdiction.
          </p>
        </Section>

        <Section title="13. Amendments">
          <p>
            HUM Fleet may modify these Terms at any time. Continued use after amendments constitutes acceptance. Material changes will be communicated via the app or your registered mobile number with at least <strong>7 days advance notice</strong>.
          </p>
        </Section>

        <div style={{ marginTop: "28px", padding: "16px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "10px", fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.7" }}>
          <strong style={{ color: "var(--primary)" }}>HUM Fleet</strong> — Registered Platform, India.<br />
          Effective Date: {effectiveDate}<br />
          Governed by: Indian Contract Act 1872 &middot; IT Act 2000 &middot; DPDPA 2023 &middot; Motor Vehicles Act 1988 &middot; Consumer Protection Act 2019 &middot; IT Rules 2021
        </div>
      </div>
    </div>
  );
};

export default TermsDriver;
