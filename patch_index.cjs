const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const script = `
    <script>
      window.onerror = function(message, source, lineno, colno, error) {
        alert("JS ERROR: " + message + "\\n" + source + ":" + lineno);
      };
      window.addEventListener('unhandledrejection', function(event) {
        alert("PROMISE REJECTION: " + (event.reason ? event.reason.message || event.reason : "Unknown"));
      });
    </script>
`;
if (!html.includes('window.onerror')) {
  html = html.replace('<head>', '<head>' + script);
  fs.writeFileSync('index.html', html);
}
console.log('index.html patched with global error handler!');
