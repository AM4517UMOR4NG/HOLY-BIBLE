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

  // In-memory cache for Indonesian Bible chapters (0ms response on cache hit)
  const indoCache = new Map<string, any>();

  const BOOK_MAP_ID: Record<string, string> = {
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

  const parseSabdaXml = (xml: string, fallbackName: string, bookCode: string, chapterNum: number) => {
    const verses: any[] = [];
    const nameMatch = xml.match(/<book\s+name="([^"]+)"/);
    const resolvedName = nameMatch ? nameMatch[1] : fallbackName;

    const verseRegex = /<verse>(.*?)<\/verse>/gs;
    let match;
    while ((match = verseRegex.exec(xml)) !== null) {
      const verseContent = match[1];
      const numMatch = verseContent.match(/<number>(\d+)<\/number>/);
      const textMatch = verseContent.match(/<text>(.*?)<\/text>/s);
      if (numMatch && textMatch) {
        verses.push({
          book_id: bookCode.toUpperCase(),
          book_name: resolvedName,
          chapter: chapterNum,
          verse: parseInt(numMatch[1], 10),
          text: textMatch[1].trim()
        });
      }
    }

    if (verses.length === 0) return null;

    return {
      reference: `${resolvedName} ${chapterNum}`,
      verses,
      text: verses.map((v: any) => v.text).join(' '),
      translation_id: 'tb',
      translation_name: 'Terjemahan Baru (Indonesian)',
      translation_note: 'Indonesian Bible via SABDA API'
    };
  };

  // Indonesian Bible proxy helper
  const handleIndoBible = async (book: string, chapter: string | number, reply: any) => {
    try {
      const cleanBook = (book || '').toLowerCase().trim();
      const chapterNum = Number(chapter);
      if (!cleanBook || isNaN(chapterNum) || chapterNum <= 0) {
        return reply.code(400).send({ message: 'Invalid book or chapter parameter' });
      }

      const indoName = BOOK_MAP_ID[cleanBook] || Object.values(BOOK_MAP_ID).find(n => n.toLowerCase() === cleanBook) || book;
      const cacheKey = `${cleanBook}_${chapterNum}`;

      // 1. In-memory server cache (0ms instant return)
      const cached = indoCache.get(cacheKey);
      if (cached) {
        reply.header('Cache-Control', 'public, max-age=86400');
        reply.header('X-Cache-Status', 'HIT');
        return cached;
      }

      // 2. High-speed SABDA API (~200-350ms vs Beeble 3500ms)
      try {
        const sabdaUrl = `https://alkitab.sabda.org/api/passage.php?passage=${encodeURIComponent(indoName)}+${chapterNum}&ver=tb`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const sabdaRes = await fetch(sabdaUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (sabdaRes.ok) {
          const xml = await sabdaRes.text();
          const parsed = parseSabdaXml(xml, indoName, cleanBook, chapterNum);
          if (parsed && parsed.verses.length > 0) {
            indoCache.set(cacheKey, parsed);
            reply.header('Cache-Control', 'public, max-age=86400');
            reply.header('X-Cache-Status', 'MISS-SABDA');
            return parsed;
          }
        }
      } catch (sabdaErr: any) {
        console.warn('⚠️ Direct SABDA fetch failed, trying Beeble fallback:', sabdaErr?.message);
      }

      // 3. Fallback to Beeble API
      try {
        const beebleUrl = `https://beeble.vercel.app/api/v1/passage/${encodeURIComponent(indoName)}/${chapterNum}`;
        const beebleRes = await fetch(beebleUrl);
        if (beebleRes.ok) {
          const json: any = await beebleRes.json();
          const verses = (json?.data?.verses || [])
            .filter((v: any) => v.type === 'content')
            .map((v: any) => ({
              book_id: cleanBook.toUpperCase(),
              book_name: json?.data?.book?.name || indoName,
              chapter: chapterNum,
              verse: v.verse,
              text: v.content
            }));

          if (verses.length > 0) {
            const payload = {
              reference: `${json?.data?.book?.name || indoName} ${chapterNum}`,
              verses,
              text: verses.map((v: any) => v.text).join(' '),
              translation_id: 'tb',
              translation_name: 'Terjemahan Baru (Indonesian)',
              translation_note: 'Indonesian Bible via Beeble API'
            };
            indoCache.set(cacheKey, payload);
            reply.header('Cache-Control', 'public, max-age=86400');
            reply.header('X-Cache-Status', 'MISS-BEEBLE');
            return payload;
          }
        }
      } catch (beebleErr: any) {
        console.error('❌ Beeble fallback failed:', beebleErr?.message);
      }

      return reply.code(502).send({ message: 'Failed to fetch Indonesian Bible' });
    } catch (err: any) {
      return reply.code(500).send({ message: 'Internal error', error: err?.message });
    }
  };

  // Indonesian Bible proxy (Terjemahan Baru) via Beeble API
  // GET /v1/id-bible/:book/:chapter
  app.get('/v1/id-bible/:book/:chapter', async (req: any, reply) => {
    const { book, chapter } = req.params as { book: string; chapter: string };
    return handleIndoBible(book, chapter, reply);
  });

  // GET /api/indo-bible?book=gen&chapter=1 (compatible with Vercel serverless format)
  app.get('/api/indo-bible', async (req: any, reply) => {
    const { book, chapter } = req.query as { book: string; chapter: string };
    return handleIndoBible(book, chapter, reply);
  });
}






