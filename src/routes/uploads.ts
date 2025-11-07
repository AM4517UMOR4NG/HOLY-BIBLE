import { FastifyInstance } from 'fastify';

export function registerUploadRoutes(app: FastifyInstance) {
  app.post('/v1/uploads', async (_req, reply) => {
    // Implement signed URL or direct upload handler
    return reply.code(201).send({ id: 'stub', filename: 'file', url: 'http://example', mime: 'application/octet-stream', size: 0, createdAt: new Date().toISOString() });
  });
}




