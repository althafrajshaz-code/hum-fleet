const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/PassengerDashboard.jsx', 'utf8');

content = content.replace(
  "import React, { useState, useEffect, useRef } from 'react';",
  "import React, { useState, useEffect, useRef, useMemo } from 'react';"
);

fs.writeFileSync('d:/Althaf/hum/src/pages/PassengerDashboard.jsx', content);
console.log('Fixed useMemo import.');
