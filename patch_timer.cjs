const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// 1. Add Timer State
const stateTarget = `  const [ridePin, setRidePin] = useState('');`;
const stateReplace = `  const [ridePin, setRidePin] = useState('');
  const [waitTimerSeconds, setWaitTimerSeconds] = useState(0);

  // Live Waiting Timer Effect
  useEffect(() => {
    let interval;
    if (currentRide && currentRide.status === 'Arrived' && currentRide.arrivedAt) {
      interval = setInterval(() => {
        const arrived = new Date(currentRide.arrivedAt).getTime();
        const now = new Date().getTime();
        setWaitTimerSeconds(Math.floor((now - arrived) / 1000));
      }, 1000);
    } else {
      setWaitTimerSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentRide]);`;

content = content.replace(stateTarget, stateReplace);

// 2. Add Timer UI in Arrived state
const uiTarget = `                      <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '16px', fontWeight: '600' }}>
                        Ask the passenger ({currentRide.passengerName || 'Passenger'}) for their Customer ID to verify their identity and start the trip.
                      </p>`;

const uiReplace = `                      <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '16px', fontWeight: '600' }}>
                        Ask the passenger ({currentRide.passengerName || 'Passenger'}) for their Customer ID to verify their identity and start the trip.
                      </p>
                      {currentRide.arrivedAt && (
                        <div style={{ marginBottom: '16px', padding: '12px', background: Math.floor(waitTimerSeconds / 60) >= 5 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', color: Math.floor(waitTimerSeconds / 60) >= 5 ? '#ef4444' : '#3b82f6' }}>
                          <div style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            ⏳ Waiting Time: {Math.floor(waitTimerSeconds / 60)}m {waitTimerSeconds % 60}s
                          </div>
                          {Math.floor(waitTimerSeconds / 60) >= 5 ? (
                            <div style={{ fontSize: '12px', fontWeight: '700', marginTop: '6px' }}>
                              Free 5 mins exceeded!<br/>
                              Passenger is being charged ₹1.5/min<br/>
                              Total charge: ₹{((Math.floor(waitTimerSeconds / 60) - 5) * 1.5).toFixed(2)}
                            </div>
                          ) : (
                            <div style={{ fontSize: '12px', fontWeight: '700', marginTop: '6px' }}>
                              Free time remaining: {4 - Math.floor(waitTimerSeconds / 60)}m {59 - (waitTimerSeconds % 60)}s
                            </div>
                          )}
                        </div>
                      )}`;

content = content.replace(uiTarget, uiReplace);

fs.writeFileSync('src/pages/DriverDashboard.jsx', content);
console.log('Successfully injected smooth timer');
