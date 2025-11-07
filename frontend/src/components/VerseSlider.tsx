import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getBibleChapter } from '@/lib/bibleApi'

interface SlideItem {
  ref: { abbr: string; chapter: number; verse: number }
  text: string
  book: string
}

export function VerseSlider() {
  const { language } = useLanguage()
  const [slides, setSlides] = useState<SlideItem[]>([])
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
      const out: SlideItem[] = []
      for (const r of refs) {
        const data = await getBibleChapter(r.abbr, r.chapter, language)
        if (data && data.verses) {
          const v = data.verses.find((x: any) => x.verse === r.verse)
          if (v) out.push({ ref: r, text: v.text, book: v.book_name || '', })
        }
      }
      if (!cancelled && out.length > 0) {
        setSlides(out)
        setIndex(0)
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
    <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] border border-gray-800 shadow-xl mb-6">
      <div className="grid md:grid-cols-2">
        {/* Spiritual photo */}
        <div className="relative h-56 md:h-72 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
            alt="Spiritual"
            className={`absolute inset-0 h-full w-full object-cover opacity-90 transform transition-all duration-500 ease-out ${
              animIn ? 'opacity-90 scale-100' : 'opacity-0 scale-[1.02]'
            }`}
          />
          <div className="absolute inset-0 bg-linear-to-tr from-black/50 via-transparent to-black/20" />
        </div>
        {/* Verse content */}
        <div className="p-6 md:p-8 flex flex-col justify-center gap-4">
          <div className={`text-sm text-blue-300/90 font-medium transition-all duration-500 ease-out ${
            animIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            {current.book} {current.ref.chapter}:{current.ref.verse}
          </div>
          <div className={`text-xl md:text-2xl leading-relaxed text-gray-100 transition-all duration-500 ease-out ${
            animIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            {current.text}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setAuto(!auto)}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              {auto ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button
              onClick={goNext}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="ml-auto flex items-center gap-1">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-6 rounded-full ${i === index ? 'bg-blue-400' : 'bg-gray-600'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
