import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { AnnotationCreateSchema } from '../schemas/index.js';

export function registerAnnotationRoutes(app: FastifyInstance) {
  app.post('/v1/annotations', { preHandler: [(app as any).authenticate] }, async (req, reply) => {
    const body = AnnotationCreateSchema.parse(req.body);
    const userId = req.user!.id;
    const created = await prisma.annotation.create({ data: { ...body, userId } });
    return reply.code(201).send(created);
  });

  app.get('/v1/annotations', { preHandler: [(app as any).authenticate] }, async (req: any) => {
    const verseId = String(req.query?.verseId || '');
    const where = verseId ? { verseId } : {};
    const items = await prisma.annotation.findMany({ where, orderBy: { createdAt: 'desc' } });
    return items;
  });

  app.delete('/v1/annotations/:id', { preHandler: [(app as any).authenticate] }, async (req: any, reply) => {
    const { id } = req.params;
    await prisma.annotation.delete({ where: { id } });
    return reply.code(204).send();
  });
}


