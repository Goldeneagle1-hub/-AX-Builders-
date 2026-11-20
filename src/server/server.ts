import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from './config.js';
import { apiRouter } from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distIndexPath = path.resolve(process.cwd(), 'dist', 'index.html');
const isRunningCompiledServer = __filename.includes(`${path.sep}dist${path.sep}`);
const isProd =
  process.env.NODE_ENV === 'production' ||
  (isRunningCompiledServer && fs.existsSync(distIndexPath));

async function startServer() {
  const app = express();

  // Basic security and parsing middleware
  app.use(cors());
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Request logger (clean, no sensitive keys logged)
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path} (${new Date().toLocaleTimeString('ko-KR')})`);
    }
    next();
  });

  // Mount API Router before static/SPA handlers
  app.use('/api', apiRouter);

  // Public assets
  const publicDir = path.resolve(process.cwd(), 'public');
  app.use(express.static(publicDir));

  // Client handling: Vite dev middleware or static dist
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(CONFIG.PORT, () => {
    console.log(
      `[Jeju Civil Copilot] Server running on http://localhost:${CONFIG.PORT} (mode: ${CONFIG.APP_MODE})`
    );
  });

  return server;
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
