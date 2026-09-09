const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
if (!code.includes('ErrorBoundary')) {
  code = code.replace("import { BrowserRouter", "import ErrorBoundary from './components/ErrorBoundary';\nimport { BrowserRouter");
  code = code.replace("<BrowserRouter>", "<ErrorBoundary>\n      <BrowserRouter>");
  code = code.replace("</BrowserRouter>", "</BrowserRouter>\n    </ErrorBoundary>");
  fs.writeFileSync('src/App.jsx', code);
}
console.log('App.jsx wrapped!');
