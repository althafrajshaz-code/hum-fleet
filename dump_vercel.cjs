const fs = require('fs');
fetch('https://admin-av6htu0to-althafrajshaz-codes-projects.vercel.app/')
  .then(r => r.text())
  .then(t => {
    fs.writeFileSync('vercel_html.txt', t);
    console.log("Saved to vercel_html.txt");
  });
