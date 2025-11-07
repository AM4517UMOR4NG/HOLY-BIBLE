import { useEffect, useState } from 'react'
import { Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getBibleVerse, BIBLE_BOOKS } from '@/lib/bibleApi'
import { useLanguage } from '@/contexts/LanguageContext'

export function DailyVersePage() {
  const { language } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [ref, setRef] = useState('')

  const fetchRandom = async () => {
    setLoading(true)
    const book = BIBLE_BOOKS[Math.floor(Math.random() * BIBLE_BOOKS.length)]
    const chapter = Math.floor(Math.random() * book.chapters) + 1
    const verse = Math.floor(Math.random() * 20) + 1
    const data = await getBibleVerse(book.abbr, chapter, verse, language)
    if (data) {
      setText(data.text)
      setRef(`${data.book_name} ${data.chapter}:${data.verse}`)
    }
    setLoading(false)
  }

  useEffect(() => { fetchRandom() }, [language])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-600 via-blue-600 to-sky-600 p-8 text-white shadow-xl mb-6 flex items-center gap-3">
        <Calendar className="h-8 w-8" />
        <h1 className="text-2xl font-bold">Ayat Harian</h1>
      </div>

      <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-300">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat ayat...
          </div>
        ) : (
          <>
            <div className="text-blue-400 font-semibold mb-2">{ref}</div>
            <p className="text-gray-100 text-lg leading-relaxed">{text}</p>
            <div className="mt-6">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={fetchRandom}>Ayat Baru</Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
