import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * UTILITY 1: Class Name Merger
 * Menggabungkan class Tailwind tanpa konflik (Penting untuk UI modern)
 * Contoh: cn("bg-red-500", isActive && "bg-blue-500") -> "bg-blue-500" (red tertimpa)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * UTILITY 2: Reading Time Calculator
 * Menghitung estimasi waktu baca artikel
 */
export function getReadingTime(text: string, wpm = 225): string {
  if (!text) return "1 menit baca";

  // 1. Hapus tag HTML
  const cleanText = text.replace(/<[^>]*>/g, ' ');

  // 2. Hitung jumlah kata (filter string kosong)
  const wordCount = cleanText.split(/\s+/).filter(word => word.length > 0).length;

  // 3. Hitung waktu (minimal 1 menit)
  const readTime = Math.ceil(wordCount / wpm);

  return `${readTime > 0 ? readTime : 1} menit baca`;
}

/**
 * UTILITY 3: Format Rupiah
 * Mengubah angka menjadi format IDR (Rp 10.000)
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * UTILITY 4: Format Tanggal Indonesia
 * Contoh: 25 Oktober 2023
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * UTILITY 5: Truncate Text
 * Memotong teks panjang dan menambah "..." di akhir
 */
export function truncateText(text: string, length: number): string {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}