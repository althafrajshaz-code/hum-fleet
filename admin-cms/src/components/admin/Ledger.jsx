import React from 'react';
import { Search, FileText, TrendingUp } from 'lucide-react';
import Button from '../Button';

const Ledger = ({
  ledgerFilter,
  setLedgerFilter,
  ledgerSearch,
  setLedgerSearch,
  filteredLedgerDrivers,
  downloadDailyLedgerCSV,
  downloadLedgerCSV,
  handleOpenCollectCashModal,
  downloadReportCSV
}) => {
  return (
    <div className="tab-pane">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>{ledgerFilter === 'pending' ? 'Pending Collection Report' : ledgerFilter === 'no-pending' ? 'Settled Collection Report' : 'Master Collection Report'}</h2>
          <p className="tab-subtitle">
            {ledgerFilter === 'pending' 
              ? 'Showing outstanding commission and GST platform dues currently owed by partners.' 
              : ledgerFilter === 'no-pending' 
                ? 'Showing partners with zero platform dues and completed settlements.' 
                : 'Monitor cash collections, contact profiles, and outstanding balances due to the platform.'}
          </p>
        </div>
        
        {/* Search & Dynamic Status Filters */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search ledger by vehicle number, name..." 
              value={ledgerSearch}
              onChange={(e) => setLedgerSearch(e.target.value)}
              style={{ padding: '8px 12px 8px 34px', width: '220px', fontSize: '13px' }}
            />
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Pending & Non-Pending Amount Filter dropdown */}
          <select 
            className="input-field" 
            value={ledgerFilter} 
            onChange={(e) => setLedgerFilter(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              width: '200px', 
              fontSize: '13px', 
              fontWeight: '600',
              display: 'block',
              color: '#ffffff',
              background: '#1a2035',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <option value="all" style={{ background: '#1a2035', color: '#ffffff' }}>Show All Balances</option>
            <option value="pending" style={{ background: '#1a2035', color: '#ef4444' }}>With Pending Due (&gt; ₹0)</option>
            <option value="no-pending" style={{ background: '#1a2035', color: '#10b981' }}>No Pending Due (₹0)</option>
          </select>
          
          <Button 
            variant="outline" 
            onClick={downloadDailyLedgerCSV}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '38px', borderColor: '#10b981', color: '#10b981' }}
          >
            <FileText size={16} /> Download Daily Ledger (CSV)
          </Button>
          
          <Button 
            variant="primary" 
            onClick={downloadLedgerCSV}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '38px' }}
          >
            <TrendingUp size={16} /> Export to Excel (CSV)
          </Button>
        </div>
      </div>

      {filteredLedgerDrivers.length === 0 ? (
        <p className="empty-state">No matching driver ledger accounts found.</p>
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflowX: 'auto', background: 'rgba(255,255,255,0.01)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px', fontWeight: '700' }}>Partner Name</th>
                <th style={{ padding: '16px', fontWeight: '700' }}>Contact Number</th>
                <th style={{ padding: '16px', fontWeight: '700' }}>Vehicle & Plate</th>
                <th style={{ padding: '16px', fontWeight: '700' }}>Cash Collected</th>
                <th style={{ padding: '16px', fontWeight: '700' }}>Pending Amount (Due)</th>
                <th style={{ padding: '16px', fontWeight: '700' }}>Non-Pending (Settled)</th>
                <th style={{ padding: '16px', fontWeight: '700', textAlign: 'center' }}>Balance Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLedgerDrivers.map((d) => (
                <tr key={d.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
                  <td style={{ padding: '16px', fontWeight: '600' }}>{d.name}</td>
                  <td style={{ padding: '16px', color: 'var(--text-main)', fontWeight: '500' }}>{d.phone}</td>
                  <td style={{ padding: '16px', color: 'var(--text-main)' }}>
                    {d.manufacturer} {d.model} (<span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '600' }}>{d.plate}</span>)
                  </td>
                  <td style={{ padding: '16px', fontWeight: '600', color: 'var(--primary)' }}>₹{parseFloat(d.wallet?.cashCollected || 0).toFixed(2)}</td>
                  <td style={{ padding: '16px', fontWeight: '700', color: '#ef4444' }}>-₹{parseFloat(d.wallet?.toBePaid || 0).toFixed(2)}</td>
                  <td style={{ padding: '16px', fontWeight: '700', color: 'var(--primary)' }}>
                    ₹{parseFloat((d.wallet?.cashCollected || 0) - (d.wallet?.toBePaid || 0)).toFixed(2)}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      {parseFloat(d.wallet?.toBePaid || 0) > 1500 ? (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                          border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px',
                          padding: '2px 10px', fontSize: '10px', fontWeight: '800'
                        }}>
                          🔒 Cash Locked
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          background: 'rgba(16,185,129,0.1)', color: '#10b981',
                          border: '1px solid rgba(16,185,129,0.25)', borderRadius: '20px',
                          padding: '2px 10px', fontSize: '10px', fontWeight: '700'
                        }}>
                          ✓ Cash Active
                        </span>
                      )}
                      {parseFloat(d.wallet?.toBePaid || 0) > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => handleOpenCollectCashModal(d)}
                          style={{ borderColor: '#10b981', color: '#10b981', padding: '4px 10px', fontSize: '11px', fontWeight: '700' }}
                        >
                          ✅ Payment Received
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderTop: '2px solid var(--border)', fontWeight: 'bold' }}>
                <td style={{ padding: '16px' }}>Grand Total</td>
                <td style={{ padding: '16px' }}>-</td>
                <td style={{ padding: '16px' }}>-</td>
                <td style={{ padding: '16px', color: 'var(--primary)', fontWeight: '800' }}>
                  ₹{filteredLedgerDrivers.reduce((sum, d) => sum + (d.wallet?.cashCollected || 0), 0).toFixed(2)}
                </td>
                <td style={{ padding: '16px', color: '#ef4444', fontWeight: '800' }}>
                  -₹{filteredLedgerDrivers.reduce((sum, d) => sum + (d.wallet?.toBePaid || 0), 0).toFixed(2)}
                </td>
                <td style={{ padding: '16px', color: 'var(--primary)', fontWeight: '800' }}>
                  ₹{filteredLedgerDrivers.reduce((sum, d) => sum + ((d.wallet?.cashCollected || 0) - (d.wallet?.toBePaid || 0)), 0).toFixed(2)}
                </td>
                <td style={{ padding: '16px', textAlign: 'center', color: '#ef4444', fontWeight: '800' }}>
                  {filteredLedgerDrivers.filter(d => parseFloat(d.wallet?.toBePaid || 0) > 1500).length} Locked Partners
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Transactional Reports Download Section */}
      <div style={{ marginTop: '24px', padding: '20px', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.01)' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800' }}>System Operational Reports</h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
          Download audit spreadsheets of completed trips and revenue splits over custom time windows.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" onClick={() => downloadReportCSV('daily')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={15} /> Download Daily Report
          </Button>
          <Button variant="outline" onClick={() => downloadReportCSV('weekly')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={15} /> Download Weekly Report
          </Button>
          <Button variant="outline" onClick={() => downloadReportCSV('monthly')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={15} /> Download Monthly Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Ledger;
