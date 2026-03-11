const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'sandbox/data-visualizzation/test/beta3.html');
const destCss = path.join(__dirname, 'src/components/sphere.css');
const destTsx = path.join(__dirname, 'src/components/SemanticSphere.tsx');

let content = fs.readFileSync(srcPath, 'utf8');

const cssStart = content.indexOf('<style>') + '<style>'.length;
const cssEnd = content.indexOf('</style>', cssStart);
let cssContent = content.substring(cssStart, cssEnd).trim();

// Add local scope or just keep it global? We'll keep it global but import it in the component.
// We should remove the body reset if we have globals.css
cssContent = cssContent.replace(/body\s*\{[^}]+\}/, '');
cssContent = cssContent.replace(/margin:\s*0;\s*overflow:\s*hidden;\s*background:\s*var\(--bg\);\s*color:\s*var\(--text\);/, '');

fs.writeFileSync(destCss, cssContent, 'utf8');

const jsStart = content.indexOf('<script>') + '<script>'.length;
const jsEnd = content.indexOf('</script>', jsStart);
let jsContent = content.substring(jsStart, jsEnd).trim();

// Replace window event listeners for resize with canvas resize logic
jsContent = jsContent.replace(/window\.innerWidth/g, 'window.innerWidth'); // kept simple
jsContent = jsContent.replace(/window\.innerHeight/g, 'window.innerHeight');

const htmlStart = content.indexOf('<body>') + '<body>'.length;
const htmlEnd = content.indexOf('<script>', htmlStart);
let htmlContent = content.substring(htmlStart, htmlEnd).trim();

// Convert HTML to JSX
htmlContent = htmlContent.replace(/class=/g, 'className=');
htmlContent = htmlContent.replace(/style="([^"]+)"/g, (match, p1) => {
    // Basic inline style to object converter - simple ones only like style="background:var(--ember)"
    const rules = p1.split(';').filter(r => r.trim());
    let obj = '{';
    for(let r of rules) {
        let [k,v] = r.split(':');
        k = k.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        obj += `${k}: "${v.trim()}",`;
    }
    obj += '}';
    return `style={${obj}}`;
});

// Remove script tags from HTML if any
htmlContent = htmlContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

const tsxContent = `"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './sphere.css';

export default function SemanticSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    
    // Wrap the original script inside this effect
    ${jsContent}
    
    // Auto cleanup on unmount
    return () => {
        window.removeEventListener('resize', () => {});
        window.removeEventListener('mousemove', () => {});
        window.removeEventListener('mousedown', () => {});
        window.removeEventListener('mouseup', () => {});
        window.removeEventListener('wheel', () => {});
        window.removeEventListener('keydown', () => {});
        if(document.getElementById('canvas-container')) {
            document.getElementById('canvas-container').innerHTML = '';
        }
        mounted.current = false;
    };
  }, []);

  return (
    <div ref={containerRef} className="sphere-wrapper w-full h-full relative" style={{background: 'var(--bg)', color: 'var(--text)', overflow: 'hidden', height: '100vh', width: '100vw'}}>
      ${htmlContent}
    </div>
  );
}
`;

fs.writeFileSync(destTsx, tsxContent, 'utf8');
console.log('Conversion successful!');
