// Alkitab Indonesia API
// Using free Alkitab API endpoints

interface AlkitabVerse {
  verse: number
  type: string
  content: string
}

interface AlkitabResponse {
  book: string
  chapter: number
  verses: AlkitabVerse[]
}

// Map English book names to Indonesian
const BOOK_MAP: Record<string, string> = {
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

// Using sabda.org free API (alternative: api.scripture.api.bible with API key)
export async function getIndonesianChapter(bookAbbr: string, chapter: number): Promise<any> {
  try {
    // Try using biblegateway scraping API (open source alternative)
    // Or use locally stored data (fallback)
    
    const bookName = BOOK_MAP[bookAbbr.toLowerCase()] || bookAbbr
    
    // For now, return null to indicate Indonesian not available yet
    // This will trigger fallback to English
    console.log(`Indonesian translation requested for ${bookName} ${chapter}`)
    
    // TODO: Implement actual Indonesian API when available
    // Options:
    // 1. Self-host Alkitab API GraphQL server
    // 2. Use paid API like scripture.api.bible
    // 3. Store Bible data in local database
    
    return null
  } catch (error) {
    console.error('Error fetching Indonesian chapter:', error)
    return null
  }
}

// Helper: Check if Indonesian translation is available
export function isIndonesianAvailable(): boolean {
  // For now, return false
  // Will be true when we implement proper Indonesian API
  return false
}
