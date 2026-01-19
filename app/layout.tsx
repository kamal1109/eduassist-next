import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "../components/Navbar";
import type { Metadata, Viewport } from "next";

// Konfigurasi Font
const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-jakarta",
    display: "swap",
});

// 1. Config Viewport (Wajib dipisah di Next.js 14+)
export const viewport: Viewport = {
    themeColor: "#4f46e5",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

// 2. Metadata Config (SEO)
export const metadata: Metadata = {
    // Ganti dengan domain asli saat deploy production
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://eduassist.id'),

    title: {
        default: "EduAssist | Jasa Kuesioner No.1 Indonesia",
        template: "%s | EduAssist"
    },
    description: "Dapatkan responden kuesioner valid dan cepat. Data 100% manusia asli, garansi validitas untuk penelitian skripsi dan tesis Anda.",
    keywords: ["jasa kuesioner", "responden kuesioner", "penelitian skripsi", "data valid", "survey online", "riset akademik", "kuesioner online", "olah data"],
    authors: [{ name: "EduAssist Team", url: "https://eduassist.id" }],
    creator: "EduAssist",
    publisher: "EduAssist",

    // Konfigurasi Icon Lengkap
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },

    // Konfigurasi Robot Search Engine
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    // Open Graph (Facebook/LinkedIn/WhatsApp Preview)
    openGraph: {
        type: "website",
        locale: "id_ID",
        url: "https://eduassist.id",
        title: "EduAssist | Jasa Kuesioner No.1 Indonesia",
        description: "Solusi cari responden kuesioner kilat & valid. Garansi uang kembali jika data tidak reliabel.",
        siteName: "EduAssist",
        images: [
            {
                url: "/og-image.png", // Pastikan file ini ada di folder /public
                width: 1200,
                height: 630,
                alt: "EduAssist Banner",
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: "summary_large_image",
        title: "EduAssist | Jasa Kuesioner Valid",
        description: "Bantu sebar kuesioner skripsi & tesis ke responden manusia asli.",
        images: ["/twitter-image.png"], // Pastikan file ini ada di folder /public
        creator: "@eduassist_id",
    },

    // Metadata Tambahan
    other: {
        "business:contact_data:phone_number": "6285236110219",
        "business:contact_data:email": "admin@eduassist.id",
        "business:contact_data:country": "Indonesia",
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id" className="scroll-smooth">
            <body className={`${jakarta.className} ${jakarta.variable} bg-white text-slate-900 antialiased min-h-screen flex flex-col`}>

                {/* Navbar akan muncul di semua halaman. 
                    Pastikan handle logic hide di dalam component Navbar jika masuk route /admin */}
                <Navbar />

                <main className="flex-grow">
                    {children}
                </main>

                {/* Anda bisa menambahkan <Footer /> di sini nanti */}
            </body>
        </html>
    );
}