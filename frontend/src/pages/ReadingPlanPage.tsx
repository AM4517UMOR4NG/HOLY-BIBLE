import { useEffect, useMemo, useState } from 'react'
import { ListChecks, CheckCircle2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'

interface PlanItem { id: string; title: string; done: boolean }

export function ReadingPlanPage() {
  const { user } = useAuth()
  const storageKey = useMemo(() => `reading_plan_${user?.id || 'guest'}`, [user?.id])
  const [items, setItems] = useState<PlanItem[]>([])
  const [title, setTitle] = useState('')

  // Load persisted plan
  useEffect(() => {
    const s = localStorage.getItem(storageKey)
    if (s) setItems(JSON.parse(s))
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="sticky top-18 z-10">
        <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] border border-gray-800 shadow-xl">
          <div className="bg-linear-to-br from-indigo-500 via-blue-600 to-sky-500 p-1">
            <div className="rounded-xl bg-[#0f172a] p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-200/10">
                  <ListChecks className="h-6 w-6 text-blue-200" />
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-200 tracking-tight">Rencana Membaca</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Plan */}
      <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-4 shadow-md">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Hari 1 - Mazmur 23 & Yohanes 1"
            className="flex-1 bg-[#0b1220] border-gray-700 text-gray-200 placeholder:text-gray-500"
          />
          <Button onClick={addItem} className="bg-blue-600 hover:bg-blue-700 text-gray-100">
            <Plus className="h-4 w-4 mr-2" /> Tambah
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Buat rencana Anda sendiri. Item yang ditambahkan akan tersimpan di perangkat ini.</p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map((it, idx) => (
          <div
            key={it.id}
            className={`w-full px-4 py-3 rounded-xl border transition-colors flex items-center gap-3 ${
              it.done
                ? 'bg-green-900/20 border-green-700 text-green-300'
                : 'bg-[#1e293b] border-gray-700 text-gray-100 hover:bg-gray-800'
            }`}
          >
            <button onClick={() => toggle(it.id)} className="shrink-0">
              <CheckCircle2 className={`h-5 w-5 ${it.done ? 'text-green-400' : 'text-gray-400'}`} />
            </button>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-200 truncate">{`Hari ${items.length - idx}`}</div>
              <div className="text-sm text-gray-300 opacity-90 truncate">{it.title}</div>
            </div>
            <Button variant="ghost" className="text-gray-400 hover:text-gray-300" onClick={() => remove(it.id)}>
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center text-gray-400 py-10 bg-[#0f172a] border border-gray-800 rounded-2xl">
            Belum ada rencana. Tambahkan item pertama Anda di atas.
          </div>
        )}
      </div>
    </div>
  )
}
