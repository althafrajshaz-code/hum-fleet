import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

missing_block = """              {/* 2. GO ONLINE BUTTON (POSITIONED DIRECTLY DOWN / UNDER THE PROFILE) */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {isOnline && !currentRide && (
                  <Button 
                    variant={isPaused ? 'primary' : 'outline'} 
                    onClick={() => togglePauseBreak(!isPaused)}
                    style={{
                      flex: 1,
                      borderColor: isPaused ? '#f59e0b' : 'var(--border)',
                      background: isPaused ? '#f59e0b' : 'transparent',
                      color: isPaused ? '#000' : 'var(--text-main)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', padding: '12px'
                    }}
                  >
                    {isPaused ? <Play size={16} /> : <Coffee size={16} color="#f59e0b" />}
                    {isPaused ? 'Resume Trips' : 'Take Rest Break'}
                  </Button>
                )}
  
                <Button 
                  variant={isOnline ? 'outline' : 'primary'} 
                  className={isOnline ? 'status-online' : ''}
                  onClick={async () => {
                    if (isOnline) {
                      // Go offline - sync status to backend
                      goOffline();
                      return;
                    }
                    // Going online - check daily verification first
                    if (!isDailyVerified) {
                      setShowVerifyModal(true);
                      setVerifyStep('camera');
                      setCapturedPhoto(null);
                      // Start camera after modal state renders
                      setTimeout(() => startCamera(), 200);
                    } else {
                      goOnline();
                    }
                  }}
                  style={{
                    flex: 1,
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: isOnline ? 'rgba(239, 68, 68, 0.12)' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: isOnline ? '#ef4444' : '#ffffff',
                    borderColor: isOnline ? '#ef4444' : 'transparent',
                    boxShadow: isOnline ? '0 4px 14px rgba(239,68,68,0.2)' : '0 4px 16px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  <Power size={18} /> {isOnline ? 'Go Offline' : 'Go Online'}
                </Button>
              </div>
              
              {isOnline && !currentRide && !isPaused && (
                <div style={{ marginTop: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', boxShadow: 'inset 0 0 20px rgba(16,185,129,0.05)' }}>
                  
                  {/* UBER STYLE CAR ANIMATION */}
                  <div className="uber-searching-box">
                    <div className="uber-searching-car">
                      <Car size={24} fill="#10b981" />
                    </div>
                  </div>
  
                  {/* SEARCHING ANIMATION */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader size={28} color="#10b981" style={{ animation: 'spin 2s linear infinite' }} />
                  </div>
                  <div style={{ fontSize: '13px', color: '#10b981', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Finding Trips...</div>
                </div>
              )}
            </div>
  
            {/* DEDICATED ROW UNDER GO ONLINE BUTTON FOR ADMIN MESSAGE NOTICE (ELECTRIC PURPLE COLOUR THEME) */}
            {adminMessages.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowAdminMessagesModal(true);
                    clearAdminMessages();
                  }}
                  style={{
                    width: '100%',
                    position: 'relative',
                    borderColor: '#8b5cf6',
                    color: '#a78bfa',
                    background: 'rgba(139, 92, 246, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.25)'
                  }}
                >
                  <MessageSquare size={16} color="#a78bfa" /> ⚠️ New Notice from Admin
                </Button>
              </div>
            )}

            {/* Offline Message */}
            {!isOnline && (
              <div style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', marginBottom: '14px' }}>
                <Power size={32} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
                <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '800' }}>You are Currently Offline</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Click "Go Online" in the header to start accepting ride dispatches.</p>
              </div>
            )}"""

# First, remove the bad Go Online button that I injected previously (it lacked the rest of the block!)
bad_go_online = """{/* 2. GO ONLINE BUTTON (POSITIONED DIRECTLY DOWN / UNDER THE PROFILE) */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {isOnline && !currentRide && (
                  <Button 
                    variant={isPaused ? 'primary' : 'outline'} 
                    onClick={() => togglePauseBreak(!isPaused)}
                    style={{
                      flex: 1,
                      borderColor: isPaused ? '#f59e0b' : 'var(--border)',
                      background: isPaused ? '#f59e0b' : 'transparent',
                      color: isPaused ? '#000' : 'var(--text-main)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', padding: '12px'
                    }}
                  >
                    {isPaused ? <Play size={16} /> : <Coffee size={16} color="#f59e0b" />}
                    {isPaused ? 'Resume Trips' : 'Take Rest Break'}
                  </Button>
                )}
  
                <Button 
                  variant={isOnline ? 'outline' : 'primary'} 
                  className={isOnline ? 'status-online' : ''}
                  onClick={async () => {
                    if (isOnline) {
                      // Go offline - sync status to backend
                      goOffline();
                      return;
                    }
                    // Going online - check daily verification first
                    if (!isDailyVerified) {
                      setShowVerifyModal(true);
                      setVerifyStep('camera');
                      setCapturedPhoto(null);
                      // Start camera after modal state renders
                      setTimeout(() => startCamera(), 200);
                    } else {
                      goOnline();
                    }
                  }}
                  style={{
                    flex: 1,
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: isOnline ? 'rgba(239, 68, 68, 0.12)' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: isOnline ? '#ef4444' : '#ffffff',
                    borderColor: isOnline ? '#ef4444' : 'transparent',
                    boxShadow: isOnline ? '0 4px 14px rgba(239,68,68,0.2)' : '0 4px 16px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  <Power size={18} /> {isOnline ? 'Go Offline' : 'Go Online'}
                </Button>
              </div>"""
if bad_go_online in content:
    content = content.replace(bad_go_online, missing_block)
else:
    # If not found, inject before TODAY'S EARNINGS
    content = content.replace("{/* TODAY'S EARNINGS COMPACT CARD */}", missing_block + "\n\n            {/* TODAY'S EARNINGS COMPACT CARD */}")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
