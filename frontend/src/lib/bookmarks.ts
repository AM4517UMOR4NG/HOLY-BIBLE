export interface BookmarkItem {
  id: string
  book: string
  bookAbbr: string
  chapter: number
  verse: number
  text: string
  note?: string
  createdAt: string
}

const STORAGE_KEY = 'user_bookmarks'

// Initial default bookmarks to showcase if none exist
const DEFAULT_BOOKMARKS: BookmarkItem[] = [
  {
    id: 'default-1',
    book: "John",
    bookAbbr: "jhn",
    chapter: 3,
    verse: 16,
    text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    note: "My favorite verse",
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-2',
    book: "Psalm",
    bookAbbr: "psa",
    chapter: 23,
    verse: 1,
    text: "The LORD is my shepherd; I shall not want.",
    createdAt: new Date().toISOString()
  }
]

export function getBookmarks(): BookmarkItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOOKMARKS))
      return DEFAULT_BOOKMARKS
    }
    return JSON.parse(raw) || []
  } catch (e) {
    console.error('Failed to read bookmarks:', e)
    return []
  }
}

export function saveBookmarks(items: BookmarkItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    window.dispatchEvent(new CustomEvent('bookmarks_updated'))
  } catch (e) {
    console.error('Failed to save bookmarks:', e)
  }
}

export function addBookmark(item: { book: string; bookAbbr: string; chapter: number; verse: number; text: string; note?: string }): BookmarkItem {
  const current = getBookmarks()
  const exists = current.find(b => 
    (b.bookAbbr.toLowerCase() === item.bookAbbr.toLowerCase() || b.book.toLowerCase() === item.book.toLowerCase()) &&
    b.chapter === item.chapter &&
    b.verse === item.verse
  )
  if (exists) return exists

  const newBookmark: BookmarkItem = {
    id: String(Date.now()),
    ...item,
    createdAt: new Date().toISOString()
  }
  saveBookmarks([newBookmark, ...current])
  return newBookmark
}

export function removeBookmark(id: string): void {
  const current = getBookmarks()
  saveBookmarks(current.filter(b => b.id !== id))
}

export function isBookmarked(bookAbbr: string, chapter: number, verse: number): boolean {
  const current = getBookmarks()
  const cleanAbbr = (bookAbbr || '').toLowerCase()
  return current.some(b => 
    (b.bookAbbr.toLowerCase() === cleanAbbr || b.book.toLowerCase() === cleanAbbr) &&
    b.chapter === chapter &&
    b.verse === verse
  )
}
