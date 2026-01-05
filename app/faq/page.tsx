"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown,
    HelpCircle,
    ShieldCheck,
    Lock,
    Sparkles,
    MessageCircle,
    CheckCircle2,
    ShieldAlert
} from "lucide-react";
import Link from "next/link";

const faqs = [
    {
        q: "Berapa biaya untuk jasa responden?",
        a: "Biaya dimulai dari Rp 2.000 per responden. Kami mengedepankan transparansi penuh dengan memberikan estimasi harga di awal pengerjaan, memastikan tidak ada biaya tersembunyi yang memberatkan budget mahasiswa."
    },
    {
        q: "Apakah ada garansi pengerjaan?",
        a: "Tentu. Kami memberikan jaminan pengerjaan tepat waktu sesuai deadline yang disepakati. Jika target responden tidak tercapai sesuai kriteria, kami menyediakan kebijakan garansi penuh demi kepuasan akademik Anda."
    },
    {
        q: "Bagaimana dengan validitas data?",
        a: "Kami menjamin 100% responden adalah manusia asli (bukan bot). Data yang dikumpulkan melalui jaringan komunitas kami dipastikan valid dan reliabel untuk diolah dalam pengujian statistik seperti SPSS atau SmartPLS."
    },
    {
        q: "Apakah kerahasiaan penelitian saya terjamin?",
        a: "Privasi adalah prioritas utama kami. EduAssist menjamin kerahasiaan identitas peneliti, link kuesioner, dan data hasil riset. Informasi Anda tidak akan pernah disebarluaskan ke pihak ketiga mana pun."
    },
    {
        q: "Bisa revisi jika kriteria tidak sesuai?",
        a: "Ya. Kami sangat terbuka untuk penyesuaian jika ditemukan responden yang tidak memenuhi kriteria inklusi riset Anda. Tim kami akan melakukan penggantian secara cepat agar riset Anda tetap akurat."
    }
];

export default function FAQPage() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <main className="bg-[#F8FAFC] min-h-screen pt-32 md:pt-40 pb-20 overflow-hidden">
            {/* --- HERO SECTION WITH EMPATHY --- */}
            <div className="container mx-auto px-6 max-w-4xl text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full text-indigo-700 font-bold text-[10px] uppercase tracking-widest mb-6"
                >
                    <HelpCircle size={14} /> Pusat Bantuan EduAssist
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-7xl font-black mb-8 text-slate-900 tracking-tighter"
                >
                    Ada yang Bisa <br /> <span className="text-indigo-600">Kami Bantu?</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto"
                >
                    Kami paham bahwa riset dan skripsi penuh dengan tekanan. EduAssist hadir untuk memberikan kepastian dan solusi cepat bagi kelancaran akademik Anda.
                </motion.p>
            </div>

            {/* --- TRUST BADGES SECTION --- */}
            <div className="container mx-auto px-6 max-w-5xl mb-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: <Lock size={18} />, label: "Privasi Terjamin" },
                        { icon: <CheckCircle2 size={18} />, label: "100% Manusia Asli" },
                        { icon: <ShieldCheck size={18} />, label: "Garansi Validitas" },
                        { icon: <ShieldAlert size={18} />, label: "Etika Akademik" },
                    ].map((badge, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-center gap-3 shadow-sm group hover:border-indigo-200 transition-all">
                            <div className="text-indigo-600 group-hover:scale-110 transition-transform">{badge.icon}</div>
                            <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{badge.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- FAQ ACCORDION --- */}
            <div className="container mx-auto px-6 max-w-4xl mb-24">
                <div className="flex flex-col gap-4">
                    {faqs.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className={`bg-white border transition-all duration-300 rounded-[2.5rem] overflow-hidden shadow-sm ${activeIndex === i ? 'border-indigo-200 ring-4 ring-indigo-50' : 'border-slate-100'}`}
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                                className="w-full px-8 py-8 flex justify-between items-center text-left group"
                            >
                                <span className="font-black text-slate-800 md:text-xl tracking-tight group-hover:text-indigo-600 transition-colors">{item.q}</span>
                                <motion.div
                                    animate={{ rotate: activeIndex === i ? 180 : 0 }}
                                    className={`p-2 rounded-full transition-colors ${activeIndex === i ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-indigo-600'}`}
                                >
                                    <ChevronDown size={24} />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {activeIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                    >
                                        <div className="px-8 pb-8 text-slate-500 leading-relaxed border-t border-slate-50 pt-6 text-lg font-medium">
                                            {item.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* --- SOFT CTA CONVERSION SECTION --- */}
            <section className="container mx-auto px-6 max-w-4xl">
                <div className="bg-slate-950 rounded-[4rem] p-10 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
                    <div className="relative z-10">
                        <Sparkles className="mx-auto text-indigo-400 mb-6" size={40} />
                        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Masih Ada Pertanyaan?</h2>
                        <p className="text-slate-400 text-lg md:text-xl font-medium mb-10 max-w-xl mx-auto">
                            Jangan biarkan kebingungan menghambat progres skripsi Anda. Tim kami siap memberikan konsultasi gratis sekarang.
                        </p>
                        <Link
                            href="https://wa.me/628123456789"
                            className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-white hover:text-indigo-600 px-10 py-5 rounded-3xl font-black text-xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
                        >
                            <MessageCircle size={24} /> Konsultasi Gratis Sekarang
                        </Link>
                    </div>
                </div>

                {/* Micro Stat Footer */}
                <div className="mt-12 text-center text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">
                    Dipercaya 10.000+ Mahasiswa | Rating 4.9/5.0 Shopee
                </div>
            </section>
        </main>
    );
}