import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Routes imports
import authRoutes from './src/routes/authRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import proposalRoutes from './src/routes/proposalRoutes.js';
import editorRoutes from './src/routes/editorRoutes.js';
import formatRoutes from './src/routes/formatRoutes.js';
import citationRoutes from './src/routes/citationRoutes.js';
import presentationRoutes from './src/routes/presentationRoutes.js';
import simulationRoutes from './src/routes/simulationRoutes.js';
import spssRoutes from './src/routes/spssRoutes.js';
import brainstormingRoutes from './src/routes/brainstormingRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import pdfChatRoutes from './src/routes/pdfChatRoutes.js';
import collaborationRoutes from './src/routes/collaborationRoutes.js';
import aiToolsRoutes from './src/routes/aiToolsRoutes.js';

// Monitoring, Logging & Error Handling
import { logger } from './src/utils/logger.js';
import { monitoring } from './src/utils/monitoring.js';
import { globalErrorHandler } from './src/middleware/errorHandler.js';

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request Monitoring Middleware
  app.use((req, res, next) => {
    const start = Date.now();
    monitoring.incrementActiveRequests();

    res.on('finish', () => {
      const duration = Date.now() - start;
      monitoring.decrementActiveRequests();
      monitoring.recordRequest(res.statusCode, duration);

      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
      }, 'HTTP');
    });

    next();
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/proposal', proposalRoutes);
  app.use('/api/editor', editorRoutes);
  app.use('/api/format', formatRoutes);
  app.use('/api/citations', citationRoutes);
  app.use('/api/presentation', presentationRoutes);
  app.use('/api/simulation', simulationRoutes);
  app.use('/api/spss', spssRoutes);
  app.use('/api/brainstorming', brainstormingRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/payment', paymentRoutes);
  app.use('/api/pdf-chat', pdfChatRoutes);
  app.use('/api/collaboration', collaborationRoutes);
  app.use('/api/ai-tools', aiToolsRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    const metrics = monitoring.getJSONMetrics();
    res.json({
      status: 'ok',
      service: 'Dukun Skripsi Backend',
      timestamp: new Date().toISOString(),
      uptimeSeconds: metrics.uptimeSeconds,
      memory: {
        rssMB: (metrics.memoryUsage.rss / 1024 / 1024).toFixed(2),
        heapUsedMB: (metrics.memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
      },
      requests: {
        total: metrics.totalRequests,
        errors: metrics.totalErrors,
        active: metrics.activeRequests,
        avgLatencyMs: metrics.averageDurationMs,
      }
    });
  });

  // Prometheus Metrics endpoint
  app.get('/api/metrics', (req, res) => {
    res.set('Content-Type', 'text/plain; version=0.0.4');
    res.send(monitoring.getPrometheusMetrics());
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error handling middleware
  app.use(globalErrorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on http://localhost:${PORT}`, { port: PORT, env: process.env.NODE_ENV || 'development' }, 'Bootstrap');
  });
}

startServer().catch((err) => {
  logger.error('Failed to start server:', { error: err.message, stack: err.stack }, 'Bootstrap');
});

