import { useState, useEffect } from 'react'
import { Bookmark, Trash2, BookOpen, BookMarked, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getBookmarks, removeBookmark, BookmarkItem } from '@/lib/bookmarks'
import { useTranslation } from 'react-i18next'

export function BookmarksPage() {
  const { t } = useTranslation()
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(getBookmarks)

  useEffect(() => {
    setBookmarks(getBookmarks())
    const handleUpdate = () => setBookmarks(getBookmarks())
    window.addEventListener('bookmarks_updated', handleUpdate)
    return () => window.removeEventListener('bookmarks_updated', handleUpdate)
  }, [])

  const handleRead = (bookmark: BookmarkItem) => {
    localStorage.setItem('current_reading', JSON.stringify({
      book: bookmark.bookAbbr || bookmark.book,
      chapter: bookmark.chapter,
      verse: bookmark.verse
    }))
    window.history.pushState({}, '', '/')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const handleDelete = (id: string) => {
    removeBookmark(id)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="pt-8 md:pt-12 pb-4 flex flex-col items-center text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight">
          {t('nav.bookmarks') || 'My Bookmarks'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium max-w-xl mx-auto mb-12">
          Koleksi ayat-ayat favorit dan catatan pribadi Anda.
        </p>

        {/* Minimalist Stats */}
        {bookmarks.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{bookmarks.length}</span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tersimpan</span>
            </div>
            <div className="w-px h-12 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{new Set(bookmarks.map(b => b.book)).size}</span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Kitab</span>
            </div>
            <div className="w-px h-12 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{bookmarks.filter(b => b.note).length}</span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Catatan</span>
            </div>
          </div>
        )}
      </div>

      {bookmarks.length > 0 ? (
        <div className="space-y-4 pb-12">
          {bookmarks.map((bookmark) => (
            <div 
              key={bookmark.id}
              className="group p-4 sm:p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors relative border border-black dark:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="pt-1 hidden sm:block">
                    <Bookmark className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                      {bookmark.book} {bookmark.chapter}:{bookmark.verse}
                    </h3>
                    <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                      Tersimpan pada {new Date(bookmark.createdAt).toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button 
                    variant="ghost" 
                    className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold transition-colors"
                    onClick={() => handleRead(bookmark)}
                  >
                    Baca
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors shrink-0"
                    onClick={() => handleDelete(bookmark.id)}
                    aria-label="Hapus markah"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <blockquote className="text-xl md:text-2xl font-serif leading-relaxed text-slate-800 dark:text-slate-200 pl-0 sm:pl-9">
                "{bookmark.text}"
              </blockquote>

              {bookmark.note && (
                <div className="mt-4 sm:pl-9">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-l-4 border-slate-300 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Catatan Pribadi</p>
                    <p className="text-base text-slate-700 dark:text-slate-300">{bookmark.note}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-500 dark:text-slate-400 py-20 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 border-dashed dark:border-slate-800 rounded-[2rem]">
          <BookMarked className="h-16 w-16 mx-auto mb-6 text-slate-300 dark:text-slate-700" />
          <h3 className="text-2xl font-black mb-3 text-slate-900 dark:text-white tracking-tight">Belum Ada Markah</h3>
          <p className="text-lg font-medium opacity-70 mb-8 max-w-sm mx-auto">
            Mulai membaca dan tandai ayat-ayat yang menginspirasi Anda.
          </p>
          <Button 
            size="lg"
            className="h-14 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-bold shadow-lg shadow-black/10 dark:shadow-white/10 transition-all active:scale-95 gap-2"
            onClick={() => {
              window.history.pushState({}, '', '/')
              window.dispatchEvent(new PopStateEvent('popstate'))
            }}
          >
            <BookOpen className="h-5 w-5" />
            Mulai Membaca
          </Button>
        </div>
      )}
    </div>
  )
}
