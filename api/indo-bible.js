// Indonesian Bible API - JavaScript version
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Get query params from URL
    const url = new URL(req.url, `http://${req.headers.host}`);
    const book = url.searchParams.get('book');
    const chapter = url.searchParams.get('chapter');
    
    if (!book || !chapter) {
      return res.status(400).json({
        success: false,
        message: 'Missing book or chapter parameter'
      });
    }
    
    // Map English book codes to Indonesian names
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
    
    const indonesianBook = bookMap[book.toLowerCase()];
    if (!indonesianBook) {
      return res.status(400).json({
        success: false,
        message: `Unknown book code: ${book}`
      });
    }
    
    // Fetch from Beeble API
    const beebleUrl = `https://beeble.vercel.app/api/v1/passage/${encodeURIComponent(indonesianBook)}/${chapter}?ver=tb`;
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
        chapter: parseInt(chapter),
        verse: v.verse,
        text: v.content
      }));
    
    return res.status(200).json({
      reference: `${data?.data?.book?.name} ${chapter}`,
      verses,
      text: verses.map(v => v.text).join(' '),
      translation_id: 'tb',
      translation_name: 'Terjemahan Baru (Indonesian)',
      translation_note: 'Indonesian Bible from Beeble API'
    });
    
  } catch (error) {
    console.error('Indonesian Bible API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch Indonesian Bible',
      error: error.message
    });
  }
};
