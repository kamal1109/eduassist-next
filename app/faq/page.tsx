"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown, HelpCircle, ShieldCheck, Lock,
    MessageCircle, ShieldAlert, ShoppingBag, Users,
    MessageSquare, FileText, Wallet, Sparkles, ArrowRight
} from "lucide-react";
import Link from "next/link";

// --- DATA FAQ ---
const faqsData = [
    {
        category: "Layanan & Umum",
        icon: <MessageSquare size={24} />,
        items: [
            {
                q: "Apa itu EduAssist dan bagaimana cara kerjanya?",
                a: "EduAssist adalah layanan profesional pencarian responden kuesioner untuk keperluan riset akademik (Skripsi, Tesis, Disertasi). Berbeda dengan platform mandiri yang rumit, di EduAssist Anda cukup kirim link kuesioner, tentukan kriteria, dan tim kami yang akan menyebarkannya ke jaringan komunitas responden kami hingga target tercapai."
            },
            {
                q: "Platform kuesioner apa saja yang didukung?",
                a: "Kami mendukung hampir semua platform survei digital yang populer digunakan di Indonesia, seperti Google Forms, Microsoft Forms, Typeform, SurveyMonkey, hingga Qualtrics."
            },
            {
                q: "Apakah respondennya manusia asli atau bot?",
                a: "Kami menjamin 100% responden adalah MANUSIA ASLI. Kami sangat anti terhadap penggunaan bot karena melanggar etika akademik dan merusak validitas data Anda."
            }
        ]
    },
    {
        category: "Biaya & Pembayaran",
        icon: <Wallet size={24} />,
        items: [
            {
                q: "Berapa biaya jasa responden di EduAssist?",
                a: "Biaya sangat terjangkau bagi mahasiswa, dimulai dari Rp 400 per responden. Anda bisa menggunakan Kalkulator Harga di halaman Layanan untuk estimasi transparan."
            },
            {
                q: "Metode pembayaran apa saja yang tersedia?",
                a: "Kami menerima Transfer Bank (BCA, BNI), E-Wallet (Dana), serta Shopee untuk keamanan ekstra."
            },
            {
                q: "Bagaimana kebijakan Refund?",
                a: "Kami menyediakan garansi uang kembali (Refund) jika kami gagal memenuhi target jumlah responden dalam tenggat waktu yang telah disepakati."
            }
        ]
    },
    {
        category: "Teknis & Jaminan Kualitas",
        icon: <FileText size={24} />,
        items: [
            {
                q: "Apakah data dijamin valid dan reliabel?",
                a: "Tentu. Karena responden kami manusia asli, data memiliki tingkat validitas tinggi saat diuji menggunakan SPSS, SmartPLS, atau SEM-AMOS."
            },
            {
                q: "Apakah kerahasiaan penelitian saya aman?",
                a: "Privasi adalah prioritas mutlak. Identitas peneliti dan data kuesioner tidak akan pernah kami publikasikan atau jual ke pihak ketiga."
            },
            {
                q: "Bisa revisi jika kriteria tidak sesuai?",
                a: "Ya, kami memberikan garansi revisi/penggantian responden GRATIS jika ditemukan data yang outlier parah atau tidak sesuai kriteria inklusi."
            }
        ]
    }
];

export default function FAQPage() {
    const [activeId, setActiveId] = useState<string | null>("0-0");

    const toggleFAQ = (id: string) => {
        setActiveId(activeId === id ? null : id);
    };

    return (
        <main className="bg-[#F8FAFC] text-slate-900 overflow-x-hidden min-h-screen selection:bg-indigo-100 selection:text-indigo-700">

            {/* --- HERO SECTION (STYLE SAMAKAN DENGAN HOME) --- */}
            <section className="relative pt-28 pb-16 md:pt-40 md:pb-28 px-4 sm:px-6 overflow-hidden bg-white border-b border-slate-100">
                <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/70 via-white to-transparent -z-10"></div>

                <div className="container mx-auto max-w-[1600px] flex flex-col items-center justify-center text-center px-4 lg:px-20">

                    {/* BADGE (SAMAKAN DENGAN HOME) */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-indigo-700 font-bold text-xs md:text-sm uppercase tracking-[0.15em] mb-8 shadow-sm"
                    >
                        <HelpCircle size={14} className="fill-indigo-500 text-indigo-500 animate-pulse" />
                        <span>Pusat Bantuan & FAQ</span>
                    </motion.div>

                    {/* H1 HEADER (SAMAKAN DENGAN HOME - TEXT BESAR) */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl xl:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter"
                    >
                        Ada yang Bisa <br className="hidden md:block" />
                        <span className="text-indigo-600 relative inline-block mx-2">
                            Kami Bantu?
                            {/* SVG Underline sama persis */}
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                            </svg>
                        </span>
                    </motion.h1>

                    {/* SUBTITLE (SAMAKAN DENGAN HOME - MAX WIDTH & SIZE) */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-base md:text-xl lg:text-2xl max-w-4xl mx-auto mb-12 font-medium leading-relaxed"
                    >
                        Cari jawaban seputar layanan, pembayaran, dan teknis pengerjaan di sini. Jika tidak menemukan, admin kami siap membantu via WhatsApp.
                    </motion.p>

                    {/* Trust Badges (Opsional - Dipertahankan agar layout seimbang) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-3 md:gap-6"
                    >
                        {[
                            { icon: <Lock size={16} />, text: "Privasi Aman" },
                            { icon: <Users size={16} />, text: "100% Manusia" },
                            { icon: <ShieldCheck size={16} />, text: "Garansi Valid" },
                            { icon: <ShieldAlert size={16} />, text: "Etika Akademik" }
                        ].map((badge, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-slate-600 font-bold text-[10px] md:text-xs uppercase tracking-wider shadow-sm">
                                <span className="text-indigo-600">{badge.icon}</span>
                                {badge.text}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* --- FAQ LIST SECTION --- */}
            <div className="py-12 md:py-20 bg-[#F8FAFC]">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20 min-h-[400px]">
                    <div className="space-y-12 md:space-y-16">
                        {faqsData.map((category, catIdx) => (
                            <div key={catIdx}>
                                {/* Category Header */}
                                <div className="flex items-center gap-4 mb-6 md:mb-8">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
                                        {category.icon}
                                    </div>
                                    <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">{category.category}</h3>
                                </div>

                                {/* FAQ Items */}
                                <div className="grid grid-cols-1 gap-4">
                                    {category.items.map((item, itemIdx) => {
                                        const uniqueId = `${catIdx}-${itemIdx}`;
                                        const isOpen = activeId === uniqueId;

                                        return (
                                            <motion.div
                                                key={uniqueId}
                                                initial={false}
                                                animate={isOpen ? "open" : "closed"}
                                                className={`bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transition-all duration-300 ${isOpen
                                                    ? 'ring-2 ring-indigo-500 shadow-xl shadow-indigo-100 z-10 relative'
                                                    : 'border border-slate-200 hover:border-indigo-300 hover:shadow-md'
                                                    }`}
                                            >
                                                <button
                                                    onClick={() => toggleFAQ(uniqueId)}
                                                    className="w-full px-6 py-5 md:px-10 md:py-8 flex justify-between items-center text-left gap-6 bg-white outline-none"
                                                >
                                                    <span className={`font-bold text-sm md:text-lg leading-snug ${isOpen ? 'text-indigo-700' : 'text-slate-800'}`}>
                                                        {item.q}
                                                    </span>
                                                    <div className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${isOpen ? 'bg-indigo-100 text-indigo-600 rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                                                        <ChevronDown size={20} />
                                                    </div>
                                                </button>
                                                <AnimatePresence>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        >
                                                            <div className="px-6 pb-6 md:px-10 md:pb-10 pt-0 text-slate-600 text-sm md:text-base leading-relaxed border-t border-transparent">
                                                                <div className="w-full h-px bg-slate-100 mb-6 md:mb-8"></div>
                                                                {item.a}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- FINAL CTA --- */}
            <footer className="container mx-auto px-4 pb-20 text-center max-w-[1400px]">
                <div className="p-8 md:p-24 bg-white border border-slate-200 rounded-[2.5rem] md:rounded-[5rem] shadow-sm relative overflow-hidden group text-center flex flex-col items-center">
                    <div className="absolute inset-0 bg-indigo-50/50 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full -z-10 origin-center"></div>

                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-2xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tight leading-tight text-slate-900"
                    >
                        Belum Menemukan <br className="hidden md:block" />
                        <span className="text-indigo-600">Jawaban?</span>
                    </motion.h2>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link
                            href="https://wa.me/6285236110219"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm md:text-lg shadow-xl hover:bg-slate-900 transition-all hover:scale-105 active:scale-95 group"
                        >
                            Chat Admin WhatsApp
                            <MessageCircle size={20} className="group-hover:-rotate-12 transition-transform" />
                        </Link>
                        <Link
                            href="/layanan"
                            className="inline-flex items-center justify-center gap-3 bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-sm md:text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95"
                        >
                            Cek Harga Layanan
                            <ArrowRight size={20} />
                        </Link>
                    </div>

                    <p className="mt-8 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">Fast Response • 24/7 Support • Garansi Kepuasan</p>
                </div>
            </footer>
        </main>
    );
}