"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuItems = [
        { name: "Beranda", href: "/" },
        { name: "Layanan", href: "/layanan" },
        { name: "Tentang", href: "/tentang" },
        { name: "Artikel", href: "/artikel" },
        { name: "FAQ", href: "/faq" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-lg border-b border-slate-100 shadow-sm">
            <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl md:text-3xl font-black text-blue-600 tracking-tighter">
                    Edu<span className="text-amber-500">Assist</span>
                </Link>

                <div className="hidden md:flex gap-10 text-base font-bold text-slate-700">
                    {menuItems.map((item) => (
                        <Link key={item.href} href={item.href} className="hover:text-blue-600 transition-colors relative group py-2">
                            {item.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link href="https://wa.me/628123456789" className="hidden sm:flex bg-[#25D366] text-white px-6 py-2.5 rounded-xl text-sm font-black hover:bg-[#20bd5a] transition shadow-md items-center gap-2">
                        <MessageCircle size={18} /> Hubungi Kami
                    </Link>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-700 hover:bg-slate-50 rounded-lg">
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-slate-100 p-8 flex flex-col gap-6 shadow-2xl">
                    {menuItems.map((item) => (
                        <Link key={item.href} onClick={() => setIsMenuOpen(false)} href={item.href} className="text-lg font-bold text-slate-700">{item.name}</Link>
                    ))}
                </div>
            )}
        </nav>
    );
}