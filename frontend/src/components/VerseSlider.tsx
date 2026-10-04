import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getBibleChapter } from '@/lib/bibleApi'

interface SlideItem {
  ref: { abbr: string; chapter: number; verse: number }
  text: string
  book: string
}

const DEFAULT_SLIDES_ID: SlideItem[] = [
  { ref: { abbr: 'psa', chapter: 23, verse: 1 }, book: 'Mazmur', text: 'TUHAN adalah gembalaku, takkan kekurangan aku.' },
  { ref: { abbr: 'jhn', chapter: 3, verse: 16 }, book: 'Yohanes', text: 'Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.' },
  { ref: { abbr: 'rom', chapter: 8, verse: 28 }, book: 'Roma', text: 'Kita tahu sekarang, bahwa Allah turut bekerja dalam segala sesuatu untuk mendatangkan kebaikan bagi mereka yang mengasihi Dia, yaitu bagi mereka yang terpanggil sesuai dengan rencana Allah.' },
  { ref: { abbr: 'isa', chapter: 41, verse: 10 }, book: 'Yesaya', text: 'Janganlah takut, sebab Aku menyertai engkau, janganlah bimbang, sebab Aku ini Allahmu; Aku akan meneguhkan, bahkan akan menolong engkau; Aku akan memegang engkau dengan tangan kanan-Ku yang membawa kemenangan.' },
  { ref: { abbr: 'php', chapter: 4, verse: 13 }, book: 'Filipi', text: 'Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.' }
]

const DEFAULT_SLIDES_EN: SlideItem[] = [
  { ref: { abbr: 'psa', chapter: 23, verse: 1 }, book: 'Psalm', text: 'The LORD is my shepherd; I shall not want.' },
  { ref: { abbr: 'jhn', chapter: 3, verse: 16 }, book: 'John', text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
  { ref: { abbr: 'rom', chapter: 8, verse: 28 }, book: 'Romans', text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.' },
  { ref: { abbr: 'isa', chapter: 41, verse: 10 }, book: 'Isaiah', text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.' },
  { ref: { abbr: 'php', chapter: 4, verse: 13 }, book: 'Philippians', text: 'I can do all things through Christ which strengtheneth me.' }
]

export function VerseSlider() {
  const { language } = useLanguage()
  const [slides, setSlides] = useState<SlideItem[]>(() => 
    language === 'id' ? DEFAULT_SLIDES_ID : DEFAULT_SLIDES_EN
  )
  const [index, setIndex] = useState(0)
  const [auto, setAuto] = useState(true)
  const timer = useRef<number | null>(null)
  const [animIn, setAnimIn] = useState(true)

  const refs = useMemo(
    () => [
      { abbr: 'psa', chapter: 23, verse: 1 },
      { abbr: 'jhn', chapter: 3, verse: 16 },
      { abbr: 'rom', chapter: 8, verse: 28 },
      { abbr: 'isa', chapter: 41, verse: 10 },
      { abbr: 'php', chapter: 4, verse: 13 }
    ],
    []
  )

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      // Use Promise.all for parallel API calls
      const results = await Promise.all(
        refs.map(r => getBibleChapter(r.abbr, r.chapter, language))
      )

      const out: SlideItem[] = []
      results.forEach((data, idx) => {
        if (data && data.verses) {
          const r = refs[idx]
          const v = data.verses.find((x: any) => x.verse === r.verse)
          if (v) out.push({ ref: r, text: v.text, book: v.book_name || '' })
        }
      })

      if (!cancelled && out.length > 0) {
        setSlides(out)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [language, refs])

  useEffect(() => {
    if (!auto || slides.length === 0) return
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5000)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [auto, slides])

  // trigger animation on index change
  useEffect(() => {
    setAnimIn(false)
    const id = window.setTimeout(() => setAnimIn(true), 30)
    return () => window.clearTimeout(id)
  }, [index])

  if (slides.length === 0) return null

  const goPrev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)
  const goNext = () => setIndex((i) => (i + 1) % slides.length)

  const current = slides[index]

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0f172a] border border-gray-100 dark:border-gray-800 shadow-xl mb-6">
      <div className="grid md:grid-cols-2">
        {/* Spiritual photo */}
        <div className="relative h-56 md:h-72 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&q=75&fm=webp"
            alt="Spiritual"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width="720"
            height="288"
            className={`absolute inset-0 h-full w-full object-cover opacity-90 transform transition-all duration-500 ease-out ${animIn ? 'opacity-90 scale-100' : 'opacity-0 scale-[1.02]'
              }`}
          />
          <div className="absolute inset-0 bg-linear-to-tr from-black/50 via-transparent to-black/20" />
        </div>
        {/* Verse content */}
        <div className="p-6 md:p-8 flex flex-col justify-center gap-4">
          <div className={`text-sm text-blue-600 dark:text-blue-300/90 font-medium transition-all duration-500 ease-out ${animIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
            {current.book} {current.ref.chapter}:{current.ref.verse}
          </div>
          <div className={`text-xl md:text-2xl leading-relaxed text-gray-800 dark:text-gray-100 transition-all duration-500 ease-out ${animIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
            {current.text}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setAuto(!auto)}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              {auto ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button
              onClick={goNext}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="ml-auto flex items-center gap-1">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-6 rounded-full ${i === index ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
