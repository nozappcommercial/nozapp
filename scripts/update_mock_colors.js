const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'sandbox/data-visualizzation/test/beta3.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace mock data poster colors
content = content.replace(/'#ff6b3d'/g, "'#78272e'"); // ember -> r3
content = content.replace(/'#7a2e18'/g, "'#58191b'"); // ember-dim -> r2
content = content.replace(/'#e4b84a'/g, "'#b58c2a'"); // gold
content = content.replace(/'#6b5020'/g, "'#a67c00'"); // gold-dim
content = content.replace(/'#5ecde8'/g, "'#3b8b9e'"); // cold
content = content.replace(/'#1a4d5a'/g, "'#225560'"); // cold-dim
content = content.replace(/'#04050b'/g, "'#f8f8ee'"); // bg
content = content.replace(/'#000000'/g, "'#f0f0e4'"); // black -> bg2

fs.writeFileSync(filePath, content, 'utf8');
console.log('Mock colors updated');
