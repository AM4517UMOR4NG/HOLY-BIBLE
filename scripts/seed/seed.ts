import fs from 'fs';
import path from 'path';
import { importFromJson } from '../../src/services/importer.js';
import { indexQueue } from '../../src/jobs/queues.js';

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error('Usage: ts-node scripts/seed/seed.ts <file.json>');
  const json = JSON.parse(fs.readFileSync(path.resolve(file), 'utf-8'));
  const res = await importFromJson(json);
  await indexQueue.add('index', { versionCode: json.versionCode });
  console.log('Imported', res);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});





