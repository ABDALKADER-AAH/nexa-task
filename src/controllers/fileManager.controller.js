const path = require('path');
const fse = require('fs-extra');
const createBackupService = require('../services/backup.service');

const storageRoot = path.resolve(__dirname, '../../storage');

// Helper function to get the full, safe path
const getFullPath = (relativePath = '') => path.join(storageRoot, relativePath);

exports.browse = async (req, res, next) => {
  try {
    const dirPath = getFullPath(req.query.path);
    const items = await fse.readdir(dirPath);
    const detailedItems = await Promise.all(
      items.map(async (item) => {
        const itemPath = path.join(dirPath, item);
        const stats = await fse.stat(itemPath);
        return {
          name: item,
          isDirectory: stats.isDirectory(),
          size: stats.size,
          lastModified: stats.mtime,
        };
      })
    );
    res.status(200).json(detailedItems);
  } catch (error) {
    next(error);
  }
};

exports.createFile = async (req, res, next) => {
  try {
    const filePath = getFullPath(req.body.path);
    await fse.ensureFile(filePath); // Creates file if it does not exist
    res.status(201).json({ message: 'File created successfully' });
  } catch (error) {
    next(error);
  }
};

exports.createFolder = async (req, res, next) => {
  try {
    const folderPath = getFullPath(req.body.path);
    await fse.ensureDir(folderPath); // Creates directory if it does not exist
    res.status(201).json({ message: 'Folder created successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const itemPath = getFullPath(req.body.path);
    await fse.remove(itemPath); // Works for both files and folders
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.rename = async (req, res, next) => {
  try {
    const oldPath = getFullPath(req.body.oldPath);
    const newPath = getFullPath(req.body.newPath);
    await fse.rename(oldPath, newPath);
    res.status(200).json({ message: 'Renamed successfully' });
  } catch (error) {
    next(error);
  }
};

exports.copy = async (req, res, next) => {
    try {
        const sourcePath = getFullPath(req.body.path);
        const destPath = getFullPath(req.body.destination);
        await fse.copy(sourcePath, destPath);
        res.status(200).json({ message: 'Copied successfully' });
    } catch (error) {
        next(error);
    }
};

exports.move = async (req, res, next) => {
    try {
        const sourcePath = getFullPath(req.body.path);
        const destPath = getFullPath(req.body.destination);
        await fse.move(sourcePath, destPath);
        res.status(200).json({ message: 'Moved successfully' });
    } catch (error) {
        next(error);
    }
};

exports.uploadFiles = async (req, res, next) => {
    try {
        const destination = getFullPath(req.body.path);
        await fse.ensureDir(destination);

        for (const file of req.files) {
            const finalPath = path.join(destination, file.originalname);
            await fse.move(file.path, finalPath, { overwrite: true });
        }
        res.status(201).json({ message: `${req.files.length} files uploaded successfully` });
    } catch (error) {
        next(error);
    }
};

exports.downloadFile = async (req, res, next) => {
    try {
        const filePath = getFullPath(req.query.path);
        const stats = await fse.stat(filePath);

        if (stats.isDirectory()) {
            const error = new Error('The specified path is a directory, not a file. Only files can be downloaded.');
            error.statusCode = 400; // Bad Request
            return next(error);
        }

        res.download(filePath, (err) => {
            if (err) {
                // The error handler middleware will catch this
                next(err);
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.createBackup = async (req, res, next) => {
    try {
        const backupFilePath = await createBackupService();
        res.status(201).json({
        message: 'Backup created successfully!',
        path: backupFilePath,
    });
    } catch (error) {
    next(error);
    }
};