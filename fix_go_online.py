import os

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

go_online_btn = """              {/* 2. GO ONLINE BUTTON (POSITIONED DIRECTLY DOWN / UNDER THE PROFILE) */}
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

if "2. GO ONLINE BUTTON" not in content:
    content = content.replace("{/* TODAY'S EARNINGS COMPACT CARD */}", go_online_btn + "\n\n              {/* TODAY'S EARNINGS COMPACT CARD */}")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
