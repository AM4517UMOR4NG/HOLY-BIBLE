import type { VercelRequest, VercelResponse } from '@vercel/node';


// Map English book abbreviations to Indonesian book names for Beeble API
function getIndonesianBookName(abbr: string): string | null {
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
  };
  return bookMap[abbr.toLowerCase()] || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Parse URL path to get book and chapter
    // Expected URL: /api/id-bible?book=gen&chapter=1
    const { book, chapter } = req.query;
    
    if (!book || !chapter) {
      return res.status(400).json({ 
        success: false,
        message: 'Book and chapter parameters required' 
      });
    }

    const indonesianBookName = getIndonesianBookName(book as string);
    
    if (!indonesianBookName) {
      return res.status(400).json({ 
        success: false,
        message: `Unsupported book code: ${book}` 
      });
    }

    // Call Beeble API
    const url = `https://beeble.vercel.app/api/v1/passage/${encodeURIComponent(indonesianBookName)}/${chapter}?ver=tb`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return res.status(502).json({ 
        success: false,
        message: 'Failed to fetch Indonesian Bible from Beeble API' 
      });
    }
    
    const json: any = await response.json();
    
    // Transform Beeble API response to our format
    const verses = (json?.data?.verses || [])
      .filter((v: any) => v.type === 'content')
      .map((v: any) => ({
        book_id: (book as string).toUpperCase(),
        book_name: json?.data?.book?.name,
        chapter: json?.data?.book?.chapter,
        verse: v.verse,
        text: v.content
      }));
    
    const result = {
      reference: `${json?.data?.book?.name} ${json?.data?.book?.chapter}`,
      verses,
      text: verses.map((v: any) => v.text).join(' '),
      translation_id: 'tb',
      translation_name: 'Terjemahan Baru (Indonesian)',
      translation_note: 'Indonesian Bible from Beeble API'
    };
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Indonesian Bible API error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
