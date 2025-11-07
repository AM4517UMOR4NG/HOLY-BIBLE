import { useState, useEffect } from 'react'
import { FileText, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'

interface Note { id: string; title: string; body: string }

export function NotesPage() {
  const { user } = useAuth()
  const storageKey = `notes_${user?.id || 'guest'}`
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    const s = localStorage.getItem(storageKey)
    if (s) setNotes(JSON.parse(s))
  }, [storageKey])

  const save = (arr: Note[]) => {
    setNotes(arr)
    localStorage.setItem(storageKey, JSON.stringify(arr))
  }

  const add = () => {
    if (!title.trim()) return
    save([{ id: String(Date.now()), title: title.trim(), body: body.trim() }, ...notes])
    setTitle(''); setBody('')
  }

  const del = (id: string) => save(notes.filter(n => n.id !== id))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <FileText className="h-7 w-7" />
          <h1 className="text-2xl font-bold">Catatan</h1>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-2xl p-4 border border-gray-700 space-y-3">
        <Input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Judul catatan" className="bg-[#0f172a] border-gray-700 text-white" />
        <textarea value={body} onChange={(e)=>setBody(e.target.value)} placeholder="Isi catatan" className="w-full min-h-[100px] px-3 py-2 bg-[#0f172a] border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none" />
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={add}><Plus className="h-4 w-4 mr-1" />Simpan</Button>
      </div>

      <div className="space-y-3">
        {notes.map(n => (
          <div key={n.id} className="bg-[#1e293b] rounded-xl p-4 border border-gray-700">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-white font-semibold">{n.title}</h3>
                {n.body && <p className="text-gray-300 mt-1 whitespace-pre-wrap">{n.body}</p>}
              </div>
              <Button variant="ghost" className="text-red-400 hover:text-red-300" onClick={()=>del(n.id)}><Trash2 className="h-5 w-5" /></Button>
            </div>
          </div>
        ))}
        {notes.length === 0 && <div className="text-center text-gray-400 py-10">Belum ada catatan</div>}
      </div>
    </div>
  )
}
