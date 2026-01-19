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

    // 1. LOGIKA PENTING: Sembunyikan Navbar di Halaman Admin
    if (pathname.startsWith("/admin")) {
        return null;
    }

    // 2. Deteksi Scroll untuk efek Glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Beranda", href: "/" },
        { name: "Layanan & Harga", href: "/layanan" },
        { name: "Artikel", href: "/artikel" },
        { name: "Panduan Order", href: "/paduan-order" }, // Typo fix: biasanya panduan
        { name: "FAQ", href: "/faq" },
        { name: "Tentang", href: "/tentang" },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isOpen
                        ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
                        : "bg-transparent py-6"
                    }`}
            >
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl flex justify-between items-center">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors">
                            EDUASSIST
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-bold transition-colors ${pathname === link.href
                                        ? "text-indigo-600"
                                        : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button Desktop */}
                    <div className="hidden lg:block">
                        <Link
                            href="https://wa.me/6285236110219"
                            target="_blank"
                            className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95"
                        >
                            Konsultasi Gratis
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 top-[70px] z-40 bg-white border-t border-slate-100 lg:hidden overflow-y-auto"
                    >
                        <div className="p-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center justify-between p-4 rounded-xl font-bold transition-colors ${pathname === link.href
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    {link.name}
                                    <ChevronRight size={16} className="opacity-50" />
                                </Link>
                            ))}
                            <div className="pt-4 mt-4 border-t border-slate-100">
                                <Link
                                    href="https://wa.me/6285236110219"
                                    target="_blank"
                                    className="flex items-center justify-center w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-lg"
                                >
                                    Konsultasi Gratis
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}