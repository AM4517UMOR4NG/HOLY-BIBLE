const serverlessCache = new Map();

function parseSabdaXml(xml, fallbackName, bookCode, chapterNum) {
  const verses = [];
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
        chapter: parseInt(chapterNum, 10),
        verse: parseInt(numMatch[1], 10),
        text: textMatch[1].trim()
      });
    }
  }

  if (verses.length === 0) return null;

  return {
    reference: `${resolvedName} ${chapterNum}`,
    verses,
    text: verses.map(v => v.text).join(' '),
    translation_id: 'tb',
    translation_name: 'Terjemahan Baru (Indonesian)',
    translation_note: 'Indonesian Bible via SABDA API'
  };
}

const bookMap = {
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

// Indonesian Bible API - ESM for Vercel Serverless
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Enable Vercel Edge caching for faster response times
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');

  // Handle OPTIONS for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get query params from URL
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const book = url.searchParams.get('book');
    const chapter = url.searchParams.get('chapter');

    if (!book || !chapter) {
      return res.status(400).json({
        success: false,
        message: 'Missing book or chapter parameter'
      });
    }

    const cleanBook = book.toLowerCase().trim();
    const chapterNum = parseInt(chapter, 10);
    const indonesianBook = bookMap[cleanBook] || Object.values(bookMap).find(n => n.toLowerCase() === cleanBook) || book;

    const cacheKey = `${cleanBook}_${chapterNum}`;
    const cached = serverlessCache.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    // 1. Try SABDA API directly (~200-350ms)
    try {
      const sabdaUrl = `https://alkitab.sabda.org/api/passage.php?passage=${encodeURIComponent(indonesianBook)}+${chapterNum}&ver=tb`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const sabdaRes = await fetch(sabdaUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (sabdaRes.ok) {
        const xml = await sabdaRes.text();
        const parsed = parseSabdaXml(xml, indonesianBook, cleanBook, chapterNum);
        if (parsed && parsed.verses.length > 0) {
          serverlessCache.set(cacheKey, parsed);
          return res.status(200).json(parsed);
        }
      }
    } catch (sabdaErr) {
      console.warn('SABDA fetch failed, trying Beeble fallback:', sabdaErr.message);
    }

    // 2. Fallback to Beeble API
    const beebleUrl = `https://beeble.vercel.app/api/v1/passage/${encodeURIComponent(indonesianBook)}/${chapterNum}?ver=tb`;
    const response = await fetch(beebleUrl);

    if (!response.ok) {
      throw new Error(`Beeble API returned ${response.status}`);
    }

    const data = await response.json();

    // Transform response to our format
    const verses = (data?.data?.verses || [])
      .filter(v => v.type === 'content')
      .map(v => ({
        book_id: book.toUpperCase(),
        book_name: data?.data?.book?.name,
        chapter: chapterNum,
        verse: v.verse,
        text: v.content
      }));

    const payload = {
      reference: `${data?.data?.book?.name} ${chapterNum}`,
      verses,
      text: verses.map(v => v.text).join(' '),
      translation_id: 'tb',
      translation_name: 'Terjemahan Baru (Indonesian)',
      translation_note: 'Indonesian Bible from Beeble API'
    };

    serverlessCache.set(cacheKey, payload);
    return res.status(200).json(payload);

  } catch (error) {
    console.error('Indonesian Bible API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch Indonesian Bible',
      error: error.message
    });
  }
};
