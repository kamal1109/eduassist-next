import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "../components/Navbar"; // Pakai ../ agar terbaca

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata = {
    title: "EduAssist | Jasa Kuesioner No.1 Indonesia",
    description: "Dapatkan responden kuesioner valid dan cepat. Data 100% manusia asli, garansi validitas untuk penelitian skripsi dan tesis Anda.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id" className="scroll-smooth">
            <body className={`${jakarta.className} bg-white text-slate-900 antialiased`}>
                <Navbar />
                {children}
            </body>
        </html>
    );
}