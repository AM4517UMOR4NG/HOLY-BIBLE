import { Worker, Job } from 'bullmq';
import { connection } from '../queues/connection.js';
import { IndexVersesJobData } from '../jobs/types.js';
import { prisma } from '../lib/prisma.js';
import { versesIndex } from '../lib/meili.js';

async function handle(job: Job<IndexVersesJobData>) {
  job.updateProgress(5);
  const { versionCode, verseIds } = job.data;
  const where = verseIds?.length ? { id: { in: verseIds } } : {};
  const verses = await prisma.verse.findMany({
    where,
    include: { chapter: { include: { book: { include: { bibleVersion: true } } } } }
  });
  const docs = verses.map(v => ({
    id: `verse-${v.id}`,
    versionCode: versionCode || v.chapter.book.bibleVersion.code,
    book: v.chapter.book.name,
    chapter: v.chapter.number,
    verse: v.number,
    text: v.text,
    language: v.chapter.book.bibleVersion.language || 'und'
  }));
  if (docs.length) {
    await versesIndex().addDocuments(docs, { primaryKey: 'id' });
  }
  job.updateProgress(100);
}

export const indexWorker = new Worker<IndexVersesJobData>('index-verses', handle, {
  connection,
  concurrency: 4
});


