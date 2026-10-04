import { useEffect, useState } from 'react'
import { Loader2, BookOpen, Copy, Check, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getBibleVerse } from '@/lib/bibleApi'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslation } from 'react-i18next'

const INSPIRATIONAL_VERSES = [
  { abbr: 'jhn', chapter: 3, verse: 16, book: 'John', idBook: 'Yohanes' },
  { abbr: 'psa', chapter: 23, verse: 1, book: 'Psalm', idBook: 'Mazmur' },
  { abbr: 'rom', chapter: 8, verse: 28, book: 'Romans', idBook: 'Roma' },
  { abbr: 'php', chapter: 4, verse: 13, book: 'Philippians', idBook: 'Filipi' },
  { abbr: 'isa', chapter: 41, verse: 10, book: 'Isaiah', idBook: 'Yesaya' },
  { abbr: 'pro', chapter: 3, verse: 5, book: 'Proverbs', idBook: 'Amsal' },
  { abbr: 'jer', chapter: 29, verse: 11, book: 'Jeremiah', idBook: 'Yeremia' },
  { abbr: 'mat', chapter: 11, verse: 28, book: 'Matthew', idBook: 'Matius' },
  { abbr: 'psa', chapter: 91, verse: 1, book: 'Psalm', idBook: 'Mazmur' },
  { abbr: 'jhn', chapter: 14, verse: 6, book: 'John', idBook: 'Yohanes' }
]

export function DailyVersePage() {
  const { language } = useLanguage()
  const { t } = useTranslation()

  const getInitial = () => {
    try {
      const raw = localStorage.getItem(`last_daily_verse_${language}`)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.text && parsed.ref) return parsed
      }
    } catch {}
    return {
      text: language === 'id' 
        ? 'Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal.' 
        : 'For God so loved the world, that he gave his only begotten Son.',
      ref: language === 'id' ? 'Yohanes 3:16' : 'John 3:16',
      info: INSPIRATIONAL_VERSES[0]
    }
  }

  const [initial] = useState(getInitial)
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState(initial.text)
  const [ref, setRef] = useState(initial.ref)
  const [currentVerseInfo, setCurrentVerseInfo] = useState<typeof INSPIRATIONAL_VERSES[0] | null>(initial.info)
  const [copied, setCopied] = useState(false)

  const fetchRandom = async (force = false) => {
    // If not forced and we already have verse for current language, keep it instant
    if (!force && text && ref) {
      return
    }

    setLoading(true)
    const pick = INSPIRATIONAL_VERSES[Math.floor(Math.random() * INSPIRATIONAL_VERSES.length)]
    setCurrentVerseInfo(pick)
    const data = await getBibleVerse(pick.abbr, pick.chapter, pick.verse, language)
    let newText = ''
    let newRef = ''
    if (data && data.text) {
      newText = data.text
      const bookTitle = language === 'id' ? pick.idBook : data.book_name
      newRef = `${bookTitle} ${data.chapter}:${data.verse}`
    } else {
      newText = language === 'id' 
        ? 'Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal.' 
        : 'For God so loved the world, that he gave his only begotten Son.'
      newRef = language === 'id' ? 'Yohanes 3:16' : 'John 3:16'
    }
    setText(newText)
    setRef(newRef)
    try {
      localStorage.setItem(`last_daily_verse_${language}`, JSON.stringify({
        text: newText,
        ref: newRef,
        info: pick
      }))
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    fetchRandom(false)
  }, [language])

  const handleCopy = () => {
    navigator.clipboard?.writeText(`${ref} - "${text}"`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReadChapter = () => {
    if (!currentVerseInfo) return
    localStorage.setItem('current_reading', JSON.stringify({
      book: currentVerseInfo.abbr,
      chapter: currentVerseInfo.chapter,
      verse: currentVerseInfo.verse
    }))
    window.history.pushState({}, '', '/')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="pt-8 md:pt-12 pb-4 flex flex-col items-center text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight">
          {t('nav.dailyVerse') || 'Ayat Harian'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium max-w-xl mx-auto">
          Renungan dan inspirasi firman Tuhan untuk hari ini.
        </p>
      </div>

      <div className="p-6 sm:p-12 rounded-2xl border border-black dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-500" />
            <span className="text-lg font-medium">Memuat ayat harian...</span>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex justify-center">
              <div className="inline-block px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold text-xs tracking-widest uppercase bg-transparent">
                {ref}
              </div>
            </div>

            <blockquote className="text-3xl md:text-4xl font-serif leading-snug text-center text-slate-900 dark:text-white text-balance mx-auto max-w-2xl px-4">
              "{text}"
            </blockquote>

            <div className="pt-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button 
                  onClick={() => fetchRandom(true)} 
                  size="lg"
                  className="h-12 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold transition-all active:scale-95 gap-2 w-full sm:w-auto"
                >
                  <RefreshCw className="h-4 w-4" /> Ayat Lain
                </Button>
                <Button 
                  onClick={handleReadChapter} 
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold transition-all active:scale-95 gap-2 w-full sm:w-auto"
                >
                  <BookOpen className="h-4 w-4" /> Baca Pasal
                </Button>
              </div>

              <Button
                variant="ghost"
                size="lg"
                onClick={handleCopy}
                className="h-12 px-5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all gap-2 w-full sm:w-auto font-semibold"
              >
                {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                {copied ? <span className="text-emerald-500 font-medium">Tersalin!</span> : <span className="font-medium">Salin</span>}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
