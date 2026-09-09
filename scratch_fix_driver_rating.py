import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update fetchDriverActiveRide to not clear Completed rides
target1 = r'''          if (data) {
            if (data.current) setCurrentRide(data.current);
            else setCurrentRide(null);'''

replace1 = r'''          if (data) {
            if (data.current) setCurrentRide(data.current);
            else setCurrentRide(prev => (prev && prev.status === 'Completed') ? prev : null);'''

content = content.replace(target1, replace1)

# 2. Update handleCompleteRide to set currentRide status to 'Completed'
target2 = r'''        if (response.ok) {
          setShowEndTripSummary(false);
          setShowRating(true);
        } else {'''

replace2 = r'''        if (response.ok) {
          setShowEndTripSummary(false);
          setShowRating(true);
          setCurrentRide(prev => ({ ...prev, status: 'Completed' }));
        } else {'''

content = content.replace(target2, replace2)

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Driver dashboard fixed")
