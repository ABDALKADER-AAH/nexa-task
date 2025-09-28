const express = require('express');
const multer = require('multer');
const controller = require('../controllers/fileManager.controller');
const pathValidator = require('../middleware/pathValidator');

const router = express.Router();
const upload = multer({ dest: 'storage1/' });

/**
 * @swagger
 * tags:
 *   name: File Manager
 *   description: API for managing local files and folders.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FileSystemItem:
 *       type: object
 *       required:
 *         - name
 *         - isDirectory
 *         - size
 *         - lastModified
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the file or folder.
 *           example: "example.txt"
 *         isDirectory:
 *           type: boolean
 *           description: True if the item is a directory, false if it is a file.
 *           example: false
 *         size:
 *           type: integer
 *           format: int64
 *           description: The size of the item in bytes.
 *           example: 1024
 *         lastModified:
 *           type: string
 *           format: date-time
 *           description: The last modification date and time in ISO 8601 format.
 *           example: "2025-09-26T10:00:00.000Z"
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A success message.
 *           example: "Operation completed successfully."
 *
 *     ErrorResponse:
 *       type: object
 *       required:
 *         - status
 *         - statusCode
 *         - message
 *       properties:
 *         status:
 *           type: string
 *           description: The status of the response.
 *           example: "error"
 *         statusCode:
 *           type: integer
 *           description: The HTTP status code.
 *           example: 403
 *         message:
 *           type: string
 *           description: A descriptive error message.
 *           example: "Forbidden: Access to this path is not allowed."
 *
 *   responses:
 *     Forbidden:
 *       description: Forbidden. The user does not have access to the specified path.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     NotFound:
 *       description: Not Found. The requested item was not found at the specified path.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     BadRequest:
 *       description: Bad Request. The request was malformed or invalid.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *
 *   parameters:
 *     PathQuery:
 *       in: query
 *       name: path
 *       schema:
 *         type: string
 *       required: true
 *       description: The relative path of the directory or file. Use "." for the root.
 *       example: "folder1/subfolder"
 */

/**
 * @swagger
 * /api/browse:
 *   get:
 *     summary: Browse a directory
 *     description: Retrieves the contents of a specific directory within the storage.
 *     tags: [File Manager]
 *     parameters:
 *       - $ref: '#/components/parameters/PathQuery'
 *     responses:
 *       '200':
 *         description: A successful response with the list of items in the directory.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FileSystemItem'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/browse', pathValidator, controller.browse);

/**
 * @swagger
 * /api/create-folder:
 *   post:
 *     summary: Create a new folder
 *     description: Creates a new, empty folder at a specified path.
 *     tags: [File Manager]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *                 description: The relative path where the new folder should be created.
 *                 example: "new-folder/sub-folder"
 *     responses:
 *       '201':
 *         description: Folder created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 */
router.post('/create-folder', pathValidator, controller.createFolder);

/**
 * @swagger
 * /api/create-file:
 *   post:
 *     summary: Create a new file
 *     description: Creates a new, empty file at a specified path.
 *     tags: [File Manager]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *                 description: The relative path where the new file should be created.
 *                 example: "new-folder/new-file.txt"
 *     responses:
 *       '201':
 *         description: File created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 */
router.post('/create-file', pathValidator, controller.createFile);

/**
 * @swagger
 * /api/rename:
 *   put:
 *     summary: Rename a file or folder
 *     description: Renames a file or folder at a specified path.
 *     tags: [File Manager]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPath:
 *                 type: string
 *                 description: The current relative path of the file or folder.
 *                 example: "folder/old-name.txt"
 *               newPath:
 *                 type: string
 *                 description: The new relative path for the file or folder.
 *                 example: "folder/new-name.txt"
 *     responses:
 *       '200':
 *         description: Renamed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/rename', pathValidator, controller.rename);

/**
 * @swagger
 * /api/copy:
 *   post:
 *     summary: Copy a file or folder
 *     description: Copies a file or folder to a new destination.
 *     tags: [File Manager]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *                 description: The relative path of the source file or folder to copy.
 *                 example: "folder/file.txt"
 *               destination:
 *                 type: string
 *                 description: The relative path of the destination.
 *                 example: "backup/file.txt"
 *     responses:
 *       '200':
 *         description: Copied successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/copy', pathValidator, controller.copy);

/**
 * @swagger
 * /api/move:
 *   post:
 *     summary: Move a file or folder
 *     description: Moves a file or folder to a new destination.
 *     tags: [File Manager]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *                 description: The relative path of the source file or folder to move.
 *                 example: "folder/file.txt"
 *               destination:
 *                 type: string
 *                 description: The relative path of the destination.
 *                 example: "new-folder/file.txt"
 *     responses:
 *       '200':
 *         description: Moved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/move', pathValidator, controller.move);

/**
 * @swagger
 * /api/delete:
 *   delete:
 *     summary: Delete a file or folder
 *     description: Deletes a file or folder at a specified path.
 *     tags: [File Manager]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *                 description: The relative path of the file or folder to delete.
 *                 example: "folder/item-to-delete.txt"
 *     responses:
 *       '200':
 *         description: Item deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/delete', pathValidator, controller.deleteItem);

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload files
 *     description: Uploads one or more files to a specified directory.
 *     tags: [File Manager]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *                 description: The relative path of the destination directory.
 *                 example: "uploads"
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       '201':
 *         description: Files uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 */
router.post('/upload', pathValidator, upload.array('files'), controller.uploadFiles);

/**
 * @swagger
 * /api/download:
 *   get:
 *     summary: Download a file
 *     description: Downloads a single file from a specified path.
 *     tags: [File Manager]
 *     parameters:
 *       - $ref: '#/components/parameters/PathQuery'
 *     responses:
 *       '200':
 *         description: The file is sent as an attachment.
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/download', pathValidator, controller.downloadFile);

/**
 * @swagger
 * /api/backup:
 *   post:
 *     summary: Create a backup
 *     description: Creates a zip backup of the entire storage directory and saves it to the user's desktop.
 *     tags: [File Manager]
 *     responses:
 *       '201':
 *         description: Backup created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Backup created successfully!"
 *                 path:
 *                   type: string
 *                   example: "C:\\Users\\user\\Desktop\\backup-user-2025-09-27.zip"
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/backup', controller.createBackup);

module.exports = router;