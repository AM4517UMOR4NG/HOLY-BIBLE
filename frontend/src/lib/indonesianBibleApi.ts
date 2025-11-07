// Indonesian Bible API Integration
// Using Beeble API - https://beeble.vercel.app
// Complete Indonesian Bible (Terjemahan Baru)

interface IndonesianVerse {
  verse: number
  type: 'title' | 'content'
  content: string
}

interface IndonesianBibleResponse {
  data: {
    book: {
      no: number
      name: string
      chapter: number
    }
    verses: IndonesianVerse[]
  }
}

const INDONESIAN_API_BASE = 'https://beeble.vercel.app/api/v1'

// Map English book abbreviations to Indonesian names
const BOOK_NAME_MAP: Record<string, string> = {
  'gen': 'Kejadian',
  'exo': 'Keluaran',
  'lev': 'Imamat',
  'num': 'Bilangan',
  'deu': 'Ulangan',
  'jos': 'Yosua',
  'jdg': 'Hakim-hakim',
  'rut': 'Rut',
  '1sa': '1 Samuel',
  '2sa': '2 Samuel',
  '1ki': '1 Raja-raja',
  '2ki': '2 Raja-raja',
  '1ch': '1 Tawarikh',
  '2ch': '2 Tawarikh',
  'ezr': 'Ezra',
  'neh': 'Nehemia',
  'est': 'Ester',
  'job': 'Ayub',
  'psa': 'Mazmur',
  'pro': 'Amsal',
  'ecc': 'Pengkhotbah',
  'sng': 'Kidung Agung',
  'isa': 'Yesaya',
  'jer': 'Yeremia',
  'lam': 'Ratapan',
  'ezk': 'Yehezkiel',
  'dan': 'Daniel',
  'hos': 'Hosea',
  'jol': 'Yoel',
  'amo': 'Amos',
  'oba': 'Obaja',
  'jon': 'Yunus',
  'mic': 'Mikha',
  'nam': 'Nahum',
  'hab': 'Habakuk',
  'zep': 'Zefanya',
  'hag': 'Hagai',
  'zec': 'Zakharia',
  'mal': 'Maleakhi',
  'mat': 'Matius',
  'mrk': 'Markus',
  'luk': 'Lukas',
  'jhn': 'Yohanes',
  'act': 'Kisah Para Rasul',
  'rom': 'Roma',
  '1co': '1 Korintus',
  '2co': '2 Korintus',
  'gal': 'Galatia',
  'eph': 'Efesus',
  'php': 'Filipi',
  'col': 'Kolose',
  '1th': '1 Tesalonika',
  '2th': '2 Tesalonika',
  '1ti': '1 Timotius',
  '2ti': '2 Timotius',
  'tit': 'Titus',
  'phm': 'Filemon',
  'heb': 'Ibrani',
  'jas': 'Yakobus',
  '1pe': '1 Petrus',
  '2pe': '2 Petrus',
  '1jn': '1 Yohanes',
  '2jn': '2 Yohanes',
  '3jn': '3 Yohanes',
  'jud': 'Yudas',
  'rev': 'Wahyu'
}

/**
 * Fetch Indonesian Bible chapter from Beeble API
 * Supports ALL books from Genesis to Revelation
 */
export async function getIndonesianBibleChapter(bookAbbr: string, chapter: number): Promise<any> {
  try {
    const indonesianBookName = BOOK_NAME_MAP[bookAbbr.toLowerCase()]
    
    if (!indonesianBookName) {
      console.warn(`Book abbreviation '${bookAbbr}' not found in mapping`)
      return null
    }

    console.log(`📖 Fetching Indonesian: ${indonesianBookName} ${chapter}`)
    
    const response = await fetch(`${INDONESIAN_API_BASE}/passage/${encodeURIComponent(indonesianBookName)}/${chapter}`)
    
    if (!response.ok) {
      console.error(`Failed to fetch Indonesian Bible: ${response.status}`)
      return null
    }

    const data: IndonesianBibleResponse = await response.json()
    
    if (!data || !data.data || !data.data.verses) {
      console.error('Invalid Indonesian Bible API response')
      return null
    }

    console.log(`✅ Successfully fetched ${data.data.verses.length} verses in Indonesian`)

    // Transform to match BibleChapter interface
    return {
      reference: `${data.data.book.name} ${data.data.book.chapter}`,
      verses: data.data.verses
        .filter(v => v.type === 'content') // Only content verses, skip titles
        .map(v => ({
          book_id: bookAbbr.toUpperCase(),
          book_name: data.data.book.name,
          chapter: data.data.book.chapter,
          verse: v.verse,
          text: v.content
        })),
      text: data.data.verses
        .filter(v => v.type === 'content')
        .map(v => v.content)
        .join(' '),
      translation_id: 'tb',
      translation_name: 'Terjemahan Baru (Indonesian)',
      translation_note: 'Indonesian Bible - Terjemahan Baru'
    }
  } catch (error) {
    console.error('Error fetching Indonesian Bible chapter:', error)
    return null
  }
}

/**
 * Check if Indonesian translation is available
 * Always returns true since Beeble API supports all books
 */
export function isIndonesianAvailable(bookAbbr: string): boolean {
  return BOOK_NAME_MAP[bookAbbr.toLowerCase()] !== undefined
}

/**
 * Get Indonesian book name from English abbreviation
 */
export function getIndonesianBookName(bookAbbr: string): string | null {
  return BOOK_NAME_MAP[bookAbbr.toLowerCase()] || null
}
