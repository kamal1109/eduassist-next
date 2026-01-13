import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "../components/Navbar"; // Pakai ../ agar terbaca

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-jakarta", // Optional: untuk CSS variable
});

export const metadata = {
    title: "EduAssist | Jasa Kuesioner No.1 Indonesia",
    description: "Dapatkan responden kuesioner valid dan cepat. Data 100% manusia asli, garansi validitas untuk penelitian skripsi dan tesis Anda.",
    keywords: "jasa kuesioner, responden kuesioner, penelitian skripsi, data valid, survey online, riset akademik, kuesioner online",
    authors: [{ name: "EduAssist" }],
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
        description: "Dapatkan responden kuesioner valid dan cepat. Data 100% manusia asli, garansi validitas untuk penelitian skripsi dan tesis Anda.",
        siteName: "EduAssist",
        images: [
            {
                url: "/og-image.png", // Anda perlu membuat file ini
                width: 1200,
                height: 630,
                alt: "EduAssist - Jasa Kuesioner No.1 Indonesia",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "EduAssist | Jasa Kuesioner No.1 Indonesia",
        description: "Dapatkan responden kuesioner valid dan cepat. Data 100% manusia asli, garansi validitas untuk penelitian skripsi dan tesis Anda.",
        images: ["/twitter-image.png"], // Anda perlu membuat file ini
        creator: "@eduassist_id",
    },
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id" className="scroll-smooth">
            <head>
                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <meta name="theme-color" content="#4f46e5" /> {/* Warna Indigo-600 */}

                {/* Meta untuk WhatsApp Business */}
                <meta property="business:contact_data:phone_number" content="6285236110219" />
                <meta property="business:contact_data:email" content="eduassist@gmail.com" />
                <meta property="business:contact_data:country" content="Indonesia" />

                {/* Verification untuk Google Search Console jika ada */}
                {/* <meta name="google-site-verification" content="your-verification-code" /> */}
            </head>
            <body className={`${jakarta.className} bg-white text-slate-900 antialiased min-h-screen flex flex-col`}>
                <Navbar />
                <main className="flex-grow">
                    {children}
                </main>
                {/* Anda bisa menambahkan Footer di sini jika nanti ada */}
                {/* <Footer /> */}
            </body>
        </html>
    );
}