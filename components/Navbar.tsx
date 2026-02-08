"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    // Sembunyikan Navbar di halaman admin
    if (pathname.startsWith("/admin")) {
        return null;
    }

    // Efek scroll untuk mengubah background navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // UPDATE: Urutan Menu Lebih Profesional (Trust flow)
    const navLinks = [
        { name: "Beranda", href: "/" },
        { name: "Tentang Kami", href: "/tentang" },     // Trust Building
        { name: "Layanan & Harga", href: "/layanan" },  // Core Product
        { name: "Panduan Order", href: "/paduan-order" }, // How-to
        { name: "FAQ", href: "/faq" },                  // Handling Objections
        { name: "Artikel", href: "/artikel" },          // Extra Value
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isOpen
                    ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
                    : "bg-transparent py-6 md:py-8"
                    }`}
            >
                {/* Container disamakan dengan page lain (max-w-[1600px]) */}
                <div className="container mx-auto px-4 sm:px-6 max-w-[1600px] flex justify-between items-center">

                    {/* --- LOGO --- */}
                    <Link href="/" className="flex items-center gap-1 group relative z-50">
                        <div className="text-2xl md:text-4xl font-black tracking-tighter flex items-center">
                            {/* WARNA EDU: #f9a825 (Kuning Emas) */}
                            <span className="text-[#f9a825]">EDU</span>

                            {/* WARNA ASSIST: #0a4191 (Biru Tua) */}
                            <span className="text-[#0a4191]">ASSIST</span>

                            <span className="text-[#0a4191]">.</span>
                        </div>
                    </Link>

                    {/* --- DESKTOP MENU --- */}
                    <div className="hidden lg:flex items-center gap-8 xl:gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-base xl:text-lg font-extrabold tracking-wide transition-all duration-200 relative py-2 group ${pathname === link.href
                                    ? "text-[#0a4191]" // Aktif jadi Biru Tua
                                    : "text-slate-600 hover:text-[#0a4191]"
                                    }`}
                            >
                                {link.name}
                                {/* Garis bawah animasi */}
                                <span className={`absolute bottom-0 left-0 h-[3px] bg-[#f9a825] transition-all duration-300 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                                    }`}></span>
                            </Link>
                        ))}
                    </div>

                    {/* --- CTA BUTTON (Desktop) --- */}
                    <div className="hidden lg:block">
                        <Link
                            href="https://wa.me/6285236110219"
                            target="_blank"
                            className="bg-[#0a4191] text-white px-7 py-3 xl:px-9 xl:py-4 rounded-full text-base xl:text-lg font-bold hover:bg-[#f9a825] hover:text-[#0a4191] transition-all duration-300 shadow-lg hover:shadow-orange-200 active:scale-95 flex items-center gap-2"
                        >
                            Konsultasi Gratis
                        </Link>
                    </div>

                    {/* --- MOBILE MENU BUTTON --- */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden text-[#0a4191] p-2 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none relative z-50"
                    >
                        {isOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
                    </button>
                </div>
            </nav>

            {/* --- MOBILE MENU OVERLAY --- */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="fixed inset-0 top-0 z-40 bg-white lg:hidden flex flex-col pt-28 px-6 pb-10 overflow-y-auto h-screen"
                    >
                        <div className="flex flex-col gap-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center justify-between p-5 rounded-2xl text-lg font-extrabold transition-all border-2 ${pathname === link.href
                                        ? "bg-blue-50 border-[#0a4191] text-[#0a4191]"
                                        : "bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-100"
                                        }`}
                                >
                                    <span>{link.name}</span>
                                    {pathname === link.href ? (
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#f9a825]" />
                                    ) : (
                                        <ChevronRight size={24} className="text-slate-400" />
                                    )}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-auto pt-8">
                            <Link
                                href="https://wa.me/6285236110219"
                                target="_blank"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center w-full bg-[#0a4191] text-white p-5 rounded-2xl text-xl font-bold hover:bg-[#f9a825] hover:text-[#0a4191] transition-all shadow-xl shadow-slate-200 active:scale-95"
                            >
                                Konsultasi via WhatsApp
                            </Link>

                            <p className="text-center text-slate-400 text-xs mt-8 font-bold uppercase tracking-widest">
                                © {new Date().getFullYear()} EduAssist Indonesia
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}