const fs = require('fs');

let content = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

const targetStr = `
    // Clear UI instantly
    setActiveRide(null);
    setIsSearching(false);
    setRideAccepted(false);
    setDropoff('');
    setDropoffCoords(null);
    setWaypoints([]);
    setBookingStep(1);
    
    // Automatically find their location again instead of leaving it blank
    handleUseCurrentLocation('pickup');
    setShowRating(false);
    setRatingValue(5);
    setRatingComment('');
    setSelectedBadges([]);

    const mapIframe = document.getElementById('map-iframe');
    if (mapIframe && mapIframe.contentWindow) {
      mapIframe.contentWindow.postMessage({ type: 'RESET_MAP' }, '*');
    }

    try {
      await fetch(\`\${API_BASE}/api/rides/\${rideId}/rate-driver\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: currentRating,
          comment: currentComment,
          badges: currentBadges
        })
      });
    } catch (err) {
      console.error("Failed to submit driver rating:", err);
    }
`;

const replacementStr = `
    try {
      await fetch(\`\${API_BASE}/api/rides/\${rideId}/rate-driver\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: currentRating,
          comment: currentComment,
          badges: currentBadges
        })
      });
    } catch (err) {
      console.error("Failed to submit driver rating:", err);
    }

    // Clear UI AFTER server has processed it to prevent polling race condition
    setActiveRide(null);
    setIsSearching(false);
    setRideAccepted(false);
    setDropoff('');
    setDropoffCoords(null);
    setWaypoints([]);
    setBookingStep(1);
    
    // Automatically find their location again instead of leaving it blank
    handleUseCurrentLocation('pickup');
    setShowRating(false);
    setRatingValue(5);
    setRatingComment('');
    setSelectedBadges([]);

    const mapIframe = document.getElementById('map-iframe');
    if (mapIframe && mapIframe.contentWindow) {
      mapIframe.contentWindow.postMessage({ type: 'RESET_MAP' }, '*');
    }
`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    
    const target2 = `        if (data) {
          setActiveRide(data);
          if (data.status === 'Accepted' || data.status === 'Arrived' || data.status === 'In Progress') {
            setIsSearching(false);
            setRideAccepted(true);
          } else if (data.status === 'Searching') {
            setIsSearching(true);
            setRideAccepted(false);
          }
        }`;
    const replacement2 = `        if (data) {
          setActiveRide(data);
          if (data.status === 'Accepted' || data.status === 'Arrived' || data.status === 'In Progress') {
            setIsSearching(false);
            setRideAccepted(true);
          } else if (data.status === 'Searching') {
            setIsSearching(true);
            setRideAccepted(false);
          }
        } else {
          setActiveRide(null);
        }`;
        
    if (content.includes(target2)) {
        content = content.replace(target2, replacement2);
        fs.writeFileSync('src/pages/PassengerDashboard.jsx', content);
        console.log("Successfully fixed BOTH race conditions.");
    } else {
        console.log("Could not find fetchPassengerActiveRide block");
    }
} else {
    console.log("Could not find handleSubmitRating block");
}
