import { buildApp } from './app.js';
// import './workers/importWorker.js';
// import './workers/indexWorker.js';
// import { ensureMeiliIndexes } from './lib/meili.js';

const server = await buildApp();

const port = Number(process.env.PORT || 4000);
try {
  // await ensureMeiliIndexes(); // Disabled - Meilisearch not available
  await server.listen({ port, host: '0.0.0.0' });
  server.log.info(`Server listening on ${port}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}


