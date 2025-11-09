import crypto from 'crypto';

export function verseChecksum(text: string, chapterNumber: number, verseNumber: number): string {
  const h = crypto.createHash('sha256');
  h.update(`${chapterNumber}:${verseNumber}:${text}`);
  return h.digest('hex');
}





