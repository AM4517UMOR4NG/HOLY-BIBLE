import { useState } from 'react'
import { Search, Loader2, BookOpen, TrendingUp, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { searchBible, BIBLE_BOOKS } from '@/lib/bibleApi'
import { JesusTeachingAnimation } from '@/components/JesusTeachingAnimation'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/contexts/LanguageContext'

interface SearchResult {
  book: string
  chapter: number
  verse: number
  text: string
}

export function SearchPage() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Mapping English book name -> Indonesian book name via abbreviation
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
  const EN_NAME_TO_ID: Record<string, string> = Object.fromEntries(
    BIBLE_BOOKS.map(b => [b.name.toLowerCase(), BOOK_NAME_ID[b.abbr] || b.name])
  )

  const displayBookName = (book: string) => {
    if (language !== 'id') return book
    return EN_NAME_TO_ID[book.toLowerCase()] || book
  }

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setIsSearching(true)
    setHasSearched(true)
    
    try {
      const data = await searchBible(query, language)
      
      if (data && data.verses && data.verses.length > 0) {
        // Format results from API
        const formattedResults: SearchResult[] = data.verses.map((v: any) => ({
          book: v.book_name || v.book || 'Unknown',
          chapter: v.chapter || 0,
          verse: v.verse || 0,
          text: v.text || ''
        }))
        
        // Remove duplicates based on book, chapter, verse
        const uniqueResults = formattedResults.filter((result, index, self) =>
          index === self.findIndex((r) => (
            r.book === result.book && r.chapter === result.chapter && r.verse === result.verse
          ))
        )
        
        setResults(uniqueResults)
      } else {
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    }
    
    setIsSearching(false)
  }

  const highlightText = (text: string, query: string) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-900">{part}</mark>
        : part
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Search Section */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 md:p-12 text-white shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Search className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('search.title')}</h1>
              <p className="text-blue-100 text-sm md:text-base mt-1">
                {t('search.subtitle')}
              </p>
              <JesusTeachingAnimation />
            </div>
          </div>

          {/* Search Input */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder={t('search.placeholder')}
                className="h-14 pl-12 pr-4 text-base bg-white border-0 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-white/50"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isSearching && query.trim() && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !query.trim()}
              className="h-14 px-8 bg-white text-blue-700 hover:bg-blue-50 font-semibold text-base shadow-lg"
              size="lg"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {t('search.searching')}
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  {t('search.searchButton')}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {results.length} {results.length === 1 ? t('search.resultsFound') : t('search.resultsFoundPlural')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('search.showingMatches')} "{query}"
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div 
                key={index} 
                className="group bg-[#1e293b] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-blue-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {displayBookName(result.book)} {result.chapter}:{result.verse}
                      </h3>
                      <p className="text-sm text-gray-400">{t('reader.verse')} {result.verse}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                  >
                    {t('search.readChapter')}
                  </Button>
                </div>
                <p className="text-base leading-relaxed text-gray-200 pl-14">
                  {highlightText(result.text, query)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && hasSearched && !isSearching && (
        <div className="bg-[#1e293b] rounded-3xl p-8 md:p-12 border border-gray-700 shadow-xl">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex p-4 bg-yellow-500/10 rounded-2xl mb-6">
              <Search className="h-12 w-12 text-yellow-500" />
            </div>
            <h3 className="text-3xl font-bold mb-3 text-white">{t('search.noResults')}</h3>
            <p className="text-gray-400 mb-8 text-lg">
              {t('search.noResultsMessage')} "<span className="text-white font-semibold">{query}</span>"
            </p>
            
            <div className="bg-[#0f172a] rounded-2xl p-6 text-left mb-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <p className="font-semibold text-white">{t('search.searchTips.title')}</p>
              </div>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold text-lg">•</span>
                  <span>{t('search.searchTips.verseRef')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold text-lg">•</span>
                  <span>{t('search.searchTips.bookChapter')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold text-lg">•</span>
                  <span>{t('search.searchTips.popular')}</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500"
                onClick={() => {
                  setQuery(language === 'id' ? 'Yohanes 3:16' : 'John 3:16')
                  setTimeout(() => handleSearch(), 100)
                }}
              >
                {t('search.trySearch')}: {language === 'id' ? 'Yohanes 3:16' : 'John 3:16'}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500"
                onClick={() => {
                  setQuery(language === 'id' ? 'Mazmur 23' : 'Psalm 23')
                  setTimeout(() => handleSearch(), 100)
                }}
              >
                {t('search.trySearch')}: {language === 'id' ? 'Mazmur 23' : 'Psalm 23'}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500"
                onClick={() => {
                  setQuery(language === 'id' ? 'Roma 8:28' : 'Romans 8:28')
                  setTimeout(() => handleSearch(), 100)
                }}
              >
                {t('search.trySearch')}: {language === 'id' ? 'Roma 8:28' : 'Romans 8:28'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Initial State - Quick Search Examples */}
      {!hasSearched && !isSearching && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Popular Searches */}
          <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{t('search.popularSearches')}</h3>
                <p className="text-sm text-gray-400">{t('search.popularSubtitle')}</p>
              </div>
            </div>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full justify-start h-14 text-base font-medium bg-[#0f172a] border-gray-600 text-white hover:bg-blue-900/30 hover:border-blue-500"
                onClick={() => {
                  setQuery(language === 'id' ? 'Yohanes 3:16' : 'John 3:16')
                  setTimeout(() => handleSearch(), 100)
                }}
              >
                <BookOpen className="h-5 w-5 mr-3 text-blue-400" />
                {language === 'id' ? 'Yohanes 3:16' : 'John 3:16'} - {t('search.popularVerses.john316')}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full justify-start h-14 text-base font-medium bg-[#0f172a] border-gray-600 text-white hover:bg-blue-900/30 hover:border-blue-500"
                onClick={() => {
                  setQuery(language === 'id' ? 'Mazmur 23' : 'Psalm 23')
                  setTimeout(() => handleSearch(), 100)
                }}
              >
                <BookOpen className="h-5 w-5 mr-3 text-blue-400" />
                {language === 'id' ? 'Mazmur 23' : 'Psalm 23'} - {t('search.popularVerses.psalm23')}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full justify-start h-14 text-base font-medium bg-[#0f172a] border-gray-600 text-white hover:bg-blue-900/30 hover:border-blue-500"
                onClick={() => {
                  setQuery(language === 'id' ? 'Roma 8:28' : 'Romans 8:28')
                  setTimeout(() => handleSearch(), 100)
                }}
              >
                <BookOpen className="h-5 w-5 mr-3 text-blue-400" />
                {language === 'id' ? 'Roma 8:28' : 'Romans 8:28'} - {t('search.popularVerses.romans828')}
              </Button>
            </div>
          </div>

          {/* Bible Stats */}
          <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-600/20 rounded-lg">
                <Sparkles className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{t('search.bibleCoverage')}</h3>
                <p className="text-sm text-gray-400">{t('search.coverageSubtitle')}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-[#0f172a] rounded-xl border border-gray-700">
                <span className="font-semibold text-base text-gray-300">{t('search.books')}</span>
                <span className="text-4xl font-bold text-blue-400">66</span>
              </div>
              <div className="flex items-center justify-between p-5 bg-[#0f172a] rounded-xl border border-gray-700">
                <span className="font-semibold text-base text-gray-300">{t('search.chapters')}</span>
                <span className="text-4xl font-bold text-blue-400">1,189</span>
              </div>
              <div className="flex items-center justify-between p-5 bg-[#0f172a] rounded-xl border border-gray-700">
                <span className="font-semibold text-base text-gray-300">{t('search.verses')}</span>
                <span className="text-4xl font-bold text-blue-400">31,102</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
