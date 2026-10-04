import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ArrowUp, Bookmark, BookmarkCheck, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getBibleChapter, getCachedBibleChapter, BIBLE_BOOKS, prefetchAdjacentChapters } from '@/lib/bibleApi'
import { addBookmark, removeBookmark, getBookmarks, isBookmarked } from '@/lib/bookmarks'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/contexts/LanguageContext'
import { VerseSlider } from '@/components/VerseSlider'

interface Verse {
  number: number
  text: string
}

// Skeleton loading component for better perceived performance
function VerseSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-6 w-10 bg-gray-200 dark:bg-slate-700 rounded shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-4/5"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Indonesian names mapping by abbreviation
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

export function BibleReader() {
  const { t } = useTranslation()
  const { language } = useLanguage()

  // Initialize from saved reading state or default to Genesis 1
  const [currentBookIndex, setCurrentBookIndex] = useState(() => {
    try {
      const saved = localStorage.getItem('current_reading')
      if (saved) {
        const { book } = JSON.parse(saved)
        const clean = (book || '').toLowerCase()
        const idx = BIBLE_BOOKS.findIndex(b =>
          b.abbr.toLowerCase() === clean ||
          b.name.toLowerCase() === clean ||
          (BOOK_NAME_ID[b.abbr] && BOOK_NAME_ID[b.abbr].toLowerCase() === clean)
        )
        if (idx !== -1) return idx
      }
    } catch (e) {}
    return 0
  })

  const [currentChapter, setCurrentChapter] = useState(() => {
    try {
      const saved = localStorage.getItem('current_reading')
      if (saved) {
        const { chapter } = JSON.parse(saved)
        const ch = parseInt(chapter, 10)
        if (!isNaN(ch) && ch > 0) return ch
      }
    } catch (e) {}
    return 1 // Default to chapter 1
  })

  const currentBook = BIBLE_BOOKS[currentBookIndex] || BIBLE_BOOKS[0]

  // Initialize verses immediately from cache if available (0ms instant render)
  const [verses, setVerses] = useState<Verse[]>(() => {
    const cached = getCachedBibleChapter(currentBook.abbr, currentChapter, language)
    if (cached && cached.verses) {
      return cached.verses.map((v: any) => ({
        number: v.verse,
        text: v.text
      }))
    }
    return []
  })
  const [loading, setLoading] = useState<boolean>(() => {
    const cached = getCachedBibleChapter(currentBook.abbr, currentChapter, language)
    return !cached
  })
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null)
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<number>>(new Set())

  // Check current bookmarks for this book & chapter
  const refreshBookmarks = () => {
    const list = getBookmarks()
    const set = new Set<number>()
    list.forEach(b => {
      if (
        (b.bookAbbr.toLowerCase() === currentBook.abbr.toLowerCase() ||
         b.book.toLowerCase() === currentBook.name.toLowerCase()) &&
        b.chapter === currentChapter
      ) {
        set.add(b.verse)
      }
    })
    setBookmarkedSet(set)
  }

  useEffect(() => {
    refreshBookmarks()
    const handleBmUpdate = () => refreshBookmarks()
    window.addEventListener('bookmarks_updated', handleBmUpdate)
    return () => window.removeEventListener('bookmarks_updated', handleBmUpdate)
  }, [currentBookIndex, currentChapter])

  // Handle external navigation (from search or bookmarks)
  useEffect(() => {
    const checkSaved = () => {
      try {
        const saved = localStorage.getItem('current_reading')
        if (saved) {
          const { book, chapter, verse } = JSON.parse(saved)
          const clean = (book || '').toLowerCase()
          const idx = BIBLE_BOOKS.findIndex(b =>
            b.abbr.toLowerCase() === clean ||
            b.name.toLowerCase() === clean ||
            (BOOK_NAME_ID[b.abbr] && BOOK_NAME_ID[b.abbr].toLowerCase() === clean)
          )
          if (idx !== -1) setCurrentBookIndex(idx)
          const ch = parseInt(chapter, 10)
          if (!isNaN(ch) && ch > 0) setCurrentChapter(ch)
          if (verse) {
            setTimeout(() => {
              const el = document.getElementById(`verse-${verse}`)
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                el.classList.add('bg-blue-500/10', 'rounded-lg')
                setTimeout(() => el.classList.remove('bg-blue-500/10', 'rounded-lg'), 2500)
              }
            }, 600)
          }
          localStorage.removeItem('current_reading')
        }
      } catch (e) {}
    }

    checkSaved()
    window.addEventListener('popstate', checkSaved)
    return () => window.removeEventListener('popstate', checkSaved)
  }, [])

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch Bible chapter data with instant cache resolution
  useEffect(() => {
    let cancelled = false
    const fetchChapter = async () => {
      // Check cache first for instant 0ms update
      const cached = getCachedBibleChapter(currentBook.abbr, currentChapter, language)
      if (cached && cached.verses) {
        if (!cancelled) {
          setVerses(cached.verses.map((v: any) => ({
            number: v.verse,
            text: v.text
          })))
          setLoading(false)
          prefetchAdjacentChapters(currentBook.abbr, currentChapter, currentBook.chapters, language)
        }
        return
      }

      setLoading(true)
      const data = await getBibleChapter(currentBook.abbr, currentChapter, language)
      if (!cancelled && data && data.verses) {
        const formattedVerses = data.verses.map((v: any) => ({
          number: v.verse,
          text: v.text
        }))
        setVerses(formattedVerses)
        prefetchAdjacentChapters(currentBook.abbr, currentChapter, currentBook.chapters, language)
      }
      if (!cancelled) setLoading(false)
    }
    fetchChapter()
    return () => {
      cancelled = true
    }
  }, [currentBookIndex, currentChapter, currentBook, language])

  const goToNextChapter = () => {
    if (currentChapter < currentBook.chapters) {
      setCurrentChapter(currentChapter + 1)
    } else if (currentBookIndex < BIBLE_BOOKS.length - 1) {
      setCurrentBookIndex(currentBookIndex + 1)
      setCurrentChapter(1)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToPreviousChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1)
    } else if (currentBookIndex > 0) {
      setCurrentBookIndex(currentBookIndex - 1)
      setCurrentChapter(BIBLE_BOOKS[currentBookIndex - 1].chapters)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = parseInt(e.target.value, 10)
    if (!Number.isNaN(idx)) {
      setCurrentBookIndex(idx)
      setCurrentChapter(1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chap = parseInt(e.target.value, 10)
    if (!Number.isNaN(chap)) {
      setCurrentChapter(chap)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleToggleBookmark = (verse: Verse) => {
    const currentlyBookmarked = isBookmarked(currentBook.abbr, currentChapter, verse.number)
    if (currentlyBookmarked) {
      const all = getBookmarks()
      const match = all.find(b => 
        (b.bookAbbr.toLowerCase() === currentBook.abbr.toLowerCase() || b.book.toLowerCase() === currentBook.name.toLowerCase()) &&
        b.chapter === currentChapter &&
        b.verse === verse.number
      )
      if (match) removeBookmark(match.id)
    } else {
      addBookmark({
        book: language === 'id' ? (BOOK_NAME_ID[currentBook.abbr] || currentBook.name) : currentBook.name,
        bookAbbr: currentBook.abbr,
        chapter: currentChapter,
        verse: verse.number,
        text: verse.text
      })
    }
    refreshBookmarks()
  }

  const handleCopyVerse = (verse: Verse) => {
    const bookTitle = language === 'id' ? (BOOK_NAME_ID[currentBook.abbr] || currentBook.name) : currentBook.name
    const copyText = `${bookTitle} ${currentChapter}:${verse.number} - "${verse.text}"`
    navigator.clipboard?.writeText(copyText)
    setCopiedVerse(verse.number)
    setTimeout(() => setCopiedVerse(null), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-8 shadow-md dark:shadow-xl border border-gray-100 dark:border-none">
          <VerseSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Hero Section / Navigation Bar */}
      <div className="sticky top-16 z-30 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 p-4 sm:p-6 mb-8 transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
          <Button
            variant="ghost"
            className="hidden sm:flex text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            onClick={goToPreviousChapter}
            disabled={currentBookIndex === 0 && currentChapter === 1}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            {t('reader.previous')}
          </Button>
          
          <div className="flex-1 flex justify-center items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <select
              className="bg-transparent text-xl sm:text-2xl font-bold font-serif text-gray-900 dark:text-white appearance-none cursor-pointer hover:opacity-80 focus:outline-none text-right"
              value={currentBookIndex}
              onChange={handleBookChange}
              style={{ textAlignLast: 'right' }}
            >
              {BIBLE_BOOKS.map((b, idx) => (
                <option key={b.abbr} value={idx} className="bg-white dark:bg-slate-900 text-base font-sans text-gray-900 dark:text-white">
                  {language === 'id' ? (BOOK_NAME_ID[b.abbr] || b.name) : b.name}
                </option>
              ))}
            </select>
            
            <select
              className="bg-transparent text-xl sm:text-2xl font-bold font-serif text-gray-900 dark:text-white appearance-none cursor-pointer hover:opacity-80 focus:outline-none"
              value={currentChapter}
              onChange={handleChapterChange}
            >
              {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-slate-900 text-base font-sans text-gray-900 dark:text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="ghost"
            className="hidden sm:flex text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            onClick={goToNextChapter}
            disabled={currentBookIndex === BIBLE_BOOKS.length - 1 && currentChapter === currentBook.chapters}
          >
            {t('reader.next')}
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
        
        {/* Mobile Next/Prev */}
        <div className="flex justify-between mt-4 sm:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500"
            onClick={goToPreviousChapter}
            disabled={currentBookIndex === 0 && currentChapter === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('reader.previous')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500"
            onClick={goToNextChapter}
            disabled={currentBookIndex === BIBLE_BOOKS.length - 1 && currentChapter === currentBook.chapters}
          >
            {t('reader.next')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Verses Display */}
      <div className="px-6 sm:px-12">
        <VerseSlider />
        <div className="mt-8 space-y-6">
          {verses.map((verse) => {
            const hasBookmark = bookmarkedSet.has(verse.number)
            const isCopied = copiedVerse === verse.number

            return (
              <div
                key={verse.number}
                id={`verse-${verse.number}`}
                className="flex gap-4 group p-2.5 -mx-2.5 rounded-xl hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition-colors relative"
              >
                <span className="text-sm font-medium text-gray-400 dark:text-gray-500 min-w-8 shrink-0 pt-1.5 select-none text-right">
                  {verse.number}
                </span>
                <p className="text-xl sm:text-2xl leading-loose flex-1 text-gray-800 dark:text-gray-200 font-serif">
                  {verse.text}
                </p>

                {/* Hover action toolbar for each verse */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-1 shrink-0 pt-1">
                  <button
                    onClick={() => handleToggleBookmark(verse)}
                    title={hasBookmark ? "Hapus Markah" : "Simpan ke Markah"}
                    className={`p-1.5 rounded-lg text-sm transition-colors ${
                      hasBookmark 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                        : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {hasBookmark ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleCopyVerse(verse)}
                    title="Salin Ayat"
                    className="p-1.5 rounded-lg text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
