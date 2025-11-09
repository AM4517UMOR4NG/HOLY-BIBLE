import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { authPlugin } from './plugins/auth.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerAuthRoutes } from './routes/auth.js';
import { registerBibleRoutes } from './routes/bible.js';
import { registerSearchRoutes } from './routes/search.js';
import { registerBookmarkRoutes } from './routes/bookmarks.js';
import { registerAnnotationRoutes } from './routes/annotations.js';
import { registerUploadRoutes } from './routes/uploads.js';
import { registerAdminRoutes } from './routes/admin.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info'
    }
  });

  // Register CORS
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  });

  // Register multipart for file uploads
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB
    }
  });

  // Register Swagger for API documentation
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Holy Bible API',
        description: 'API for Holy Bible application',
        version: '1.0.0'
      },
      servers: [
        {
          url: 'http://localhost:4000',
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  });

  await app.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    },
    staticCSP: true
  });

  // Register auth plugin
  await app.register(authPlugin);

  // Register routes
  registerHealthRoutes(app);
  registerAuthRoutes(app);
  registerBibleRoutes(app);
  registerSearchRoutes(app);
  registerBookmarkRoutes(app);
  registerAnnotationRoutes(app);
  registerUploadRoutes(app);
  registerAdminRoutes(app);

  // Error handler
  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    reply.status(error.statusCode || 500).send({
      success: false,
      message: error.message || 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  });

  return app;
}
