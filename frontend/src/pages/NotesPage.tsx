import { useState, useEffect } from 'react'
import { FileText, Plus, Trash2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'

interface Note { 
  id: string
  title: string
  body: string
  createdAt?: string
}

export function NotesPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const storageKey = `notes_${user?.id || 'guest'}`
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const s = localStorage.getItem(storageKey)
      if (s) return JSON.parse(s)
    } catch (e) {}
    return []
  })
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    const s = localStorage.getItem(storageKey)
    if (s) {
      try {
        setNotes(JSON.parse(s))
      } catch (e) {}
    }
  }, [storageKey])

  const save = (arr: Note[]) => {
    setNotes(arr)
    localStorage.setItem(storageKey, JSON.stringify(arr))
  }

  const add = () => {
    if (!title.trim()) return
    const newNote: Note = { 
      id: String(Date.now()), 
      title: title.trim(), 
      body: body.trim(),
      createdAt: new Date().toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })
    }
    save([newNote, ...notes])
    setTitle('')
    setBody('')
  }

  const del = (id: string) => save(notes.filter(n => n.id !== id))

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="pt-8 md:pt-16 pb-8 flex flex-col items-center text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight">
          {t('nav.notes') || 'Catatan'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium max-w-xl mx-auto">
          Tulis renungan, khotbah, atau catatan ayat pribadi.
        </p>
      </div>

      {/* Create Note */}
      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 p-6 md:p-8 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-colors duration-300 shadow-sm mb-12">
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && add()}
            placeholder="Judul catatan..." 
            className="w-full h-14 bg-transparent border-0 text-slate-900 dark:text-white placeholder:text-slate-400 text-2xl font-bold px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none mb-4 shadow-none"
          />
          <textarea 
            value={body} 
            onChange={(e) => setBody(e.target.value)} 
            placeholder="Ketik isi renungan atau catatan Anda di sini..." 
            className="w-full min-h-[140px] bg-transparent border-0 text-slate-600 dark:text-slate-300 placeholder:text-slate-400 text-lg resize-y focus:outline-none focus:ring-0 px-0 leading-relaxed" 
          />
          <div className="flex justify-end pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <Button size="lg" className="rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold px-8 transition-all active:scale-95" onClick={add}>
              <Plus className="h-5 w-5 mr-2" /> Simpan
            </Button>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="max-w-4xl mx-auto">
        {notes.length > 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="flex items-center gap-3 mb-8 px-2">
              <div className="flex h-10 w-10 items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {notes.length} Catatan Tersimpan
                </h2>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {notes.map(n => (
                <div key={n.id} className="group flex flex-col p-6 sm:p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all relative">
                  <div className="flex-1 min-w-0 mb-6">
                    <div className="flex flex-col gap-1 mb-3">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight break-words">{n.title}</h3>
                      {n.createdAt && <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{n.createdAt}</span>}
                    </div>
                    {n.body && <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed whitespace-pre-wrap break-words line-clamp-6">{n.body}</p>}
                  </div>
                  
                  <div className="flex justify-end mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full px-4 transition-colors" 
                      onClick={() => del(n.id)}
                      aria-label="Hapus catatan"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {notes.length === 0 && (
          <div className="flex flex-col items-center mt-10 md:mt-16">
            <div className="text-center max-w-lg mx-auto p-8 sm:p-10 rounded-3xl bg-white/90 dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-700 shadow-lg shadow-black/5 dark:shadow-none backdrop-blur-sm flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mb-6 border border-slate-300 dark:border-slate-700">
                <Sparkles className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                Mulai Menulis
              </span>
              <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center mb-5 text-slate-800 dark:text-slate-100 shadow-sm">
                <FileText className="h-10 w-10 text-slate-800 dark:text-slate-100" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                Belum ada catatan
              </h3>
              <p className="text-base font-medium text-slate-600 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
                Tulis renungan, khotbah, atau inspirasi ayat harian Anda. Catatan akan tersimpan aman.
              </p>
              <div className="w-full flex flex-wrap justify-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                {[
                  'Renungan Pagi Hari',
                  'Khotbah Minggu',
                  'Ayat Favorit Minggu Ini'
                ].map((template, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTitle(template)}
                    className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
                  >
                    + {template}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
