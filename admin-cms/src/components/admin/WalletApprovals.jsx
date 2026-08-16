import React, { useState, useEffect } from 'react';
import { Check, X, CreditCard } from 'lucide-react';
import Button from '../Button';

const WalletApprovals = ({ API_BASE }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/wallet/requests`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching wallet requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id) => {
    try {
      await fetch(`${API_BASE}/api/admin/wallet/approve/${id}`, { method: 'POST' });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await fetch(`${API_BASE}/api/admin/wallet/reject/${id}`, { method: 'POST' });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'Pending');

  return (
    <div className="tab-pane">
      <h2>Wallet Top-Up Approvals</h2>
      <p className="tab-subtitle">Review passenger payment receipts and credit their digital wallets.</p>

      {loading ? (
        <p>Loading...</p>
      ) : pendingRequests.length === 0 ? (
        <p className="empty-state">No pending top-up requests.</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Passenger Email</th>
                <th>Amount</th>
                <th>Receipt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map(req => (
                <tr key={req.id}>
                  <td>{new Date(req.createdAt).toLocaleString()}</td>
                  <td>{req.email}</td>
                  <td style={{ fontWeight: 'bold', color: '#10b981' }}>₹{req.amount}</td>
                  <td>
                    {req.screenshot ? (
                      <button 
                        onClick={() => setSelectedScreenshot(req.screenshot)}
                        style={{ padding: '4px 8px', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        View Receipt
                      </button>
                    ) : (
                      'No image'
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="success" icon={<Check size={14}/>} onClick={() => handleApprove(req.id)}>Approve</Button>
                      <Button variant="danger" icon={<X size={14}/>} onClick={() => handleReject(req.id)}>Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedScreenshot && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', maxWidth: '90%', maxHeight: '90%', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3>Payment Receipt</h3>
              <button onClick={() => setSelectedScreenshot(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
            </div>
            <img src={selectedScreenshot} alt="Receipt" style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletApprovals;
