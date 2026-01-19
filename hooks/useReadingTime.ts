import { useMemo } from 'react';

/**
 * Hook untuk menghitung estimasi waktu baca artikel
 * @param text - Teks konten (bisa mengandung HTML tag)
 * @param wpm - Words Per Minute (standar kecepatan baca: 225)
 * @returns number - Estimasi waktu dalam menit
 */
export function useReadingTime(text: string, wpm = 225) {
  const readingTime = useMemo(() => {
    if (!text) return 0;

    // 1. Hapus semua tag HTML (jika teks dari Rich Text Editor)
    const cleanText = text.replace(/<[^>]*>/g, ' ');

    // 2. Hitung jumlah kata (filter string kosong agar akurat)
    const wordCount = cleanText
      .split(/\s+/)
      .filter(word => word.length > 0).length;

    // 3. Hitung waktu (pembulatan ke atas, minimal 1 menit jika ada teks)
    const time = Math.ceil(wordCount / wpm);

    return time > 0 ? time : 1;
  }, [text, wpm]);

  return readingTime;
}