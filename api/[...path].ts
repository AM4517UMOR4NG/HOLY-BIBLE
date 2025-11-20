import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildApp } from '../dist/app.js';

let app: Awaited<ReturnType<typeof buildApp>> | null = null;

async function getApp() {
  if (!app) {
    app = await buildApp();
    await app.ready();
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const fastify = await getApp();
    
    // Strip /api prefix from URL since Fastify routes don't include it
    let url = req.url || '/';
    if (url.startsWith('/api')) {
      url = url.substring(4); // Remove '/api'
    }
    if (!url.startsWith('/')) {
      url = '/' + url;
    }
    
    // Forward the request to Fastify
    await fastify.inject({
      method: req.method as any,
      url,
      headers: req.headers as Record<string, string>,
      payload: req.body,
    }).then((fastifyResponse) => {
      // Set status code
      res.status(fastifyResponse.statusCode);
      
      // Set headers
      Object.entries(fastifyResponse.headers).forEach(([key, value]) => {
        if (value !== undefined) {
          res.setHeader(key, value);
        }
      });
      
      // Send response
      res.send(fastifyResponse.body);
    });
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
