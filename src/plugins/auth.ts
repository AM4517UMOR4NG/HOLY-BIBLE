import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { verifyAccessToken } from '../lib/auth.js';

async function authPluginImpl(app: FastifyInstance) {
  app.decorate('authenticate', async (req: any, reply: any) => {
    try {
      const header = req.headers['authorization'] || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : '';
      if (!token) return reply.code(401).send({ message: 'Missing token' });
      const payload = verifyAccessToken(token);
      req.user = { id: payload.sub, role: payload.role };
    } catch {
      return reply.code(401).send({ message: 'Invalid token' });
    }
  });

  app.decorate('authorizeRole', (role: 'ADMIN' | 'EDITOR' | 'USER') => {
    return async (req: any, reply: any) => {
      const order = { USER: 1, EDITOR: 2, ADMIN: 3 } as const;
      const userRole: 'USER' | 'EDITOR' | 'ADMIN' = req.user?.role || 'USER';
      if (order[userRole] < order[role]) {
        return reply.code(403).send({ message: 'Forbidden' });
      }
    };
  });
}

export const authPlugin = fp(authPluginImpl, {
  name: 'auth-plugin'
});

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: any, reply: any) => Promise<void>;
    authorizeRole: (role: 'ADMIN' | 'EDITOR' | 'USER') => (req: any, reply: any) => Promise<void>;
  }
}






