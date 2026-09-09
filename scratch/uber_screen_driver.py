import sys, re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'<div className="request-details">\s*<div className="req-row"><Navigation size=\{16\}/>.*?<span>INR \{\(parseFloat\(currentRide\.fare\).*?</div>\s*</div>', re.DOTALL)

newBlock = '''{/* UBER STYLE PASSENGER INFO CARD */}
                      <div style={{ width: '100%', background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '16px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--bg-main)', padding: '2px', overflow: 'hidden', border: '2px solid #3b82f6' }}>
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentRide.passengerName || 'Passenger')}&background=3b82f6&color=fff`} alt="Passenger Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                          </div>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>{currentRide.passengerName || 'Customer'}</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Star size={14} color="#f59e0b" fill="#f59e0b" /> {currentRide.passengerRating || '5.0'}
                            </div>
                          </div>
                          <Button variant="outline" style={{ borderRadius: '50%', width: '42px', height: '42px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: '#3b82f6', color: '#3b82f6' }} onClick={() => setShowDriverTripChat(true)}>
                            <MessageSquare size={18} />
                          </Button>
                          <Button variant="outline" style={{ borderRadius: '50%', width: '42px', height: '42px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: '#10b981', color: '#10b981' }} onClick={() => alert(`Calling passenger at ${currentRide.passengerPhone || '+91 XXXX'}...`)}>
                            <Phone size={18} />
                          </Button>
                        </div>
                        
                        <div style={{ height: '1px', background: 'rgba(59,130,246,0.15)', margin: '4px 0' }}></div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <Navigation size={16} color="#3b82f6" style={{ marginTop: '2px' }} />
                            <div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '2px' }}>DROP-OFF</div>
                              <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{['Accepted', 'Arrived'].includes(currentRide.status) ? <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Hidden until PIN Verified</span> : currentRide.dropoff}</div>
                            </div>
                          </div>
                        </div>

                        <div style={{ borderTop: '1px dashed rgba(59, 130, 246, 0.2)', marginTop: '4px', paddingTop: '12px', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>TRIP FARE:</span>
                          <span style={{ fontSize: '18px', fontWeight: '900', color: '#10b981' }}>₹{(parseFloat(currentRide.fare) + parseFloat(currentRide.driverTip || 0)).toFixed(2)}</span>
                        </div>
                      </div>'''

if pattern.search(text):
    text = pattern.sub(newBlock, text)
    if 'Star,' not in text:
        text = text.replace('MessageSquare,', 'MessageSquare, Star,')
    with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print('SUCCESS')
else:
    print('NOT FOUND')
