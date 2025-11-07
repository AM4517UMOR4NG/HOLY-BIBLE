import { prisma } from '../lib/prisma.js';
import { ImportJSONSchema } from '../schemas/index.js';
import { verseChecksum } from '../utils/checksum.js';

export type ImportJSON = typeof ImportJSONSchema._type;

export async function importFromJson(payload: unknown): Promise<{ versionId: string; totalVerses: number; }> {
  const data = ImportJSONSchema.parse(payload);
  const version = await prisma.bibleVersion.upsert({
    where: { code: data.versionCode },
    update: { title: data.title, language: data.language, description: data.description ?? undefined, importedAt: new Date() },
    create: { code: data.versionCode, title: data.title, language: data.language, description: data.description }
  });

  // Clear existing books if any (idempotent import strategy)
  await prisma.book.deleteMany({ where: { bibleVersionId: version.id } });

  let verseCount = 0;
  for (const book of data.books) {
    const bookRec = await prisma.book.create({ data: { bibleVersionId: version.id, name: book.name, order: book.order } });
    for (const chapter of book.chapters) {
      const chapterRec = await prisma.chapter.create({ data: { bookId: bookRec.id, number: chapter.number } });
      const versesData = chapter.verses.map(v => ({
        chapterId: chapterRec.id,
        number: v.number,
        text: v.text,
        checksum: verseChecksum(v.text, chapter.number, v.number)
      }));
      await prisma.verse.createMany({ data: versesData });
      verseCount += versesData.length;
    }
  }
  return { versionId: version.id, totalVerses: verseCount };
}




