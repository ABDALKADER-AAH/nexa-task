const path = require('path');
const fs = require('fs');

const storageRoot = path.resolve(__dirname, '../../storage');

// Create the storage directory if it doesn't exist
if (!fs.existsSync(storageRoot)) {
    fs.mkdirSync(storageRoot, { recursive: true });
}

const pathValidator = (req, res, next) => {
  // Combine all user-provided paths from query and body into one array
    const userPaths = [];
    if (req.query.path) userPaths.push(req.query.path);
    if (req.body) {
        if (req.body.path) userPaths.push(req.body.path);
        if (req.body.oldPath) userPaths.push(req.body.oldPath);
        if (req.body.newPath) userPaths.push(req.body.newPath);
        if (req.body.destination) userPaths.push(req.body.destination);
    }

    for (const userPath of userPaths) {
    if (typeof userPath !== 'string') {
        const error = new Error('Invalid path provided.');
        error.statusCode = 400;
        return next(error);
    }
    
    // Resolve the user path against the storage root
    const resolvedPath = path.resolve(storageRoot, userPath);

    // Security check: ensure the resolved path is still inside the storage root
    if (!resolvedPath.startsWith(storageRoot)) {
        const error = new Error('Forbidden: Access to this path is not allowed.');
      error.statusCode = 403; // 403 Forbidden
        return next(error);
    }
    }

  // If all paths are valid, proceed to the next middleware or controller
    next();
};

module.exports = pathValidator;