import re

def declutter_passenger():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove Vehicle Image Preview
    old_vehicle_preview = '''                {/* Vehicle Image Preview */}
                <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.1)' }}>
                  <img 
                    src={resolveVehiclePhoto(activeRide.vehiclePhotos?.front || activeRide.vehiclePhotos?.rear || null, 'front')} 
                    alt="Vehicle view" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '10px', padding: '3px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                    ðŸš— Vehicle Photo
                  </div>
                </div>'''
                
    if old_vehicle_preview in content:
        content = content.replace(old_vehicle_preview, '')
        print("Removed Vehicle Preview")
    else:
        print("Vehicle preview not found")

    # 2. Remove Mid-Trip Destination update
    old_mid_trip = '''              {/* MID-TRIP DESTINATION UPDATE BUTTON */}
              <button
                type="button"
                onClick={() => { setShowUpdateDestModal(true); setNewDestInput(activeRide.dropoff || dropoff); }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1.5px solid #f59e0b',
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: '#f59e0b',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
                }}
              >
                <Navigation size={18} /> ðŸ“  Change / Update Destination
              </button>'''
              
    if old_mid_trip in content:
        content = content.replace(old_mid_trip, '')
        print("Removed Mid-trip dest button")
    else:
        print("Mid-trip not found")

    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

declutter_passenger()
