const fs = require('fs');
const content = fs.readFileSync('public/google_form_script.gs', 'utf-8');

let qCount = 0;
const lines = content.split('\n');
for (let line of lines) {
  if (line.includes('"module":')) {
    qCount++;
  }
}

console.log('Total questions based on module field:', qCount);
