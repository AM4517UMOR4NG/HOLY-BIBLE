import { MeiliSearch } from 'meilisearch';

const host = process.env.MEILI_HOST || 'http://localhost:7700';
const apiKey = process.env.MEILI_API_KEY || '';

export const meili = new MeiliSearch({ host, apiKey });

export const versesIndex = () => meili.index('verses');

export async function ensureMeiliIndexes() {
  const index = versesIndex();
  try {
    await index.getRawInfo();
  } catch {
    await meili.createIndex('verses', { primaryKey: 'id' });
  }
  await index.updateSettings({
    searchableAttributes: ['text', 'book'],
    filterableAttributes: ['versionCode', 'language', 'book', 'chapter']
  });
}


