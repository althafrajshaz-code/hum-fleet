const fs = require('fs');
let content = fs.readFileSync('vps_server_index.js', 'utf8');

const regex = /rating: driver\.rating \|\| 5\.0,\s*photos: driver\.photos \|\| \{\},\s*docs: driver\.docs \|\| \{\},\s*profilePic: driver\.profilePic \|\| null,/s;
const replaceStr = \ating: driver.rating || 5.0,
        ...(req.query.full === 'true' ? {
          photos: driver.photos || {},
          docs: driver.docs || {},
          profilePic: driver.profilePic || null
        } : {}),\;

content = content.replace(regex, replaceStr);
fs.writeFileSync('vps_server_index.js', content);

