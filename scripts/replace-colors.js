const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'sandbox/data-visualizzation/test/beta3.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace CSS Variables
content = content.replace(/--ember: #ff6b3d;/, '--ember: rgb(120, 39, 46);');
content = content.replace(/--ember-dim: #7a2e18;/, '--ember-dim: rgba(120, 39, 46, 0.3);');
content = content.replace(/--gold: #e4b84a;/, '--gold: rgb(181, 140, 42);');
content = content.replace(/--gold-dim: #6b5020;/, '--gold-dim: rgba(181, 140, 42, 0.3);');
content = content.replace(/--cold: #5ecde8;/, '--cold: rgb(59, 139, 158);');
content = content.replace(/--cold-dim: #1a4d5a;/, '--cold-dim: rgba(59, 139, 158, 0.3);');
content = content.replace(/--bg: #04050b;/, '--bg: rgb(248, 248, 238);');
content = content.replace(/--surface: rgba\(8, 10, 18, 0\.92\);/, '--surface: rgba(252, 252, 246, 0.92);');
content = content.replace(/--text: #e2d9cc;/, '--text: rgb(22, 10, 12);');
content = content.replace(/--dim: #4a4540;/, '--dim: rgba(22, 10, 12, 0.5);');

// Replace RGBA colors
content = content.replace(/rgba\(255, 107, 61/g, 'rgba(120, 39, 46');
content = content.replace(/rgba\(228, 184, 74/g, 'rgba(181, 140, 42');
content = content.replace(/rgba\(94, 205, 232/g, 'rgba(59, 139, 158');
content = content.replace(/rgba\(8, 10, 18/g, 'rgba(252, 252, 246');
// Fix text colors on hover/active to match light theme
content = content.replace(/color: #fff/g, 'color: rgb(248, 248, 238)');
content = content.replace(/background: rgba\(4, 5, 11, \.85\)/g, 'background: rgba(248, 248, 238, .6)');
content = content.replace(/color: rgba\(255, 255, 255, \.45\)/g, 'color: rgba(22, 10, 12, .6)');
content = content.replace(/color: rgba\(226, 217, 204, \.2\)/g, 'color: rgba(22, 10, 12, .4)');
content = content.replace(/color: rgba\(226, 217, 204, \.6\)/g, 'color: rgba(22, 10, 12, .7)');

// Replace JS configs
content = content.replace(/from: 0xff6b3d, to: 0xe4b84a/g, 'from: 0x78272e, to: 0xb58c2a');
content = content.replace(/from: 0xe4b84a, to: 0x5ecde8/g, 'from: 0xb58c2a, to: 0x3b8b9e');
content = content.replace(/from: 0x5ecde8, to: 0x1a4d5a/g, 'from: 0x3b8b9e, to: 0x225560');

content = content.replace(/color: 0xff6b3d/g, 'color: 0x78272e');
content = content.replace(/color: 0xe4b84a/g, 'color: 0xb58c2a');
content = content.replace(/color: 0x5ecde8/g, 'color: 0x3b8b9e');

// Background and fog
content = content.replace(/0x04050b/g, '0xf8f8ee');
// Wireframes
content = content.replace(/0x0d1525/g, '0x160a0c');
content = content.replace(/shellAlpha\[i\]/g, 'shellAlpha[i] * 0.4');
// Dim nodes
content = content.replace(/0x0d1020/g, '0xe0ddd5');
// Stars
content = content.replace(/0x6677aa/g, '0x160a0c');
// Remove additive blending since it makes colors disappear on light background
content = content.replace(/blending: THREE\.AdditiveBlending/g, 'blending: THREE.NormalBlending');

content = content.replace(/color\.multiplyScalar\(i === hit \? 2\.0 : 1\.4\)/g, 'color.multiplyScalar(i === hit ? 0.8 : 0.9)'); // for light theme, multiply by < 1 to darken
content = content.replace(/color\.copy\(c\.clone\(\)\.multiplyScalar\(2\.2\)\)/g, 'color.copy(c.clone().multiplyScalar(0.7))');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Update complete');
