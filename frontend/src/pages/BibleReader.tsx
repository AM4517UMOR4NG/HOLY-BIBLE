import { useState, useEffect, memo } from 'react'
import { ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getBibleChapter, BIBLE_BOOKS, prefetchAdjacentChapters } from '@/lib/bibleApi'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/contexts/LanguageContext'
import { VerseSlider } from '@/components/VerseSlider'

interface Verse {
  number: number
  text: string
}

// Memoized verse item component to prevent unnecessary re-renders
const VerseItem = memo(function VerseItem({ verse }: { verse: Verse }) {
  return (
    <div
      id={`verse-${verse.number}`}
      className="flex gap-4 group"
    >
      <span className="text-lg font-bold text-blue-400 min-w-10 shrink-0 pt-1">
        {verse.number}
      </span>
      <p className="text-lg leading-relaxed flex-1 text-gray-200">
        {verse.text}
      </p>
    </div>
  )
})

// Skeleton loading component for better perceived performance
function VerseSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-6 w-10 bg-slate-700 rounded shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-slate-700 rounded w-full"></div>
            <div className="h-5 bg-slate-700 rounded w-4/5"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function BibleReader() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const [currentBookIndex, setCurrentBookIndex] = useState(0)
  const [currentChapter, setCurrentChapter] = useState(2)
  const [verses, setVerses] = useState<Verse[]>([])
  const [loading, setLoading] = useState(true)
  const [bookName, setBookName] = useState('Genesis')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [selectedVerse, setSelectedVerse] = useState<number | ''>('')

  const currentBook = BIBLE_BOOKS[currentBookIndex]

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

  const localizedBookName = language === 'id'
    ? (BOOK_NAME_ID[currentBook.abbr] || bookName)
    : bookName

  const testamentLabel = language === 'id'
    ? (currentBook.testament === 'Old' ? 'Perjanjian Lama' : 'Perjanjian Baru')
    : `${currentBook.testament} Testament`

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch Bible chapter data
  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true)
      const data = await getBibleChapter(currentBook.abbr, currentChapter, language)
      if (data && data.verses) {
        const formattedVerses = data.verses.map((v: any) => ({
          number: v.verse,
          text: v.text
        }))
        setVerses(formattedVerses)
        setBookName(data.verses[0]?.book_name || currentBook.name)
        // Prefetch adjacent chapters for instant navigation
        prefetchAdjacentChapters(currentBook.abbr, currentChapter, currentBook.chapters, language)
      }
      setLoading(false)
    }
    fetchChapter()
    setSelectedVerse('')
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

  const handleVerseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = parseInt(e.target.value, 10)
    if (!Number.isNaN(v)) {
      setSelectedVerse(v)
      const el = document.getElementById(`verse-${v}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      setSelectedVerse('')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Hero Section Skeleton */}
        <div className="relative overflow-hidden rounded-t-2xl bg-linear-to-br from-blue-500 via-blue-600 to-indigo-700 p-12 text-white shadow-2xl animate-pulse">
          <div className="relative z-10 text-center">
            <div className="h-12 bg-white/20 rounded-lg w-48 mx-auto mb-3"></div>
            <div className="h-6 bg-white/20 rounded w-32 mx-auto mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-24 mx-auto"></div>
          </div>
        </div>
        {/* Verses Skeleton */}
        <div className="bg-[#1e293b] rounded-b-2xl p-8 shadow-xl">
          <VerseSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden rounded-t-2xl bg-linear-to-br from-blue-500 via-blue-600 to-indigo-700 p-12 text-white shadow-2xl">
        {/* Decorative background circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm"
              onClick={goToPreviousChapter}
              disabled={currentBookIndex === 0 && currentChapter === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('reader.previous')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm"
              onClick={goToNextChapter}
              disabled={currentBookIndex === BIBLE_BOOKS.length - 1 && currentChapter === currentBook.chapters}
            >
              {t('reader.next')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-3">{localizedBookName}</h1>
            <p className="text-xl text-white/90 mb-2">{t('reader.chapter')} {currentChapter}</p>
            <p className="text-sm text-white/70">{testamentLabel}</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
              <select
                className="w-full rounded-md bg-white/10 border border-white/20 text-white px-3 py-2 backdrop-blur-sm hover:bg-white/20 focus:outline-none"
                value={currentBookIndex}
                onChange={handleBookChange}
              >
                {BIBLE_BOOKS.map((b, idx) => (
                  <option key={b.abbr} value={idx} className="bg-slate-800 text-white">
                    {language === 'id' ? (BOOK_NAME_ID[b.abbr] || b.name) : b.name}
                  </option>
                ))}
              </select>

              <select
                className="w-full rounded-md bg-white/10 border border-white/20 text-white px-3 py-2 backdrop-blur-sm hover:bg-white/20 focus:outline-none"
                value={currentChapter}
                onChange={handleChapterChange}
              >
                {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((c) => (
                  <option key={c} value={c} className="bg-slate-800 text-white">
                    {t('reader.chapter')} {c}
                  </option>
                ))}
              </select>

              <select
                className="w-full rounded-md bg-white/10 border border-white/20 text-white px-3 py-2 backdrop-blur-sm hover:bg-white/20 focus:outline-none"
                value={selectedVerse}
                onChange={handleVerseChange}
              >
                <option value="" className="bg-slate-800 text-white">{t('reader.verse')}</option>
                {verses.map((v) => (
                  <option key={v.number} value={v.number} className="bg-slate-800 text-white">
                    {t('reader.verse')} {v.number}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Verses Display */}
      <VerseSlider />
      <div className="bg-[#1e293b] rounded-b-2xl p-8 shadow-xl">
        <div className="space-y-6">
          {verses.map((verse) => (
            <VerseItem key={verse.number} verse={verse} />
          ))}
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
