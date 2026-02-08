import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from '@next/third-parties/google';

// Konfigurasi Font
const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-jakarta",
    display: "swap",
});

// 1. Config Viewport
export const viewport: Viewport = {
    themeColor: "#4f46e5",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

// 2. Metadata Config (SEO)
export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://eduassist.id'),

    title: {
        default: "EduAssist | Jasa Pencarian Responden No.1 Indonesia",
        template: "%s | EduAssist"
    },
    description: "Jasa pencari responden kuesioner valid & cepat untuk skripsi dan tesis. Data 100% manusia asli, sesuai kriteria, dan bergaransi. Konsultasi gratis!",
    keywords: ["jasa pencari responden", "jasa responden skripsi", "jasa kuesioner", "responden kuesioner", "jasa sebar kuesioner", "responden penelitian", "penelitian skripsi", "data valid", "survey online", "riset akademik"],
    authors: [{ name: "EduAssist Team", url: "https://eduassist.id" }],
    creator: "EduAssist",
    publisher: "EduAssist",

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

    openGraph: {
        type: "website",
        locale: "id_ID",
        url: "https://eduassist.id",
        title: "EduAssist | Jasa Kuesioner No.1 Indonesia",
        description: "Solusi cari responden kuesioner kilat & valid. Garansi uang kembali jika data tidak reliabel.",
        siteName: "EduAssist",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "EduAssist Banner",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "EduAssist | Jasa Kuesioner Valid",
        description: "Bantu sebar kuesioner skripsi & tesis ke responden manusia asli.",
        images: ["/twitter-image.png"],
        creator: "@eduassist_id",
    },

    other: {
        "business:contact_data:phone_number": "6285236110219",
        "business:contact_data:email": "salsabellajyhtry@gmail.com",
        "business:contact_data:country": "Indonesia",
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id" className="scroll-smooth">
            <body className={`${jakarta.className} ${jakarta.variable} bg-white text-slate-900 antialiased min-h-screen flex flex-col`}>

                {/* Navbar Global */}
                <Navbar />

                {/* Konten Utama (flex-grow mendorong footer ke bawah) */}
                <main className="flex-grow">
                    {children}
                </main>

                {/* Footer Global */}
                <Footer />

                {/* 2. TAMBAHAN KOMPONEN GOOGLE ANALYTICS (ID SUDAH TERPASANG) */}
                <GoogleAnalytics gaId="G-KSR3H9LYH4" />

            </body>
        </html>
    );
}