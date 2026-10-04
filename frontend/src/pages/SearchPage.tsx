// SearchPage: Fast Bible search with instant session cache and responsive layout
import { useState } from 'react'
import { Search, Loader2, TrendingUp, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { searchBible, BIBLE_BOOKS } from '@/lib/bibleApi'
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
  const [query, setQuery] = useState(() => {
    try { return sessionStorage.getItem('last_search_query') || '' } catch { return '' }
  })
  const [results, setResults] = useState<SearchResult[]>(() => {
    try {
      const saved = sessionStorage.getItem('last_search_results')
      if (saved) return JSON.parse(saved)
    } catch {}
    return []
  })
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(() => {
    try { return !!sessionStorage.getItem('last_search_query') } catch { return false }
  })

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

  const handleSearch = async (overrideQuery?: string) => {
    const q = (overrideQuery !== undefined ? overrideQuery : query).trim()
    if (!q) return
    if (overrideQuery !== undefined) setQuery(overrideQuery)

    setIsSearching(true)
    setHasSearched(true)

    try {
      const data = await searchBible(q, language)

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
        try {
          sessionStorage.setItem('last_search_query', q)
          sessionStorage.setItem('last_search_results', JSON.stringify(uniqueResults))
        } catch {}
      } else {
        setResults([])
        try {
          sessionStorage.setItem('last_search_query', q)
          sessionStorage.setItem('last_search_results', JSON.stringify([]))
        } catch {}
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
        ? <mark key={i} className="bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-100 px-1.5 py-0.5 mx-0.5 rounded-md font-semibold bg-transparent">{part}</mark>
        : part
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Search Section */}
      <div className="pt-8 md:pt-14 pb-8 flex flex-col items-center text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight">
          {t('search.title')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium max-w-xl mx-auto mb-8 md:mb-10">
          {t('search.subtitle')}
        </p>

        <div className="w-full max-w-xl mx-auto px-4 sm:px-0">
          <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-full border-2 border-slate-400 dark:border-slate-500 hover:border-slate-500 shadow-md focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:shadow-xl transition-all duration-300">
            <div className="pl-6 pr-2 flex items-center justify-center">
              {isSearching ? (
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
              ) : (
                <Search className="h-6 w-6 text-slate-400" />
              )}
            </div>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isSearching && query.trim() && handleSearch()}
              placeholder={t('search.placeholder')}
              className="w-full bg-transparent border-0 h-16 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none text-slate-900 dark:text-white px-3 shadow-none placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {results.length} {results.length === 1 ? t('search.resultsFound') : t('search.resultsFoundPlural')}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('search.showingMatches')} "{query}"
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className="group p-4 sm:p-6 rounded-2xl hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition-colors relative border border-transparent"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-lg cursor-pointer hover:underline"
                    onClick={() => {
                      localStorage.setItem('current_reading', JSON.stringify({
                        book: result.book,
                        chapter: result.chapter,
                        verse: result.verse
                      }))
                      window.history.pushState({}, '', '/')
                      window.dispatchEvent(new PopStateEvent('popstate'))
                    }}
                  >
                    {displayBookName(result.book)} {result.chapter}:{result.verse}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full sm:w-auto text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hidden sm:flex"
                    onClick={() => {
                      localStorage.setItem('current_reading', JSON.stringify({
                        book: result.book,
                        chapter: result.chapter,
                        verse: result.verse
                      }))
                      window.history.pushState({}, '', '/')
                      window.dispatchEvent(new PopStateEvent('popstate'))
                    }}
                  >
                    {t('search.readChapter')}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-4">
                  <span className="text-sm font-medium text-gray-400 dark:text-gray-500 min-w-8 shrink-0 pt-1.5 select-none text-right">
                    {result.verse}
                  </span>
                  <p className="text-xl sm:text-2xl leading-loose flex-1 text-gray-800 dark:text-gray-200 font-serif">
                    {highlightText(result.text, query)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && hasSearched && !isSearching && (
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-16 border border-white dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center max-w-2xl mx-auto relative z-10">
            <h3 className="text-4xl font-black mb-4 text-slate-900 dark:text-white tracking-tight">{t('search.noResults')}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-10 text-xl">
              {t('search.noResultsMessage')} "<span className="text-slate-900 dark:text-white font-bold">{query}</span>"
            </p>

            <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-8 text-left mb-10 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{t('search.searchTips.title')}</p>
              </div>
              <ul className="space-y-4 text-base text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                  <div className="mt-0.5"><div className="h-2 w-2 rounded-full bg-blue-500"></div></div>
                  <span>{t('search.searchTips.verseRef')}</span>
                </li>
                <li className="flex items-start gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                  <div className="mt-0.5"><div className="h-2 w-2 rounded-full bg-blue-500"></div></div>
                  <span>{t('search.searchTips.bookChapter')}</span>
                </li>
                <li className="flex items-start gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                  <div className="mt-0.5"><div className="h-2 w-2 rounded-full bg-blue-500"></div></div>
                  <span>{t('search.searchTips.popular')}</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white shadow-sm hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-base font-semibold px-8"
                onClick={() => {
                  const q = language === 'id' ? 'Yohanes 3:16' : 'John 3:16'
                  handleSearch(q)
                }}
              >
                {t('search.trySearch')}: {language === 'id' ? 'Yohanes 3:16' : 'John 3:16'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white shadow-sm hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-base font-semibold px-8"
                onClick={() => {
                  const q = language === 'id' ? 'Mazmur 23' : 'Psalm 23'
                  handleSearch(q)
                }}
              >
                {t('search.trySearch')}: {language === 'id' ? 'Mazmur 23' : 'Psalm 23'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Initial State - Quick Search Examples */}
      {!hasSearched && !isSearching && (
        <div className="flex flex-col items-center mt-12 md:mt-20">

          {/* Popular Searches as subtle chips */}
          <div className="text-center mb-20">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
              {t('search.popularSearches')}
            </h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
              {[
                { id: 'Yohanes 3:16', en: 'John 3:16' },
                { id: 'Mazmur 23', en: 'Psalm 23' },
                { id: 'Roma 8:28', en: 'Romans 8:28' }
              ].map((verse, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(language === 'id' ? verse.id : verse.en)}
                  className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm md:text-base transition-colors"
                >
                  {language === 'id' ? verse.id : verse.en}
                </button>
              ))}
            </div>
          </div>

          {/* Bible Stats as minimal row */}
          <div className="text-center">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8">
              {t('search.bibleCoverage')}
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">66</span>
                <span className="text-sm font-medium text-slate-500">{t('search.books')}</span>
              </div>
              <div className="w-px h-16 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">1,189</span>
                <span className="text-sm font-medium text-slate-500">{t('search.chapters')}</span>
              </div>
              <div className="w-px h-16 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">31,102</span>
                <span className="text-sm font-medium text-slate-500">{t('search.verses')}</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
