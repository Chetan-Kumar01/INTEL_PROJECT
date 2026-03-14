const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const triageRoutes = require('./routes/triage');
const compressionRoutes = require('./routes/compression');
const pipelineRoutes = require('./routes/pipeline');
const keyRoutes = require('./routes/keys');
const comparisonRoutes = require('./routes/comparison');
const logsRoutes = require('./routes/logs');
const ragRoutes = require('./routes/rag');
const { apiKeyMiddleware } = require('./middleware/apiKeyMiddleware');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/keys', keyRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/rag', apiKeyMiddleware, ragRoutes);
app.use('/api/triage', apiKeyMiddleware, pipelineRoutes);
app.use('/api/compare', apiKeyMiddleware, comparisonRoutes);
app.use('/api/triage-legacy', apiKeyMiddleware, triageRoutes);
app.use('/api/compress', apiKeyMiddleware, compressionRoutes);

app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found',
    path: req.originalUrl
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
