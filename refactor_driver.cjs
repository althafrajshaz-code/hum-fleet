const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'pages', 'DriverDashboard.jsx');
let content = fs.readFileSync(file, 'utf8');

// Find the start of dashboard-sidebar
const sidebarRegex = /<div className="dashboard-sidebar glass-card" style={{ zIndex: 10 }}>/;
const sidebarMatch = content.match(sidebarRegex);
if (!sidebarMatch) throw new Error("Sidebar not found");

const sidebarIndex = sidebarMatch.index;

// Find the start of dashboard-map
const mapRegex = /<div className="dashboard-map animate-fade-in delay-100" style={{ padding: 0, overflow: 'hidden', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>/;
const mapMatch = content.match(mapRegex);
if (!mapMatch) throw new Error("Map not found");

const mapIndex = mapMatch.index;

console.log("Sidebar index:", sidebarIndex);
console.log("Map index:", mapIndex);

// We need to carefully extract the dashboard-map div.
// It's easier to just find the end of it. We know it ends exactly before the closing tags of dashboard-container and the main div.
// Actually, let's look at the end of the file.
