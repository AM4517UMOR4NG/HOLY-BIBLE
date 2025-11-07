import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { BookmarkCreateSchema } from '../schemas/index.js';

export function registerBookmarkRoutes(app: FastifyInstance) {
  app.post('/v1/bookmarks', { preHandler: [(app as any).authenticate] }, async (req, reply) => {
    const body = BookmarkCreateSchema.parse(req.body);
    const userId = req.user!.id;
    const created = await prisma.bookmark.create({ data: { ...body, userId } });
    return reply.code(201).send(created);
  });

  app.get('/v1/bookmarks', { preHandler: [(app as any).authenticate] }, async (req: any) => {
    const userId = req.user!.id;
    const items = await prisma.bookmark.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return items;
  });
}


