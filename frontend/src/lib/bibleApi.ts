// Bible API Integration
// Using Bible API from https://bible-api.com/
// Indonesian Bible uses backend proxy to Beeble API (via Fastify backend)
// Portuguese Bible uses bible-api.com with Almeida translation

interface BibleVerse {
  book_name: string
  chapter: number
  verse: number
  text: string
}

interface BibleChapter {
  reference: string
  verses: BibleVerse[]
  text: string
  translation_id: string
  translation_name: string
  translation_note: string
}

// ==================== PERSISTENT CLIENT-SIDE CACHE ====================
const CACHE_SIZE = 150;
const STORAGE_PREFIX = 'bible_ch_v2_';
const STORAGE_KEYS_LIST = 'bible_ch_keys_v2';
const MAX_STORAGE_ITEMS = 60;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const chapterCache = new Map<string, CacheEntry<BibleChapter>>();
const verseCache = new Map<string, BibleVerse>();
const searchCache = new Map<string, any>();

function getCacheKey(book: string, chapter: number, lang: string): string {
  return `${book.toLowerCase()}-${chapter}-${lang || 'en'}`;
}

function getFromCache(key: string): BibleChapter | null {
  // 1. Memory cache (0ms)
  const cached = chapterCache.get(key);
  if (cached) {
    return cached.data;
  }

  // 2. Persistent localStorage cache (survives page reloads & closes)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.data) {
          chapterCache.set(key, { data: parsed.data, timestamp: parsed.timestamp || Date.now() });
          return parsed.data;
        }
      }
    } catch (e) {
      // ignore storage access error
    }
  }

  return null;
}

function setCache(key: string, data: BibleChapter): void {
  // 1. Memory cache
  if (chapterCache.size >= CACHE_SIZE) {
    const firstKey = chapterCache.keys().next().value;
    if (firstKey) chapterCache.delete(firstKey);
  }
  chapterCache.set(key, { data, timestamp: Date.now() });

  // 2. Persistent storage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify({ data, timestamp: Date.now() }));
      
      // Maintain LRU keys list
      let keys: string[] = [];
      const rawKeys = localStorage.getItem(STORAGE_KEYS_LIST);
      if (rawKeys) {
        try { keys = JSON.parse(rawKeys); } catch {}
      }
      keys = keys.filter(k => k !== key);
      keys.push(key);
      while (keys.length > MAX_STORAGE_ITEMS) {
        const evict = keys.shift();
        if (evict) localStorage.removeItem(STORAGE_PREFIX + evict);
      }
      localStorage.setItem(STORAGE_KEYS_LIST, JSON.stringify(keys));
    } catch (e) {
      // If storage quota exceeded, clear half of cached chapters
      try {
        const rawKeys = localStorage.getItem(STORAGE_KEYS_LIST);
        if (rawKeys) {
          const keys: string[] = JSON.parse(rawKeys);
          const evictCount = Math.ceil(keys.length / 2);
          for (let i = 0; i < evictCount; i++) {
            localStorage.removeItem(STORAGE_PREFIX + keys[i]);
          }
          localStorage.setItem(STORAGE_KEYS_LIST, JSON.stringify(keys.slice(evictCount)));
        }
      } catch {}
    }
  }
}

// Synchronous chapter getter for instant initial rendering
export function getCachedBibleChapter(book: string, chapter: number, language?: string): BibleChapter | null {
  const key = getCacheKey(book, chapter, language || 'en');
  return getFromCache(key);
}

// Prefetch adjacent chapters in background
export function prefetchAdjacentChapters(bookAbbr: string, chapter: number, maxChapters: number, language?: string): void {
  const lang = language || 'en';

  // Prefetch next chapter
  if (chapter < maxChapters) {
    const nextKey = getCacheKey(bookAbbr, chapter + 1, lang);
    if (!getFromCache(nextKey)) {
      getBibleChapter(bookAbbr, chapter + 1, language).catch(() => { });
    }
  }

  // Prefetch previous chapter
  if (chapter > 1) {
    const prevKey = getCacheKey(bookAbbr, chapter - 1, lang);
    if (!getFromCache(prevKey)) {
      getBibleChapter(bookAbbr, chapter - 1, language).catch(() => { });
    }
  }
}

// ==================== END CACHE ====================

const BIBLE_API_BASE = 'https://bible-api.com'

// Auto-detect API URL based on current location
const getBackendUrl = () => {
  // If VITE_API_URL is set, use it
  if ((import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL;
  }

  // If running on Vercel (production), use same domain
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return window.location.origin;
  }

  // Default to localhost for development
  return 'http://localhost:4000';
}

// Get translation code based on language
function getTranslation(language?: string): string {
  // Available translations in bible-api.com:
  // - kjv: King James Version
  // - web: World English Bible (default)
  // - clementine: Clementine Latin Vulgate
  // - almeida: João Ferreira de Almeida (Portuguese)
  // - rccv: Romanian Corrected Cornilescu Version

  switch (language) {
    case 'pt':
      return 'almeida'  // Portuguese - João Ferreira de Almeida
    case 'en':
    default:
      return 'kjv'  // King James Version (English)
  }
}

export async function getBibleChapter(book: string, chapter: number, language?: string): Promise<BibleChapter | null> {
  const cacheKey = getCacheKey(book, chapter, language || 'en');

  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    console.log(`🔍 getBibleChapter called:`, { book, chapter, language })
    const BACKEND_API = getBackendUrl()
    console.log(`📍 Using backend API:`, BACKEND_API)

    // Indonesian Bible: Try backend proxy first, fallback to English
    // Indonesian Bible: Try backend proxy first, fallback to English
    if (language === 'id') {
      console.log('📖 [INDONESIAN] Fetching via backend API...')
      
      // Try /api/indo-bible query format
      let response = await fetch(`${BACKEND_API}/api/indo-bible?book=${encodeURIComponent(book)}&chapter=${chapter}`, {
        headers: { 'Accept': 'application/json' },
        mode: 'cors'
      }).catch(() => null)

      // Fallback: try /v1/id-bible/:book/:chapter route format
      if (!response || !response.ok) {
        response = await fetch(`${BACKEND_API}/v1/id-bible/${encodeURIComponent(book)}/${chapter}`, {
          headers: { 'Accept': 'application/json' },
          mode: 'cors'
        }).catch(() => null)
      }

      if (response && response.ok) {
        const data = await response.json()
        console.log('✅ [INDONESIAN] Alkitab loaded successfully!')
        setCache(cacheKey, data);
        return data
      }

      console.warn('⚠️ [INDONESIAN] Backend unavailable, trying direct Beeble API...')
      // Direct Beeble fallback
      const bookMap: Record<string, string> = {
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
      }
      const indoName = bookMap[book.toLowerCase()] || book
      try {
        const beebleRes = await fetch(`https://beeble.vercel.app/api/v1/passage/${encodeURIComponent(indoName)}/${chapter}`)
        if (beebleRes.ok) {
          const json = await beebleRes.json()
          const verses = (json?.data?.verses || [])
            .filter((v: any) => v.type === 'content')
            .map((v: any) => ({
              book_id: book.toUpperCase(),
              book_name: json?.data?.book?.name,
              chapter: Number(chapter),
              verse: v.verse,
              text: v.content
            }))
          const payload: BibleChapter = {
            reference: `${json?.data?.book?.name} ${chapter}`,
            verses,
            text: verses.map((v: any) => v.text).join(' '),
            translation_id: 'tb',
            translation_name: 'Terjemahan Baru (Indonesian)',
            translation_note: 'Indonesian Bible via Beeble API'
          }
          setCache(cacheKey, payload)
          return payload
        }
      } catch (beebleErr) {
        console.warn('⚠️ Beeble direct also failed, falling back to English')
      }
    }

    // Use bible-api.com for English and Portuguese (or fallback from Indonesian)
    const translation = getTranslation(language)
    console.log(`📖 Fetching from bible-api.com (${translation})...`)
    const response = await fetch(`${BIBLE_API_BASE}/${book}${chapter}?translation=${translation}`)

    if (!response.ok) {
      console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()
    console.log(`✅ Bible loaded: ${data.reference || 'Unknown'} - ${data.verses?.length || 0} verses`)
    setCache(cacheKey, data);
    return data
  } catch (error) {
    console.error('❌ Error fetching Bible chapter:', error)
    return null
  }
}

export function getCachedBibleVerse(book: string, chapter: number, verse: number, language?: string): BibleVerse | null {
  const vKey = `${book.toLowerCase()}-${chapter}-${verse}-${language || 'en'}`;
  if (verseCache.has(vKey)) return verseCache.get(vKey)!;
  try {
    const raw = localStorage.getItem('bible_vs_v2_' + vKey);
    if (raw) {
      const data = JSON.parse(raw);
      if (data) {
        verseCache.set(vKey, data);
        return data;
      }
    }
  } catch {}
  const chData = getCachedBibleChapter(book, chapter, language);
  if (chData && chData.verses) {
    const found = chData.verses.find((v: any) => v.verse === verse);
    if (found) {
      const res: BibleVerse = {
        book_name: found.book_name || chData.reference.split(' ')[0],
        chapter: Number(found.chapter || chapter),
        verse: Number(found.verse || verse),
        text: found.text
      };
      verseCache.set(vKey, res);
      return res;
    }
  }
  return null;
}

export async function getBibleVerse(book: string, chapter: number, verse: number, language?: string): Promise<BibleVerse | null> {
  const vKey = `${book.toLowerCase()}-${chapter}-${verse}-${language || 'en'}`;
  const cached = getCachedBibleVerse(book, chapter, verse, language);
  if (cached) return cached;

  try {
    if (language === 'id') {
      const chapterData = await getBibleChapter(book, chapter, 'id')
      if (chapterData && chapterData.verses && chapterData.verses.length > 0) {
        const v = chapterData.verses.find((item: any) => item.verse === verse) || chapterData.verses[0]
        const res: BibleVerse = {
          book_name: v.book_name || chapterData.reference.split(' ')[0],
          chapter: Number(v.chapter || chapter),
          verse: Number(v.verse || verse),
          text: v.text
        }
        verseCache.set(vKey, res);
        try { localStorage.setItem('bible_vs_v2_' + vKey, JSON.stringify(res)); } catch {}
        return res
      }
    }
    const translation = getTranslation(language)
    const response = await fetch(`${BIBLE_API_BASE}/${book}${chapter}:${verse}?translation=${translation}`)
    if (!response.ok) return null
    const data = await response.json()
    const result = data.verses?.[0] || null
    if (result) {
      verseCache.set(vKey, result);
      try { localStorage.setItem('bible_vs_v2_' + vKey, JSON.stringify(result)); } catch {}
    }
    return result
  } catch (error) {
    console.error('Error fetching Bible verse:', error)
    return null
  }
}

export async function searchBible(query: string, language?: string): Promise<any> {
  const sKey = `${query.trim().toLowerCase()}_${language || 'en'}`;
  if (searchCache.has(sKey)) {
    return searchCache.get(sKey);
  }
  try {
    const raw = sessionStorage.getItem('search_v2_' + sKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) {
        searchCache.set(sKey, parsed);
        return parsed;
      }
    }
  } catch {}
  try {
    const normalizedQuery = query.trim()

    // Map Indonesian book names -> abbreviation used by API (e.g., "Kejadian" -> "gen")
    const BOOK_NAME_ID: Record<string, string> = {
      gen: 'Kejadian', exo: 'Keluaran', lev: 'Imamat', num: 'Bilangan', deu: 'Ulangan',
      jos: 'Yosua', jdg: 'Hakim-hakim', rut: 'Rut', '1sa': '1 Samuel', '2sa': '2 Samuel',
      '1ki': '1 Raja-raja', '2ki': '2 Raja-raja', '1ch': '1 Tawarikh', '2ch': '2 Tawarikh',
      ezr: 'Ezra', neh: 'Nehemia', est: 'Ester', job: 'Ayub', psa: 'Mazmur', pro: 'Amsal',
      ecc: 'Pengkhotbah', sng: 'Kidung Agung', isa: 'Yesaya', jer: 'Yeremia', lam: 'Ratapan',
      ezk: 'Yehezkiel', dan: 'Daniel', hos: 'Hosea', jol: 'Yoel', amo: 'Amos', oba: 'Obaja',
      jon: 'Yunus', mic: 'Mikha', nam: 'Nahum', hab: 'Habakuk', zep: 'Zefanya', hag: 'Hagai',
      zec: 'Zakharia', mal: 'Maleakhi',
      mat: 'Matius', mrk: 'Markus', luk: 'Lukas', jhn: 'Yohanes', act: 'Kisah Para Rasul',
      rom: 'Roma', '1co': '1 Korintus', '2co': '2 Korintus', gal: 'Galatia', eph: 'Efesus',
      php: 'Filipi', col: 'Kolose', '1th': '1 Tesalonika', '2th': '2 Tesalonika',
      '1ti': '1 Timotius', '2ti': '2 Timotius', tit: 'Titus', phm: 'Filemon', heb: 'Ibrani',
      jas: 'Yakobus', '1pe': '1 Petrus', '2pe': '2 Petrus', '1jn': '1 Yohanes', '2jn': '2 Yohanes',
      '3jn': '3 Yohanes', jud: 'Yudas', rev: 'Wahyu'
    }
    const ID_NAME_TO_ABBR: Record<string, string> = Object.fromEntries(
      Object.entries(BOOK_NAME_ID).map(([abbr, idName]) => [idName.toLowerCase(), abbr])
    )
    const EN_NAME_TO_ABBR: Record<string, string> = Object.fromEntries(
      BIBLE_BOOKS.map(b => [b.name.toLowerCase(), b.abbr])
    )

    const cacheAndReturn = (res: any) => {
      if (res) {
        searchCache.set(sKey, res);
        try { sessionStorage.setItem('search_v2_' + sKey, JSON.stringify(res)); } catch {}
      }
      return res;
    }

    // Special Indonesian reference check: e.g. "Yohanes 3:16" or "Mazmur 23"
    if (language === 'id') {
      const match = normalizedQuery.match(/^([0-9]?\s*[a-zA-Z\s]+?)\s+(\d+)(?::(\d+))?$/)
      if (match) {
        const bookNameRaw = match[1].trim().toLowerCase()
        const chapterNum = parseInt(match[2], 10)
        const verseNum = match[3] ? parseInt(match[3], 10) : null

        const abbr = ID_NAME_TO_ABBR[bookNameRaw] || EN_NAME_TO_ABBR[bookNameRaw]
        if (abbr) {
          const chapterData = await getBibleChapter(abbr, chapterNum, 'id')
          if (chapterData && chapterData.verses && chapterData.verses.length > 0) {
            const matchingVerses = verseNum 
              ? chapterData.verses.filter((v: any) => v.verse === verseNum)
              : chapterData.verses

            if (matchingVerses.length > 0) {
              return cacheAndReturn({
                ...chapterData,
                reference: verseNum ? `${matchingVerses[0].book_name} ${chapterNum}:${verseNum}` : chapterData.reference,
                verses: matchingVerses
              })
            }
          }
        }
      }
    }

    const prepareQueryForApi = (q: string): string => {
      let result = q.trim()
      for (const [idName, abbr] of Object.entries(ID_NAME_TO_ABBR)) {
        const regex = new RegExp(`^${idName}\\b`, 'i')
        if (regex.test(result)) {
          result = result.replace(regex, abbr)
          break
        }
      }
      return result
    }

    const queryForApi = prepareQueryForApi(normalizedQuery)
    const translation = getTranslation(language)

    // Strategy 1: Try direct verse reference via bible-api.com
    try {
      const response = await fetch(`${BIBLE_API_BASE}/${encodeURIComponent(queryForApi)}?translation=${translation}`)
      if (response.ok) {
        const data = await response.json()
        if (data.verses && data.verses.length > 0) {
          return cacheAndReturn(data)
        }
      }
    } catch (e) {
      console.log('Not a verse reference, trying other strategies...')
    }

    // Strategy 2: Check if it's a book name (e.g., "Revelation", "Genesis", "Kejadian")
    const lowerQ = normalizedQuery.toLowerCase()
    const bookMatch = BIBLE_BOOKS.find(book => {
      const idName = Object.entries(BOOK_NAME_ID).find(([abbr]) => abbr === book.abbr)?.[1]
      return book.name.toLowerCase() === lowerQ ||
        book.abbr.toLowerCase() === lowerQ ||
        (idName ? idName.toLowerCase() === lowerQ : false)
    })

    if (bookMatch) {
      if (language === 'id') {
        const data = await getBibleChapter(bookMatch.abbr, 1, 'id')
        if (data && data.verses) return cacheAndReturn(data)
      }
      try {
        const response = await fetch(`${BIBLE_API_BASE}/${bookMatch.abbr}1?translation=${translation}`)
        if (response.ok) {
          const data = await response.json()
          if (data.verses && data.verses.length > 0) {
            return cacheAndReturn({
              ...data,
              reference: `${bookMatch.name} Chapter 1`
            })
          }
        }
      } catch (e) {
        console.error('Error fetching book:', e)
      }
    }

    // Strategy 3: Keyword search in popular passages
    if (language === 'id') {
      const popularPassages = [
        { abbr: 'jhn', chapter: 3 },
        { abbr: 'psa', chapter: 23 },
        { abbr: 'rom', chapter: 8 },
        { abbr: 'php', chapter: 4 },
        { abbr: 'gen', chapter: 1 },
        { abbr: 'isa', chapter: 41 }
      ]
      const results = await Promise.all(
        popularPassages.map(async (p) => {
          const data = await getBibleChapter(p.abbr, p.chapter, 'id')
          if (data && data.verses) {
            const matches = data.verses.filter((v: any) =>
              v.text.toLowerCase().includes(lowerQ) ||
              (v.book_name && v.book_name.toLowerCase().includes(lowerQ))
            )
            return matches.length > 0 ? { ...data, verses: matches } : null
          }
          return null
        })
      )
      const valid = results.filter(Boolean) as any[]
      if (valid.length > 0) {
        const allVerses = valid.flatMap(r => r.verses)
        return cacheAndReturn({
          verses: allVerses,
          text: allVerses.map((v: any) => v.text).join(' '),
          reference: `Hasil pencarian untuk "${normalizedQuery}"`
        })
      }
    } else {
      const searchVerses = [
        'John 3:16', 'Genesis 1:1', 'Psalm 23:1', 'Romans 8:28',
        'Philippians 4:13', 'Jeremiah 29:11', 'Proverbs 3:5-6',
        '1 Corinthians 13:4-8', 'Isaiah 40:31', 'Psalm 119:105'
      ]
      const results = await Promise.all(
        searchVerses.map(async (ref) => {
          try {
            const res = await fetch(`${BIBLE_API_BASE}/${encodeURIComponent(ref)}?translation=${translation}`)
            if (res.ok) {
              const data = await res.json()
              if (data.verses) {
                const matchingVerses = data.verses.filter((v: any) =>
                  v.text.toLowerCase().includes(lowerQ) ||
                  v.book_name.toLowerCase().includes(lowerQ)
                )
                if (matchingVerses.length > 0) {
                  return { ...data, verses: matchingVerses }
                }
              }
            }
          } catch (e) {
            return null
          }
          return null
        })
      )
      const validResults = results.filter(Boolean) as any[]
      if (validResults.length > 0) {
        const allVerses = validResults.flatMap(r => r.verses)
        return cacheAndReturn({
          verses: allVerses,
          text: allVerses.map((v: any) => v.text).join(' '),
          reference: `Search results for "${normalizedQuery}"`
        })
      }
    }

    console.log('No results found')
    return null
  } catch (error) {
    console.error('Error searching Bible:', error)
    return null
  }
}

// List of all Bible books
export const BIBLE_BOOKS = [
  // Old Testament
  { name: 'Genesis', abbr: 'gen', chapters: 50, testament: 'Old' },
  { name: 'Exodus', abbr: 'exo', chapters: 40, testament: 'Old' },
  { name: 'Leviticus', abbr: 'lev', chapters: 27, testament: 'Old' },
  { name: 'Numbers', abbr: 'num', chapters: 36, testament: 'Old' },
  { name: 'Deuteronomy', abbr: 'deu', chapters: 34, testament: 'Old' },
  { name: 'Joshua', abbr: 'jos', chapters: 24, testament: 'Old' },
  { name: 'Judges', abbr: 'jdg', chapters: 21, testament: 'Old' },
  { name: 'Ruth', abbr: 'rut', chapters: 4, testament: 'Old' },
  { name: '1 Samuel', abbr: '1sa', chapters: 31, testament: 'Old' },
  { name: '2 Samuel', abbr: '2sa', chapters: 24, testament: 'Old' },
  { name: '1 Kings', abbr: '1ki', chapters: 22, testament: 'Old' },
  { name: '2 Kings', abbr: '2ki', chapters: 25, testament: 'Old' },
  { name: '1 Chronicles', abbr: '1ch', chapters: 29, testament: 'Old' },
  { name: '2 Chronicles', abbr: '2ch', chapters: 36, testament: 'Old' },
  { name: 'Ezra', abbr: 'ezr', chapters: 10, testament: 'Old' },
  { name: 'Nehemiah', abbr: 'neh', chapters: 13, testament: 'Old' },
  { name: 'Esther', abbr: 'est', chapters: 10, testament: 'Old' },
  { name: 'Job', abbr: 'job', chapters: 42, testament: 'Old' },
  { name: 'Psalms', abbr: 'psa', chapters: 150, testament: 'Old' },
  { name: 'Proverbs', abbr: 'pro', chapters: 31, testament: 'Old' },
  { name: 'Ecclesiastes', abbr: 'ecc', chapters: 12, testament: 'Old' },
  { name: 'Song of Solomon', abbr: 'sng', chapters: 8, testament: 'Old' },
  { name: 'Isaiah', abbr: 'isa', chapters: 66, testament: 'Old' },
  { name: 'Jeremiah', abbr: 'jer', chapters: 52, testament: 'Old' },
  { name: 'Lamentations', abbr: 'lam', chapters: 5, testament: 'Old' },
  { name: 'Ezekiel', abbr: 'ezk', chapters: 48, testament: 'Old' },
  { name: 'Daniel', abbr: 'dan', chapters: 12, testament: 'Old' },
  { name: 'Hosea', abbr: 'hos', chapters: 14, testament: 'Old' },
  { name: 'Joel', abbr: 'jol', chapters: 3, testament: 'Old' },
  { name: 'Amos', abbr: 'amo', chapters: 9, testament: 'Old' },
  { name: 'Obadiah', abbr: 'oba', chapters: 1, testament: 'Old' },
  { name: 'Jonah', abbr: 'jon', chapters: 4, testament: 'Old' },
  { name: 'Micah', abbr: 'mic', chapters: 7, testament: 'Old' },
  { name: 'Nahum', abbr: 'nam', chapters: 3, testament: 'Old' },
  { name: 'Habakkuk', abbr: 'hab', chapters: 3, testament: 'Old' },
  { name: 'Zephaniah', abbr: 'zep', chapters: 3, testament: 'Old' },
  { name: 'Haggai', abbr: 'hag', chapters: 2, testament: 'Old' },
  { name: 'Zechariah', abbr: 'zec', chapters: 14, testament: 'Old' },
  { name: 'Malachi', abbr: 'mal', chapters: 4, testament: 'Old' },

  // New Testament
  { name: 'Matthew', abbr: 'mat', chapters: 28, testament: 'New' },
  { name: 'Mark', abbr: 'mrk', chapters: 16, testament: 'New' },
  { name: 'Luke', abbr: 'luk', chapters: 24, testament: 'New' },
  { name: 'John', abbr: 'jhn', chapters: 21, testament: 'New' },
  { name: 'Acts', abbr: 'act', chapters: 28, testament: 'New' },
  { name: 'Romans', abbr: 'rom', chapters: 16, testament: 'New' },
  { name: '1 Corinthians', abbr: '1co', chapters: 16, testament: 'New' },
  { name: '2 Corinthians', abbr: '2co', chapters: 13, testament: 'New' },
  { name: 'Galatians', abbr: 'gal', chapters: 6, testament: 'New' },
  { name: 'Ephesians', abbr: 'eph', chapters: 6, testament: 'New' },
  { name: 'Philippians', abbr: 'php', chapters: 4, testament: 'New' },
  { name: 'Colossians', abbr: 'col', chapters: 4, testament: 'New' },
  { name: '1 Thessalonians', abbr: '1th', chapters: 5, testament: 'New' },
  { name: '2 Thessalonians', abbr: '2th', chapters: 3, testament: 'New' },
  { name: '1 Timothy', abbr: '1ti', chapters: 6, testament: 'New' },
  { name: '2 Timothy', abbr: '2ti', chapters: 4, testament: 'New' },
  { name: 'Titus', abbr: 'tit', chapters: 3, testament: 'New' },
  { name: 'Philemon', abbr: 'phm', chapters: 1, testament: 'New' },
  { name: 'Hebrews', abbr: 'heb', chapters: 13, testament: 'New' },
  { name: 'James', abbr: 'jas', chapters: 5, testament: 'New' },
  { name: '1 Peter', abbr: '1pe', chapters: 5, testament: 'New' },
  { name: '2 Peter', abbr: '2pe', chapters: 3, testament: 'New' },
  { name: '1 John', abbr: '1jn', chapters: 5, testament: 'New' },
  { name: '2 John', abbr: '2jn', chapters: 1, testament: 'New' },
  { name: '3 John', abbr: '3jn', chapters: 1, testament: 'New' },
  { name: 'Jude', abbr: 'jud', chapters: 1, testament: 'New' },
  { name: 'Revelation', abbr: 'rev', chapters: 22, testament: 'New' },
]
