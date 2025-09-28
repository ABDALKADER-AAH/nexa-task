const os = require('os');
const path = require('path');
const fse = require('fs-extra');
const archiver = require('archiver');

const storageRoot = path.resolve(__dirname, '../../storage');

function createBackup() {
  return new Promise((resolve, reject) => {
    try {
      // 1. Determine destination path (Desktop)
      const desktopPath = path.join(os.homedir(), 'Desktop');
      
      // 2. Get username and date to create a unique filename
      const username = os.userInfo().username || 'user';
      const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const backupFilename = `backup-${username}-${date}.zip`;
      const backupFilePath = path.join(desktopPath, backupFilename);

      // 3. Create a write stream to the destination file
      const output = fse.createWriteStream(backupFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 }, // Set compression level
      });

      // Listen for all archive data to be written
      output.on('close', () => {
        console.log(`Backup created successfully: ${archive.pointer()} total bytes`);
        console.log(`Path: ${backupFilePath}`);
        resolve(backupFilePath);
      });

      // Listen for errors
      archive.on('error', (err) => {
        reject(err);
      });

      // Pipe archive data to the file
      archive.pipe(output);

      // Append the entire 'storage' directory to the archive
      archive.directory(storageRoot, false);

      // Finalize the archive (triggers the 'close' event)
      archive.finalize();
      
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = createBackup;