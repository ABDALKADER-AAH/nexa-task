const express = require('express');
const cors = require('cors');
const path = require('path');
const mainRouter = require('./routes/index.routes');
const errorHandler = require('./middleware/errorHandler');
// --- Swagger ---
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
// --- /Swagger ---
const app = express();

// --- Swagger Configuration ---
const swaggerOptions = {
    swaggerDefinition: {
    openapi: '3.0.0',
    info: {
        title: 'Local File Manager API',
        version: '1.0.0',
        description: 'API documentation for the local file manager server.',
        contact: {
            name: 'Developer',
        },
    },
    servers: [
        {
        url: 'http://localhost:3000',
        },
    ],
    },
  // Path to the API docs
        apis: ['./src/routes/*.js'],  
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// --- /Swagger Configuration ---

// Enable CORS for all routes
app.use(cors());

// Middlewares to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'storage' directory if needed (e.g., for direct access)
// This allows accessing files via http://localhost:3000/files/your-file.txt
app.use('/files', express.static(path.join(__dirname, '../storage')));

// Main API routes
app.use('/api', mainRouter);

// Global error handler middleware
app.use(errorHandler);

module.exports = app;