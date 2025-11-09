import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';

export function registerBibleRoutes(app: FastifyInstance) {
  app.get('/v1/versions', async () => {
    const versions = await prisma.bibleVersion.findMany({ orderBy: { createdAt: 'desc' } });
    return versions;
  });

  app.post('/v1/versions', async (_req, reply) => {
    return reply.code(501).send({ message: 'Not implemented' });
  });

  app.get('/v1/versions/:versionCode/books', async (req: any, reply) => {
    const { versionCode } = req.params;
    const version = await prisma.bibleVersion.findUnique({ where: { code: versionCode } });
    if (!version) return reply.code(404).send({ message: 'Version not found' });
    const books = await prisma.book.findMany({ where: { bibleVersionId: version.id }, orderBy: { order: 'asc' } });
    return books;
  });

  app.get('/v1/versions/:versionCode/books/:bookId/chapters/:chapterNumber', async (req: any, reply) => {
    const { versionCode, bookId, chapterNumber } = req.params;
    const version = await prisma.bibleVersion.findUnique({ where: { code: versionCode } });
    if (!version) return reply.code(404).send({ message: 'Version not found' });
    const chapter = await prisma.chapter.findFirst({ where: { bookId, number: Number(chapterNumber) } });
    if (!chapter) return reply.code(404).send({ message: 'Chapter not found' });
    const verses = await prisma.verse.findMany({ where: { chapterId: chapter.id }, orderBy: { number: 'asc' } });
    return { id: chapter.id, number: chapter.number, verses };
  });

  app.get('/v1/versions/:versionCode/books/:bookId/chapters/:chapterNumber/verses/:verseNumber', async (req: any, reply) => {
    const { bookId, chapterNumber, verseNumber } = req.params;
    const chapter = await prisma.chapter.findFirst({ where: { bookId, number: Number(chapterNumber) } });
    if (!chapter) return reply.code(404).send({ message: 'Chapter not found' });
    const verse = await prisma.verse.findFirst({ where: { chapterId: chapter.id, number: Number(verseNumber) } });
    if (!verse) return reply.code(404).send({ message: 'Verse not found' });
    return verse;
  });

  // Indonesian Bible proxy (Terjemahan Baru) via Beeble API
  // GET /v1/id-bible/:book/:chapter
  // :book uses English abbreviation like 'gen', 'jhn', etc.
  app.get('/v1/id-bible/:book/:chapter', async (req: any, reply) => {
    try {
      const { book, chapter } = req.params as { book: string; chapter: string };

      // Map English abbreviations to Indonesian names expected by Beeble
      const map: Record<string, string> = {
        gen: 'Kejadian', exo: 'Keluaran', lev: 'Imamat', num: 'Bilangan', deu: 'Ulangan',
        jos: 'Yosua', jdg: 'Hakim-hakim', rut: 'Rut', '1sa': '1 Samuel', '2sa': '2 Samuel',
        '1ki': '1 Raja-raja', '2ki': '2 Raja-raja', '1ch': '1 Tawarikh', '2ch': '2 Tawarikh',
        ezr: 'Ezra', neh: 'Nehemia', est: 'Ester', job: 'Ayub', psa: 'Mazmur', pro: 'Amsal',
        ecc: 'Pengkhotbah', sng: 'Kidung Agung', isa: 'Yesaya', jer: 'Yeremia', lam: 'Ratapan',
        ezk: 'Yehezkiel', dan: 'Daniel', hos: 'Hosea', jol: 'Yoel', amo: 'Amos', oba: 'Obaja',
        jon: 'Yunus', mic: 'Mikha', nam: 'Nahum', hab: 'Habakuk', zep: 'Zefanya', hag: 'Hagai',
        zec: 'Zakharia', mal: 'Maleakhi', mat: 'Matius', mrk: 'Markus', luk: 'Lukas', jhn: 'Yohanes',
        act: 'Kisah Para Rasul', rom: 'Roma', '1co': '1 Korintus', '2co': '2 Korintus', gal: 'Galatia',
        eph: 'Efesus', php: 'Filipi', col: 'Kolose', '1th': '1 Tesalonika', '2th': '2 Tesalonika',
        '1ti': '1 Timotius', '2ti': '2 Timotius', tit: 'Titus', phm: 'Filemon', heb: 'Ibrani',
        jas: 'Yakobus', '1pe': '1 Petrus', '2pe': '2 Petrus', '1jn': '1 Yohanes', '2jn': '2 Yohanes',
        '3jn': '3 Yohanes', jud: 'Yudas', rev: 'Wahyu'
      };

      const indoName = map[(book || '').toLowerCase()];
      if (!indoName) return reply.code(400).send({ message: 'Unsupported book code' });

      const url = `https://beeble.vercel.app/api/v1/passage/${encodeURIComponent(indoName)}/${Number(chapter)}`;
      const res = await fetch(url);
      if (!res.ok) {
        return reply.code(502).send({ message: 'Failed to fetch Indonesian Bible' });
      }
      const json: any = await res.json();

      const verses = (json?.data?.verses || [])
        .filter((v: any) => v.type === 'content')
        .map((v: any) => ({
          book_id: book.toUpperCase(),
          book_name: json?.data?.book?.name,
          chapter: json?.data?.book?.chapter,
          verse: v.verse,
          text: v.content
        }));

      const payload = {
        reference: `${json?.data?.book?.name} ${json?.data?.book?.chapter}`,
        verses,
        text: verses.map((v: any) => v.text).join(' '),
        translation_id: 'tb',
        translation_name: 'Terjemahan Baru (Indonesian)',
        translation_note: 'Indonesian Bible via Beeble API'
      };

      return payload;
    } catch (err: any) {
      return reply.code(500).send({ message: 'Internal error', error: err?.message });
    }
  });
}





