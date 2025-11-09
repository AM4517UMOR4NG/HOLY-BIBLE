import { FastifyInstance } from 'fastify';

export function registerHealthRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/ready', async () => ({ status: 'ready' }));
}






