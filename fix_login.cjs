const fs = require('fs');
const path = 'd:\\Althaf\\hum\\server\\index.js';
let content = fs.readFileSync(path, 'utf8');

const targetLoginCheck = `  const user = drivers.find(d => 
    (d.email && d.email.toLowerCase() === loginId.toLowerCase() || d.phone === loginId) && 
    (d.password === password || (!d.password && password === 'driver123'))
  );`;

const replaceLoginCheck = `  const cleanPhone = (p) => p ? p.replace(/[^0-9]/g, '') : '';
  const cleanLoginId = cleanPhone(loginId);
  const user = drivers.find(d => 
    (
      (d.email && d.email.toLowerCase() === loginId.toLowerCase()) || 
      (d.phone === loginId) ||
      (d.phone && cleanPhone(d.phone) === cleanLoginId && cleanLoginId.length >= 10)
    ) && 
    (d.password === password || (!d.password && password === 'driver123'))
  );`;

if (content.includes(targetLoginCheck)) {
  content = content.replace(targetLoginCheck, replaceLoginCheck);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Updated driver login phone matching logic.');
} else {
  console.log('Could not find target driver login check.');
}

// Do the same for passenger login just in case
const targetPassLoginCheck = `  const user = passengers.find(p => 
    (p.email && p.email.toLowerCase() === loginId.toLowerCase() || p.phone === loginId) && 
    (p.password === password || (!p.password && password === 'passenger123'))
  );`;

const replacePassLoginCheck = `  const cleanPhone = (p) => p ? p.replace(/[^0-9]/g, '') : '';
  const cleanLoginId = cleanPhone(loginId);
  const user = passengers.find(p => 
    (
      (p.email && p.email.toLowerCase() === loginId.toLowerCase()) || 
      (p.phone === loginId) ||
      (p.phone && cleanPhone(p.phone) === cleanLoginId && cleanLoginId.length >= 10)
    ) && 
    (p.password === password || (!p.password && password === 'passenger123'))
  );`;

if (content.includes(targetPassLoginCheck)) {
  content = content.replace(targetPassLoginCheck, replacePassLoginCheck);
  console.log('Updated passenger login phone matching logic.');
} else {
  console.log('Could not find target passenger login check.');
}

fs.writeFileSync(path, content, 'utf8');
