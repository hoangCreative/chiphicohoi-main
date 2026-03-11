const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!['node_modules', '.git', '.gemini', 'dist'].includes(f)) {
        walkDir(dirPath, callback);
      }
    } else {
      callback(path.join(dir, f));
    }
  });
}

const filesToZip = [];
walkDir('.', function(filePath) {
  const size = fs.statSync(filePath).size;
  // Exclude files larger than 1MB
  if (size < 1024 * 1024) {
    if (!filePath.endsWith('.zip')) {
      filesToZip.push(filePath);
    }
  }
});

// Since Windows Compress-Archive cannot easily take a list of 1000s of files from command line,
// we will just copy the relevant files to a temp folder and zip that.
const tempDir = '../TieuHanhTinh_temp_zip';
if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
fs.mkdirSync(tempDir);

filesToZip.forEach(file => {
  const dest = path.join(tempDir, file);
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(file, dest);
});

console.log('Copied lightweight files. Zipping...');
execSync(`powershell -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '..\\TieuHanhTinh_SourceCode_Light.zip' -Force"`);

fs.rmSync(tempDir, { recursive: true, force: true });
console.log('Done creating TieuHanhTinh_SourceCode_Light.zip (Without heavy files)');
