const fs = require('fs');
let content = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

content = content.replace(
  `  // Poll vehicle categories & settings every 3 seconds to get live admin pricing updates\n  useEffect(() => {\n    const interval = setInterval(async () => {\n      fetchCategories();\n      fetchPassengerActiveRide();\n    }, 3000);`,
  `  // Poll vehicle categories & settings every 1 second to get live admin pricing updates\n  useEffect(() => {\n    const interval = setInterval(async () => {\n      fetchCategories();\n      fetchPassengerActiveRide();\n    }, 1000);`
);

content = content.replace(
  `  // Poll vehicle categories & settings every 3 seconds to get live admin pricing updates\r\n  useEffect(() => {\r\n    const interval = setInterval(async () => {\r\n      fetchCategories();\r\n      fetchPassengerActiveRide();\r\n    }, 3000);`,
  `  // Poll vehicle categories & settings every 1 second to get live admin pricing updates\r\n  useEffect(() => {\r\n    const interval = setInterval(async () => {\r\n      fetchCategories();\r\n      fetchPassengerActiveRide();\r\n    }, 1000);`
);

fs.writeFileSync('src/pages/PassengerDashboard.jsx', content);
