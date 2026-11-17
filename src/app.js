require('dotenv').config();
const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./docs/openapi');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.resolve('uploads')));
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));
app.use('/v1/user', require('./routes/userRoutes'));
app.use('/v1/category', require('./routes/categoryRoutes'));
app.use('/v1/product', require('./routes/productRoutes'));
app.use((req, res) => res.status(404).json({ error: 'Route not found', code: 'NOT_FOUND' }));
app.use(errorHandler);
module.exports = app;
