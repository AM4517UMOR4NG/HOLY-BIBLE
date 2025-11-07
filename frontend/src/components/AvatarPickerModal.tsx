import { useRef, useState } from 'react'
import { X, Upload } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

const PRESETS = [
  'https://img.freepik.com/vektor-gratis/ilustrasi-pria-muda-tersenyum_1308-174669.jpg?semt=ais_hybrid&w=740&q=80',
  'https://img.freepik.com/free-vector/smiling-blonde-boy-hoodie_1308-174731.jpg?semt=ais_hybrid&w=740&q=80',
  'https://img.freepik.com/free-vector/woman-with-braided-hair-illustration_1308-174675.jpg?semt=ais_hybrid&w=740&q=80',
  'https://img.freepik.com/free-vector/young-woman-with-braided-hair_1308-176626.jpg?semt=ais_hybrid&w=740&q=80',
  'https://img.freepik.com/psd-gratis/ilustrasi-3d-dari-avatar-atau-profil-manusia_23-2150671142.jpg?semt=ais_hybrid&w=740&q=80'
]

export function AvatarPickerModal({ open, onClose, onSelect }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  if (!open) return null

  const handleFile = (file?: File | null) => {
    if (!file) return
    const reader = new FileReader()
    setUploading(true)
    reader.onload = () => {
      const dataUrl = reader.result as string
      onSelect(dataUrl)
      setUploading(false)
      onClose()
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md bg-[#0f172a] border border-gray-700 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h3 className="text-white font-semibold">Choose Avatar</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <div className="grid grid-cols-5 gap-3">
              {PRESETS.map((src) => (
                <button key={src} onClick={() => { onSelect(src); onClose() }} className="relative rounded-full overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors">
                  <img src={src} alt="avatar" className="h-16 w-16 object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e)=>handleFile(e.target.files?.[0])} />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-60"
              disabled={uploading}
            >
              <Upload className="h-4 w-4" /> {uploading ? 'Uploading...' : 'Upload from device'}
            </button>
            <p className="text-xs text-gray-500 mt-2">Max 2MB disarankan. Gambar disimpan lokal pada perangkat Anda.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
