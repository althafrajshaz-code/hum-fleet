const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// Find a good place to add the state
if (content.includes(`const [incomingRide, setIncomingRide] = useState(null);`)) {
    content = content.replace(
        `const [incomingRide, setIncomingRide] = useState(null);`,
        `const [incomingRide, setIncomingRide] = useState(null);\n  const [isAccepting, setIsAccepting] = useState(false);`
    );
} else {
    console.log("Could not find incomingRide state.");
}

// Modify handleAcceptRide
let handleAcceptRideOld = `  const handleAcceptRide = async () => {
    if (!incomingRide) return;

    // Frontend guard: block cash trip acceptance if balance > ₹1500`;

let handleAcceptRideNew = `  const handleAcceptRide = async () => {
    if (!incomingRide) return;
    setIsAccepting(true);

    // Frontend guard: block cash trip acceptance if balance > ₹1500`;

if (content.includes(handleAcceptRideOld)) {
    content = content.replace(handleAcceptRideOld, handleAcceptRideNew);
} else {
    let handleAcceptRideOld_win = handleAcceptRideOld.replace(/\n/g, '\r\n');
    let handleAcceptRideNew_win = handleAcceptRideNew.replace(/\n/g, '\r\n');
    if (content.includes(handleAcceptRideOld_win)) {
         content = content.replace(handleAcceptRideOld_win, handleAcceptRideNew_win);
    } else {
         console.log("Could not find handleAcceptRide top");
    }
}

let handleAcceptRideOld2 = `    } catch (err) {
      console.error("Error accepting ride request:", err);
    }
  };`;

let handleAcceptRideNew2 = `    } catch (err) {
      console.error("Error accepting ride request:", err);
    } finally {
      setIsAccepting(false);
    }
  };`;

if (content.includes(handleAcceptRideOld2)) {
    content = content.replace(handleAcceptRideOld2, handleAcceptRideNew2);
} else {
    let old2_win = handleAcceptRideOld2.replace(/\n/g, '\r\n');
    let new2_win = handleAcceptRideNew2.replace(/\n/g, '\r\n');
    if (content.includes(old2_win)) {
        content = content.replace(old2_win, new2_win);
    } else {
        console.log("Could not find handleAcceptRide bottom");
    }
}

// Modify the button
let btnOld = `<Button variant="primary" className="full-width" onClick={handleAcceptRide}>Accept</Button>`;
let btnNew = `<Button variant="primary" className="full-width" onClick={handleAcceptRide} disabled={isAccepting}>{isAccepting ? 'Accepting...' : 'Accept'}</Button>`;

if (content.includes(btnOld)) {
    content = content.replace(btnOld, btnNew);
} else {
    console.log("Could not find the Accept button");
}

fs.writeFileSync('src/pages/DriverDashboard.jsx', content);
console.log("Fix script executed");
