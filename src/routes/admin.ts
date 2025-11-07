import { FastifyInstance } from 'fastify';
import { importQueue } from '../jobs/queues.js';
import { randomUUID } from 'crypto';

export function registerAdminRoutes(app: FastifyInstance) {
  app.post('/v1/admin/import', { preHandler: [(app as any).authenticate, (app as any).authorizeRole('ADMIN')] }, async (req: any, reply) => {
    if (!importQueue) {
      return reply.code(503).send({ error: 'Job queue not available. Redis connection required.' });
    }
    const body = req.body || {};
    const versionCode = body.versionCode || `VER-${randomUUID().slice(0, 8)}`;
    const jsonPayload = body.books ? body : undefined;
    const job = await importQueue.add('import', { versionCode, jsonPayload });
    return reply.code(202).send({ jobId: job.id });
  });

  app.get('/v1/admin/jobs/:jobId', { preHandler: [(app as any).authenticate, (app as any).authorizeRole('ADMIN')] }, async (req: any) => {
    if (!importQueue) {
      return { error: 'Job queue not available. Redis connection required.' };
    }
    const { jobId } = req.params;
    const job = await importQueue.getJob(jobId);
    if (!job) return { id: jobId, status: 'not_found' };
    const state = await job.getState();
    const progress = job.progress as number | { [k: string]: any };
    return { id: job.id, type: job.name, status: state, progress };
  });
}


