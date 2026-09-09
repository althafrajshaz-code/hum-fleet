import React from 'react';
import { renderToString } from 'react-dom/server';
import PassengerDashboard from './src/pages/PassengerDashboard.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

try {
  console.log('Rendering PassengerDashboard...');
  const html = renderToString(
    <Router>
      <PassengerDashboard />
    </Router>
  );
  console.log('Render successful. Length:', html.length);
} catch (e) {
  console.error('RENDER ERROR:', e);
}
