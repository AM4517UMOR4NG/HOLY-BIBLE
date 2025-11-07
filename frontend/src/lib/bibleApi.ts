// Bible API Integration
// Using Bible API from https://bible-api.com/
// Indonesian Bible is fetched via our backend proxy to Beeble API

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

const BIBLE_API_BASE = 'https://bible-api.com'
const BACKEND_BASE: string = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'

// Get translation code based on language
// Note: bible-api.com only supports English translations
// For Indonesian, we use English as fallback for now
function getTranslation(_language?: string): string {
  // Available translations in bible-api.com:
  // - kjv: King James Version
  // - web: World English Bible (default)
  // - clementine: Clementine Latin Vulgate
  // - almeida: João Ferreira de Almeida (Portuguese)
  // - rccv: Romanian Corrected Cornilescu Version
  
  // Note: Indonesian (Terjemahan Baru) is not supported by this API
  // We use English as default for all languages
  return 'kjv'  // King James Version
}

export async function getBibleChapter(book: string, chapter: number, language?: string): Promise<BibleChapter | null> {
  try {
    // Use Indonesian (full Bible) through backend proxy when language is 'id'
    if (language === 'id') {
      const res = await fetch(`${BACKEND_BASE}/v1/id-bible/${book}/${chapter}`)
      if (res.ok) {
        return await res.json()
      }
      console.warn('⚠️ Gagal memuat Alkitab Indonesia dari backend, fallback ke English')
    }
    
    // Use English API for non-Indonesian or fallback
    const translation = getTranslation(language)
    const response = await fetch(`${BIBLE_API_BASE}/${book}${chapter}?translation=${translation}`)
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error('Error fetching Bible chapter:', error)
    return null
  }
}

export async function getBibleVerse(book: string, chapter: number, verse: number, language?: string): Promise<BibleVerse | null> {
  try {
    const translation = getTranslation(language)
    const response = await fetch(`${BIBLE_API_BASE}/${book}${chapter}:${verse}?translation=${translation}`)
    if (!response.ok) return null
    const data = await response.json()
    return data.verses?.[0] || null
  } catch (error) {
    console.error('Error fetching Bible verse:', error)
    return null
  }
}

export async function searchBible(query: string, language?: string): Promise<any> {
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
    
    // Normalize Indonesian queries to use abbreviations understood by API
    const prepareQueryForApi = (q: string) => {
      if (language !== 'id') return q
      const qLower = q.toLowerCase()
      // Try to match the longest Indonesian book name at the start
      const idNames = Object.keys(ID_NAME_TO_ABBR).sort((a, b) => b.length - a.length)
      for (const name of idNames) {
        if (qLower.startsWith(name)) {
          const abbr = ID_NAME_TO_ABBR[name]
          return abbr + q.slice(name.length)
        }
      }
      // Also support English names typed in Indonesian mode
      const enNames = Object.keys(EN_NAME_TO_ABBR).sort((a, b) => b.length - a.length)
      for (const name of enNames) {
        if (qLower.startsWith(name)) {
          const abbr = EN_NAME_TO_ABBR[name]
          return abbr + q.slice(name.length)
        }
      }
      return q
    }
    const queryForApi = prepareQueryForApi(normalizedQuery)
    const translation = getTranslation(language)
    
    // Strategy 1: Try direct verse reference (e.g., "John 3:16", "Genesis 1", "Psalm 23")
    try {
      const response = await fetch(`${BIBLE_API_BASE}/${encodeURIComponent(queryForApi)}?translation=${translation}`)
      if (response.ok) {
        const data = await response.json()
        if (data.verses && data.verses.length > 0) {
          return data
        }
      }
    } catch (e) {
      console.log('Not a verse reference, trying other strategies...')
    }
    
    // Strategy 2: Check if it's a book name (e.g., "Revelation", "Genesis")
    const lowerQ = normalizedQuery.toLowerCase()
    const bookMatch = BIBLE_BOOKS.find(book => {
      const idName = Object.entries(BOOK_NAME_ID).find(([abbr]) => abbr === book.abbr)?.[1]
      return book.name.toLowerCase() === lowerQ ||
        book.abbr.toLowerCase() === lowerQ ||
        (idName ? idName.toLowerCase() === lowerQ : false)
    })
    
    if (bookMatch) {
      // Return first chapter of the book
      try {
        const response = await fetch(`${BIBLE_API_BASE}/${bookMatch.abbr}1?translation=${translation}`)
        if (response.ok) {
          const data = await response.json()
          if (data.verses && data.verses.length > 0) {
            return {
              ...data,
              reference: `${bookMatch.name} Chapter 1`
            }
          }
        }
      } catch (e) {
        console.error('Error fetching book:', e)
      }
    }
    
    // Strategy 3: Keyword search in popular verses
    const searchVerses = [
      'John 3:16', 'John 3:16-17', 'Genesis 1:1', 'Genesis 1:1-3',
      'Psalm 23:1-6', 'Psalm 91:1-16', 'Romans 8:28', 'Romans 8:28-39',
      'Philippians 4:13', 'Philippians 4:4-13', 'Jeremiah 29:11',
      'Proverbs 3:5-6', 'Matthew 28:19-20', 'John 14:6',
      '1 Corinthians 13:4-8', '1 Corinthians 13:1-13',
      'Isaiah 40:31', 'Psalm 119:105', 'Matthew 5:14-16',
      'Romans 12:2', 'Ephesians 2:8-9', 'James 1:2-4',
      'Proverbs 16:3', 'Psalm 46:1', 'Matthew 11:28-30',
      'John 1:1-5', 'Revelation 21:4', 'Isaiah 41:10'
    ]
    
    console.log(`Searching for keyword: "${normalizedQuery}" in ${searchVerses.length} verses...`)
    
    const results = await Promise.all(
      searchVerses.map(async (ref) => {
        try {
          const res = await fetch(`${BIBLE_API_BASE}/${encodeURIComponent(ref)}?translation=${translation}`)
          if (res.ok) {
            const data = await res.json()
            if (data.verses) {
              // Check if any verse contains the query (case insensitive)
              const matchingVerses = data.verses.filter((v: any) => 
                v.text.toLowerCase().includes(normalizedQuery.toLowerCase()) ||
                v.book_name.toLowerCase().includes(normalizedQuery.toLowerCase())
              )
              
              if (matchingVerses.length > 0) {
                return {
                  ...data,
                  verses: matchingVerses
                }
              }
            }
          }
        } catch (e) {
          return null
        }
        return null
      })
    )
    
    const validResults = results.filter(r => r !== null)
    
    if (validResults.length > 0) {
      const allVerses = validResults.flatMap(r => r.verses)
      console.log(`Found ${allVerses.length} matching verses`)
      
      return {
        verses: allVerses,
        text: allVerses.map((v: any) => v.text).join(' '),
        reference: `Search results for "${normalizedQuery}"`
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
