import { useState, useEffect } from 'react'
import { MessageSquare, Plus, Trash2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'

interface Prayer { id: string; title: string; done: boolean }

export function PrayerPage() {
  const { user } = useAuth()
  const storageKey = `prayers_${user?.id || 'guest'}`
  const [items, setItems] = useState<Prayer[]>([])
  const [text, setText] = useState('')

  useEffect(() => {
    const s = localStorage.getItem(storageKey)
    if (s) setItems(JSON.parse(s))
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
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-pink-600 via-purple-600 to-indigo-700 p-6 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-7 w-7" />
          <h1 className="text-2xl font-bold">Halaman Doa</h1>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-2xl p-4 border border-gray-700 flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Tulis doa..." className="bg-[#0f172a] border-gray-700 text-white" />
        <Button onClick={add} className="bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4 mr-1" />Tambah</Button>
      </div>

      <div className="space-y-3">
        {items.map(i => (
          <div key={i.id} className="bg-[#1e293b] rounded-xl p-4 border border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => toggle(i.id)} className={`h-6 w-6 rounded border ${i.done ? 'bg-green-500/40 border-green-500' : 'border-gray-600'}`}>{i.done && <Check className="h-4 w-4" />}</button>
              <span className={`text-white ${i.done ? 'line-through text-gray-400' : ''}`}>{i.title}</span>
            </div>
            <Button variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => del(i.id)}><Trash2 className="h-5 w-5" /></Button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center text-gray-400 py-10">Belum ada doa</div>
        )}
      </div>
    </div>
  )
}
