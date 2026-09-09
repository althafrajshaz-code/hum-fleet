import re

def update_driver():
    with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_rating = '''              {/* Rating Panel Screen (Shows after driver completes ride) */}
              {showRating && currentRide && (
                <div className="incoming-request animate-fade-in delay-100" style={{ background: '#ffffff', borderColor: '#e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '75vh', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', color: '#10b981' }}>
                    <CheckCircle size={28} />
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>Ride Complete!</h3>
                  </div>
                  
                  {(() => {
                    const collectCashFlag = (currentRide.paymentType === 'cash' || !currentRide.paymentType);
                    const baseTotal = parseFloat(currentRide.totalKm || 8.0);
                    const liveDist = parseFloat(liveGpsDistance || 0);
                    const finalDist = liveDist > 0 ? liveDist : baseTotal;
                    const rate = parseFloat(driverDetails?.ratePerKm || 15.00);
                    let recalculatedMinFare = finalDist * rate;
                    if (currentRide.isIntercity) recalculatedMinFare += 250;
                    const tipAmount = parseFloat(currentRide.driverTip || 0);
                    const tax = recalculatedMinFare * 0.05;
                    const total = recalculatedMinFare + tax + tipAmount;
                    
                    return (
                      <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#10b981', margin: '0 0 4px 0' }}>
                          {collectCashFlag ? 'Collect Cash' : 'Paid Online'}
                        </h2>
                        <div style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', marginBottom: '16px' }}>
                          ₹{total.toFixed(2)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', textAlign: 'left', background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Base Fare ({finalDist.toFixed(1)} KM)</span>
                            <strong>₹{recalculatedMinFare.toFixed(2)}</strong>
                          </div>
                          {tipAmount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Passenger Tip</span>
                              <strong>+₹{tipAmount.toFixed(2)}</strong>
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>GST (5%)</span>
                            <strong>+₹{tax.toFixed(2)}</strong>
                          </div>
                        </div>
                        <Button variant="outline" className="full-width" onClick={handleDownloadInvoice} style={{ marginTop: '16px', borderColor: '#3b82f6', color: '#3b82f6' }}>
                          Download Invoice
                        </Button>
                      </div>
                    );
                  })()}
                  
                  <div style={{ padding: '14px', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.03)', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '800', margin: 0 }}>Rate passenger's behaviour</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                      How was your passenger **{currentRide.passengerName || 'Passenger'}**?
                    </p>

                    <div style={{ display: 'flex', gap: '8px', margin: '6px 0' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingValue(star)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                        >
                          <span style={{ fontSize: '28px', color: star <= ratingValue ? '#f59e0b' : 'var(--border)' }}>★</span>
                        </button>
                      ))}
                    </div>

                    <div className="input-group" style={{ width: '100%', margin: 0 }}>
                      <textarea
                        className="input-field"
                        placeholder="Comments on passenger behaviour (optional)..."
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        rows="2"
                        style={{ width: '100%', resize: 'none', padding: '8px', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  <Button variant="primary" className="full-width" onClick={handleSubmitRating}>
                    Submit Rating & Finish
                  </Button>
                </div>
              )}'''
    
    pattern = re.compile(r'\{\/\*\s*Rating Panel Screen.*?Submit Rating\s*<\/Button>\s*<\/div>\s*\)\}', re.DOTALL)
    if pattern.search(content):
        content = pattern.sub(new_rating, content)
        with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Driver Dashboard updated.")
    else:
        print("Driver Rating pattern not found!")

update_driver()
