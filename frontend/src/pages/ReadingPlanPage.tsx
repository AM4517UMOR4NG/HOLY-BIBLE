import { useEffect, useMemo, useState } from 'react'
import { ListChecks, CheckCircle2, Plus, Trash2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'

interface PlanItem { id: string; title: string; done: boolean }

export function ReadingPlanPage() {
  const { user } = useAuth()
  const storageKey = useMemo(() => `reading_plan_${user?.id || 'guest'}`, [user?.id])
  const [items, setItems] = useState<PlanItem[]>(() => {
    try {
      const s = localStorage.getItem(`reading_plan_${user?.id || 'guest'}`)
      if (s) return JSON.parse(s)
    } catch (e) {}
    return []
  })
  const [title, setTitle] = useState('')

  // Load persisted plan
  useEffect(() => {
    try {
      const s = localStorage.getItem(storageKey)
      if (s) setItems(JSON.parse(s))
    } catch (e) {}
  }, [storageKey])

  const persist = (arr: PlanItem[]) => {
    setItems(arr)
    localStorage.setItem(storageKey, JSON.stringify(arr))
  }

  const addItem = () => {
    const t = title.trim()
    if (!t) return
    const next: PlanItem = { id: String(Date.now()), title: t, done: false }
    persist([next, ...items])
    setTitle('')
  }

  const toggle = (id: string) => persist(items.map(it => it.id === id ? { ...it, done: !it.done } : it))
  const remove = (id: string) => persist(items.filter(it => it.id !== id))

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="pt-8 md:pt-14 pb-8 flex flex-col items-center text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight">
          Rencana Membaca
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium max-w-xl mx-auto mb-8 md:mb-10">
          Buat rencana membaca Anda sendiri. Pantau progress pembacaan harian Anda.
        </p>

        {/* Create Plan Input */}
        <div className="w-full max-w-xl mx-auto px-4 sm:px-0">
          <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-full border-2 border-slate-400 dark:border-slate-500 hover:border-slate-500 shadow-md focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:shadow-xl transition-all duration-300">
            <div className="pl-6 pr-2 flex items-center justify-center">
              <ListChecks className="h-6 w-6 text-slate-400" />
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Hari 1 - Mazmur 23 & Yohanes 1"
              className="w-full bg-transparent border-0 h-16 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none text-slate-900 dark:text-white px-3 shadow-none placeholder:text-slate-400 font-medium"
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <div className="pr-2">
              <Button onClick={addItem} size="icon" variant="ghost" className="h-12 w-12 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all active:scale-95">
                <Plus className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      {items.length > 0 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <ListChecks className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {items.length} Rencana
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {items.filter(i => i.done).length} selesai
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {items.map((it, idx) => (
              <div
                key={it.id}
                className={`group p-4 sm:p-6 rounded-2xl transition-colors relative border border-transparent flex items-center gap-4 ${
                  it.done
                    ? 'hover:bg-emerald-50/80 dark:hover:bg-emerald-900/20'
                    : 'hover:bg-gray-50/80 dark:hover:bg-slate-800/40'
                }`}
              >
                <button onClick={() => toggle(it.id)} className="shrink-0 transition-transform active:scale-90">
                  <CheckCircle2 className={`h-8 w-8 ${it.done ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600 hover:text-emerald-400 dark:hover:text-emerald-500 transition-colors'}`} />
                </button>
                
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className={`inline-flex items-center gap-2 font-semibold text-lg ${it.done ? 'text-emerald-900 dark:text-emerald-100' : 'text-blue-600 dark:text-blue-400'}`}>
                      {`Hari ${items.length - idx}`}
                    </div>
                    <div className={`text-xl sm:text-2xl leading-loose font-serif mt-2 ${it.done ? 'text-emerald-700/80 dark:text-emerald-300/80 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
                      {it.title}
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl shrink-0 transition-all self-end sm:self-auto" 
                    onClick={() => remove(it.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="flex flex-col items-center mt-10 md:mt-16">
          <div className="text-center max-w-lg mx-auto p-8 sm:p-10 rounded-3xl bg-white/90 dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-700 shadow-lg shadow-black/5 dark:shadow-none backdrop-blur-sm flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mb-6 border border-slate-300 dark:border-slate-700">
              <Sparkles className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
              Mulai Rencana Baru
            </span>
            <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center mb-5 text-slate-800 dark:text-slate-100 shadow-sm">
              <ListChecks className="h-10 w-10 text-slate-800 dark:text-slate-100" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
              Belum ada rencana
            </h3>
            <p className="text-base font-medium text-slate-600 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
              Tambahkan item target bacaan pertama Anda melalui form di atas atau pilih saran cepat di bawah ini.
            </p>
            <div className="w-full flex flex-wrap justify-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              {[
                'Hari 1 - Kejadian 1-3 & Matius 1',
                'Hari 1 - Mazmur 1-5 (Hikmat)',
                'Hari 1 - Injil Yohanes 1'
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setTitle(suggestion)}
                  className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
