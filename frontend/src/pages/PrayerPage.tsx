import { useState, useEffect } from 'react'
import { MessageSquare, Plus, Trash2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'

interface Prayer { 
  id: string
  title: string
  done: boolean 
}

export function PrayerPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const storageKey = `prayers_${user?.id || 'guest'}`
  const [items, setItems] = useState<Prayer[]>(() => {
    try {
      const s = localStorage.getItem(storageKey)
      if (s) return JSON.parse(s)
    } catch (e) {}
    return []
  })
  const [text, setText] = useState('')

  useEffect(() => {
    const s = localStorage.getItem(storageKey)
    if (s) {
      try {
        setItems(JSON.parse(s))
      } catch (e) {}
    }
  }, [storageKey])

  const save = (arr: Prayer[]) => {
    setItems(arr)
    localStorage.setItem(storageKey, JSON.stringify(arr))
  }

  const add = () => {
    if (!text.trim()) return
    save([{ id: String(Date.now()), title: text.trim(), done: false }, ...items])
    setText('')
  }

  const toggle = (id: string) => save(items.map(i => i.id === id ? { ...i, done: !i.done } : i))
  const del = (id: string) => save(items.filter(i => i.id !== id))

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="pt-8 md:pt-12 pb-8 flex flex-col items-center text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">
          {t('nav.prayer') || 'Catatan Doa'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium max-w-xl mx-auto">
          Catat dan pantau pokok-pokok doa Anda.
        </p>
      </div>

      {/* Create Prayer */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-400 dark:border-slate-700 rounded-2xl p-6 md:p-8 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative flex items-center bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-400 dark:border-slate-500 focus-within:border-black dark:focus-within:border-white transition-colors">
            <Input 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && add()}
              placeholder="Tulis pokok doa Anda..." 
              className="w-full bg-transparent border-0 h-14 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none text-slate-900 dark:text-white px-6 shadow-none placeholder:text-slate-400 font-medium" 
            />
          </div>
          <Button onClick={add} size="lg" className="h-14 px-8 rounded-xl bg-black hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black font-bold transition-all shrink-0">
            <Plus className="h-5 w-5 mr-2" /> Tambah
          </Button>
        </div>
      </div>

      {/* Prayers List */}
      <div className="space-y-4 pb-12">
        {items.map(i => (
          <div 
            key={i.id} 
            className={`w-full px-6 py-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
              i.done
                ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-900 border-black dark:border-slate-700'
            }`}
          >
            <button onClick={() => toggle(i.id)} className="shrink-0 transition-transform active:scale-90">
              <Check className={`h-8 w-8 p-1.5 rounded-full border-2 ${
                i.done 
                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                  : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-emerald-400 hover:text-emerald-400 transition-colors'
              }`} />
            </button>
            <div className="flex-1 min-w-0 px-2">
              <span className={`text-xl font-bold tracking-tight block truncate ${
                i.done ? 'line-through text-emerald-700/80 dark:text-emerald-300/80' : 'text-slate-900 dark:text-white'
              }`}>
                {i.title}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl shrink-0 transition-colors" 
              onClick={() => del(i.id)}
              aria-label="Hapus doa"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center text-slate-500 dark:text-slate-400 py-16 bg-white dark:bg-slate-900 border-2 border-slate-400 dark:border-slate-700 rounded-2xl">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-400 dark:text-slate-600" />
            <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">Belum ada pokok doa</p>
            <p className="text-base font-medium opacity-70">Tambahkan doa pertama Anda di atas.</p>
          </div>
        )}
      </div>
    </div>
  )
}
