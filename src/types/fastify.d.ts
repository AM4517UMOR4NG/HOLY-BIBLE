import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      role: 'USER' | 'EDITOR' | 'ADMIN';
    };
  }
}





