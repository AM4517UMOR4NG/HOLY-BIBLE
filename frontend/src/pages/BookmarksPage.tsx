import { Bookmark, Trash2, BookOpen, Calendar, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BookmarkItem {
  id: number
  book: string
  chapter: number
  verse: number
  text: string
  note?: string
  createdAt: string
}

// Mock bookmarks
const mockBookmarks: BookmarkItem[] = [
  {
    id: 1,
    book: "John",
    chapter: 3,
    verse: 16,
    text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    note: "My favorite verse",
    createdAt: "2025-11-06"
  },
  {
    id: 2,
    book: "Psalm",
    chapter: 23,
    verse: 1,
    text: "The LORD is my shepherd; I shall not want.",
    createdAt: "2025-11-05"
  },
  {
    id: 3,
    book: "Genesis",
    chapter: 1,
    verse: 1,
    text: "In the beginning God created the heaven and the earth.",
    note: "The beginning of everything",
    createdAt: "2025-11-04"
  },
]

export function BookmarksPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 md:p-12 text-white shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Bookmark className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">My Bookmarks</h1>
              <p className="text-blue-100 text-sm md:text-base mt-1">
                {mockBookmarks.length} saved verse{mockBookmarks.length !== 1 ? 's' : ''} for reflection and study
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 max-w-2xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{mockBookmarks.length}</div>
              <div className="text-xs text-blue-100">Saved</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{new Set(mockBookmarks.map(b => b.book)).size}</div>
              <div className="text-xs text-blue-100">Books</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{mockBookmarks.filter(b => b.note).length}</div>
              <div className="text-xs text-blue-100">Notes</div>
            </div>
          </div>
        </div>
      </div>

      {mockBookmarks.length > 0 ? (
        <div className="space-y-4">
          {mockBookmarks.map((bookmark) => (
            <div 
              key={bookmark.id} 
              className="group bg-[#1e293b] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-blue-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 bg-blue-600/20 rounded-lg shrink-0">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {bookmark.book} {bookmark.chapter}:{bookmark.verse}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Saved on {new Date(bookmark.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                  >
                    Read →
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-base leading-relaxed text-gray-200 mb-4 pl-14">
                {bookmark.text}
              </p>

              {bookmark.note && (
                <div className="pl-14">
                  <div className="flex items-start gap-2 p-4 bg-[#0f172a] rounded-xl border border-gray-700">
                    <Heart className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-300 mb-1">Personal Note:</p>
                      <p className="text-sm text-gray-400 italic">"{bookmark.note}"</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#1e293b] rounded-3xl p-12 border border-gray-700 shadow-xl">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-flex p-4 bg-blue-500/10 rounded-2xl mb-6">
              <Bookmark className="h-16 w-16 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold mb-3 text-white">No Bookmarks Yet</h3>
            <p className="text-gray-400 mb-8 text-lg">
              Start reading and save verses that inspire you for easy access later
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
              onClick={() => {
                window.history.pushState({}, '', '/')
                window.dispatchEvent(new PopStateEvent('popstate'))
              }}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Start Reading
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
