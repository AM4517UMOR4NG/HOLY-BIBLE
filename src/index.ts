import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import multipart from '@fastify/multipart';
import { registerHealthRoutes } from './routes/health.js';
import { authPlugin } from './plugins/auth.js';
import { registerAuthRoutes } from './routes/auth.js';
import { registerBibleRoutes } from './routes/bible.js';
import { registerSearchRoutes } from './routes/search.js';
import { registerAnnotationRoutes } from './routes/annotations.js';
import { registerBookmarkRoutes } from './routes/bookmarks.js';
import { registerAdminRoutes } from './routes/admin.js';
import { registerUploadRoutes } from './routes/uploads.js';
// import './workers/importWorker.js';
// import './workers/indexWorker.js';
// import { ensureMeiliIndexes } from './lib/meili.js';

const server = Fastify({ logger: true });

// CORS configuration - use environment variable or allow all in development
const corsOrigin = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : (process.env.NODE_ENV === 'production' ? false : true);

await server.register(cors, { 
  origin: corsOrigin,
  credentials: true 
});
await server.register(multipart);
await server.register(swagger, {
  openapi: {
    info: { title: 'HOLY BIBLE API', version: '0.1.0' }
  }
});
await server.register(swaggerUi, { routePrefix: '/docs' });
await server.register(authPlugin);

// Root route - redirect to docs
server.get('/', async (request, reply) => {
  return reply.redirect('/docs');
});

await server.register(async (app) => {
  registerHealthRoutes(app);
  registerAuthRoutes(app);
  registerBibleRoutes(app);
  registerSearchRoutes(app);
  registerAnnotationRoutes(app);
  registerBookmarkRoutes(app);
  registerAdminRoutes(app);
  registerUploadRoutes(app);
});

const port = Number(process.env.PORT || 4000);
try {
  // await ensureMeiliIndexes(); // Disabled - Meilisearch not available
  await server.listen({ port, host: '0.0.0.0' });
  server.log.info(`Server listening on ${port}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}


