const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace("<Router>", "<ErrorBoundary>\n      <Router>");
code = code.replace("</Router>", "</Router>\n    </ErrorBoundary>");
fs.writeFileSync('src/App.jsx', code);
console.log('App.jsx properly wrapped now!');
