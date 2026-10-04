import { FastifyInstance } from 'fastify';

export function registerHealthRoutes(app: FastifyInstance) {
  app.get('/', async (req, reply) => ({
    name: 'Holy Bible API',
    status: 'online',
    frontend: 'http://localhost:5173',
    docs: '/docs'
  }));
  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/ready', async () => ({ status: 'ready' }));
}






