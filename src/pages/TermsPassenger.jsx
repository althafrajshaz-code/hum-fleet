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

const TermsPassenger = () => {
  const navigate = useNavigate();
  const effectiveDate = "05 September 2025";
  return (
    <div style={{ padding: "24px", maxWidth: "860px", margin: "0 auto", color: "var(--text-main)", minHeight: "100vh" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", background: "transparent", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", color: "var(--text-main)", fontWeight: "600" }}>
        <ArrowLeft size={16} /> Back
      </button>
      <div className="glass-card animate-fade-in" style={{ padding: "32px 28px" }}>
        <h1 style={{ marginBottom: "6px", color: "var(--primary)", fontWeight: "900", fontSize: "24px" }}>HUM Fleet — Passenger Terms & Conditions</h1>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px" }}>Effective Date: {effectiveDate}</p>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px", lineHeight: "1.7" }}>
          These Terms form a legally binding agreement between <strong>HUM Fleet</strong> and you (the Passenger) under the <strong>Indian Contract Act, 1872</strong>. By using the HUM Fleet app, you accept these terms in full.
        </p>

        <Section title="1. Eligibility & Account Registration">
          <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>You must be at least <strong>18 years of age</strong> to use HUM Fleet.</li>
            <li>You must provide accurate, current, and complete information — including your name and valid Indian mobile number.</li>
            <li>You are responsible for all activity on your account. Do not share your OTP or credentials.</li>
            <li>HUM Fleet reserves the right to suspend accounts with inaccurate or fraudulent information.</li>
          </ul>
        </Section>

        <Section title="2. Booking, Fares & Pricing">
          <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Fares are calculated based on vehicle category, estimated distance, and base rates set by HUM Fleet.</li>
            <li>By placing a ride request you agree to pay the displayed fare.</li>
            <li>Intercity trips over 32 KM attract an additional <strong>Rs.250.00</strong> premium, and trips over 100 KM attract a <strong>Rs.300.00</strong> premium instead.</li>
            <li>Pre-booked rides require a scheduled date and time. Cancellation of confirmed pre-booked rides may attract a cancellation fee.</li>
            <li>No GST is charged on passenger fares at this time.</li>
            <li>Fares may be revised. Updated rates are shown in the app at the time of booking.</li>
          </ul>
        </Section>

        <Section title="3. Cancellation Policy">
          <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>You may cancel a ride <strong>before a driver is assigned</strong> without any penalty.</li>
            <li>Repeated cancellations after a driver has been assigned and is en route may result in your account being flagged or temporarily suspended.</li>
            <li>Because HUM Fleet does not collect advance payments or hold digital wallets for passengers, <strong>the platform does not process refunds</strong>.</li>
            <li>Any disputes regarding payments made directly to a driver must be resolved between you and the driver.</li>
          </ul>
        </Section>

        <Section title="4. Passenger Conduct">
          <p>You agree to:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Treat HUM Fleet partner drivers with respect and dignity at all times.</li>
            <li>Not engage in verbal abuse, harassment, intimidation, or threatening behaviour towards the driver.</li>
            <li>Not cause any damage to the driver vehicle. You will be liable for all repair costs for damage caused.</li>
            <li>Not request the driver to break traffic laws or drive recklessly.</li>
            <li>Wear a seatbelt as required under the <strong>Motor Vehicles Act, 1988</strong>.</li>
            <li>Accept that verified misconduct may result in immediate account termination and legal action.</li>
          </ul>
        </Section>

        <Section title="5. Payment & Fares">
          <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li><strong>All payments are Direct-to-Driver:</strong> HUM Fleet does not process passenger payments. You must pay the driver directly at the end of the trip.</li>
            <li>You may pay via <strong>Cash</strong> or through a <strong>direct UPI transfer</strong> to the driver's personal QR code/number.</li>
            <li>You are responsible for ensuring you pay the exact fare shown on the app at the conclusion of the trip.</li>
            <li>HUM Fleet acts solely as a technology aggregator and is not responsible for settling any payment disputes, shortfalls, or overcharges between you and the driver.</li>
          </ul>
        </Section>

        <Section title="6. Liability & Safety">
          <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>HUM Fleet acts as an <strong>aggregator / intermediary</strong> connecting passengers with independent drivers. We are not a transport company.</li>
            <li>All driver-partners are verified and background-checked. However, HUM Fleet is not liable for accidents, injuries, property loss, or delays during a trip.</li>
            <li>HUM Fleet provides an <strong>SOS emergency feature</strong> and <strong>live trip tracking</strong> for your safety.</li>
            <li>HUM Fleet is not responsible for items lost or forgotten in a vehicle.</li>
            <li>In emergency: Police: 100, Ambulance: 108. Also use the in-app SOS button.</li>
          </ul>
        </Section>

        <Section title="7. Data Collection & Privacy (DPDPA 2023)">
          <p>Under the <strong>Digital Personal Data Protection Act, 2023</strong> and the <strong>Information Technology Act, 2000</strong>, by registering you consent to collection of:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Name, mobile number, and profile picture (if uploaded).</li>
            <li>Pickup and drop-off location data for ride processing.</li>
            <li>Trip history and payment transaction records.</li>
            <li>Device and usage data for app performance improvement.</li>
          </ul>
          <p style={{ marginTop: "10px" }}>Your data will <strong>not be sold</strong> to any third party. You may request data deletion by contacting our Grievance Officer.</p>
        </Section>

        <Section title="8. Prohibited Uses">
          <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Transportation of illegal goods or substances under any Indian law.</li>
            <li>Any activity that violates local, state, or central laws of India.</li>
            <li>Creating multiple accounts for fraudulent purposes or platform manipulation.</li>
            <li>Impersonating any person or providing false identity information.</li>
          </ul>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>HUM Fleet total liability shall not exceed the fare paid for the disputed trip. HUM Fleet shall not be liable for:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Indirect, incidental, or consequential losses.</li>
            <li>Service interruptions due to technical issues, network failures, or force majeure events.</li>
            <li>Misconduct or negligence of independent driver-partners.</li>
          </ul>
        </Section>

        <Section title="10. Grievance Redressal (Consumer Protection Act 2019 / IT Rules 2021)">
          <p>In compliance with the <strong>Consumer Protection Act, 2019</strong> and <strong>IT Rules, 2021</strong>:</p>
          <div style={{ marginTop: "10px", padding: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "8px" }}>
            <p><strong>Grievance Officer:</strong> HUM Fleet Support</p>
            <p><strong>Contact:</strong> Support channel available in the app</p>
            <p><strong>Response:</strong> Acknowledgement within 24 hours; Resolution within 15 working days.</p>
          </div>
        </Section>

        <Section title="11. Governing Law & Dispute Resolution">
          <p>
            This Agreement is governed by the laws of <strong>India</strong>. Disputes shall first be resolved through mutual negotiation. If unresolved within 30 days, the matter shall be referred to <strong>arbitration</strong> under the <strong>Arbitration and Conciliation Act, 1996</strong>, seated in <strong>Kerala, India</strong>. The courts of Kerala shall have exclusive jurisdiction.
          </p>
        </Section>

        <Section title="12. Amendments">
          <p>HUM Fleet may update these Terms at any time. Continued use of the app constitutes acceptance. Material changes will be communicated with at least <strong>7 days notice</strong> via the app or your registered mobile number.</p>
        </Section>

        <div style={{ marginTop: "28px", padding: "16px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "10px", fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.7" }}>
          <strong style={{ color: "var(--primary)" }}>HUM Fleet</strong> — Registered Platform, India.<br />
          Effective Date: {effectiveDate}<br />
          Governed by: Indian Contract Act 1872 · IT Act 2000 · DPDPA 2023 · Consumer Protection Act 2019 · Payment & Settlement Systems Act 2007 · IT Rules 2021
        </div>
      </div>
    </div>
  );
};

export default TermsPassenger;
