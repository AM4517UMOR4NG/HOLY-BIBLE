import { Worker, Job } from 'bullmq';
import { connection } from '../queues/connection.js';
import { ImportVersionJobData } from '../jobs/types.js';
import { prisma } from '../lib/prisma.js';
import { importFromJson } from '../services/importer.js';
import { indexQueue } from '../jobs/queues.js';

async function handle(job: Job<ImportVersionJobData>) {
  job.updateProgress(5);
  const { versionCode, jsonPayload } = job.data;
  if (jsonPayload) {
    const res = await importFromJson(jsonPayload);
    job.updateProgress(80);
    await indexQueue.add('index', { versionCode });
    job.updateProgress(100);
    return;
  }
  await prisma.bibleVersion.upsert({
    where: { code: versionCode },
    update: { importedAt: new Date() },
    create: { code: versionCode, title: versionCode, language: 'und' }
  });
  job.updateProgress(100);
}

export const importWorker = new Worker<ImportVersionJobData>('import-version', handle, {
  connection,
  concurrency: 2
});


