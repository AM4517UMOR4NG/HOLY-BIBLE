import { FastifyInstance } from 'fastify';
import { versesIndex } from '../lib/meili.js';

export function registerSearchRoutes(app: FastifyInstance) {
  app.get('/v1/search', async (req: any) => {
    const q = String(req.query?.q || '');
    const limit = Number(req.query?.limit ?? 20);
    const offset = Number(req.query?.offset ?? 0);
    const version = req.query?.version ? String(req.query.version) : undefined;
    const language = req.query?.language ? String(req.query.language) : undefined;
    if (!q) return { total: 0, hits: [] };
    const index = versesIndex();
    const filters: string[] = [];
    if (version) filters.push(`versionCode = ${JSON.stringify(version)}`);
    if (language) filters.push(`language = ${JSON.stringify(language)}`);
    const res = await index.search(q, { limit, offset, filter: filters.length ? filters : undefined });
    return {
      total: res.estimatedTotalHits ?? res.hits.length,
      hits: res.hits
    };
  });
}


