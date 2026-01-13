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
    ShieldAlert,
    ShoppingBag,
    ArrowRight,
    Users,
    GraduationCap,
    Star,
    Check,
    MessageSquare
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

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <main className="bg-[#F8FAFC] text-slate-900 overflow-x-hidden min-h-screen selection:bg-indigo-100 selection:text-indigo-700">

            {/* --- HERO SECTION --- */}
            <section className="relative pt-20 pb-12 md:pt-32 md:pb-24 px-4 sm:px-6 overflow-hidden bg-white">
                <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/70 via-white to-transparent -z-10"></div>

                <div className="container mx-auto max-w-6xl flex flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full text-indigo-700 font-bold text-xs md:text-sm uppercase tracking-[0.15em] mb-6 md:mb-8 shadow-sm"
                    >
                        <HelpCircle className="w-3 h-3 md:w-5 md:h-5 text-indigo-600" />
                        <span className="text-[11px] md:text-sm">Pusat Bantuan EduAssist</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.15] mb-4 md:mb-8 tracking-tight text-center"
                    >
                        Ada yang Bisa{" "}
                        <span className="text-indigo-600 relative inline-block text-center">
                            Kami Bantu?
                            <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                            </svg>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-sm sm:text-base md:text-xl lg:text-2xl max-w-3xl mx-auto mb-8 md:mb-14 font-medium leading-relaxed text-center px-2"
                    >
                        Kami paham bahwa riset dan skripsi penuh dengan tekanan. EduAssist hadir untuk memberikan kepastian dan solusi cepat bagi kelancaran akademik Anda.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-2xl px-2">
                        <Link
                            href="https://wa.me/6285236110219"
                            target="_blank"
                            className="w-full sm:w-auto bg-slate-900 text-white px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2 group"
                        >
                            <MessageCircle className="w-4 h-4 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
                            Konsultasi via WhatsApp
                        </Link>
                        <Link
                            href="https://id.shp.ee/RoYtQCu"
                            target="_blank"
                            className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:border-indigo-400 hover:shadow-md transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4 md:w-6 md:h-6 text-orange-500" />
                            Lihat di Shopee
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- TRUST BADGES SECTION --- */}
            <section className="py-12 md:py-20 bg-slate-100/50 border-y border-slate-200/60">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                        {[
                            { icon: <Lock className="w-4 h-4 md:w-5 md:h-5" />, label: "Privasi Terjamin" },
                            { icon: <Check className="w-4 h-4 md:w-5 md:h-5" />, label: "100% Asli" },
                            { icon: <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />, label: "Garansi Valid" },
                            { icon: <ShieldAlert className="w-4 h-4 md:w-5 md:h-5" />, label: "Etika Akademik" },
                        ].map((badge, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                whileHover={{ y: -5 }}
                                className="bg-white p-4 md:p-8 rounded-xl md:rounded-[2.5rem] border border-slate-200/60 shadow-lg shadow-slate-200/20 hover:shadow-xl hover:border-indigo-200 transition-all text-center group"
                            >
                                <div className="w-10 h-10 md:w-16 md:h-16 bg-indigo-50 rounded-lg md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                    <div className="text-indigo-600">{badge.icon}</div>
                                </div>
                                <h3 className="text-xs md:text-lg font-black text-slate-900 uppercase tracking-[0.05em] md:tracking-[0.1em] leading-tight">
                                    {badge.label}
                                </h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- STATS SECTION --- */}
            <section className="container mx-auto px-4 sm:px-6 py-12 md:py-20 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="bg-white p-6 md:p-10 rounded-xl md:rounded-[3rem] border border-slate-200/60 shadow-lg shadow-slate-200/20 text-center hover:shadow-2xl hover:border-indigo-200 transition-all"
                    >
                        <div className="w-12 h-12 md:w-20 md:h-20 bg-indigo-50 rounded-xl md:rounded-3xl flex items-center justify-center mx-auto mb-3 md:mb-6">
                            <Users className="w-6 h-6 md:w-10 md:h-10 text-indigo-600" />
                        </div>
                        <div className="text-2xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-1 md:mb-2 leading-none">10.000+</div>
                        <div className="text-slate-500 font-bold uppercase tracking-[0.1em] text-[10px] md:text-sm">Mahasiswa Berhasil Lulus</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="bg-slate-950 p-6 md:p-10 rounded-xl md:rounded-[3rem] border border-slate-800 shadow-lg shadow-slate-900/20 text-center hover:shadow-2xl hover:border-indigo-500 transition-all text-white"
                    >
                        <div className="w-12 h-12 md:w-20 md:h-20 bg-indigo-500/20 rounded-xl md:rounded-3xl flex items-center justify-center mx-auto mb-3 md:mb-6">
                            <Star className="w-6 h-6 md:w-10 md:h-10 text-indigo-300" />
                        </div>
                        <div className="text-2xl md:text-5xl lg:text-6xl font-black mb-1 md:mb-2 leading-none">4.9/5.0</div>
                        <div className="text-indigo-200 font-bold uppercase tracking-[0.1em] text-[10px] md:text-sm">Rating Shopee</div>
                    </motion.div>
                </div>

                {/* --- FAQ SECTION --- */}
                <div className="mb-12 md:mb-20">
                    <h2 className="text-2xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 md:mb-12 leading-tight tracking-tight text-center">
                        Pertanyaan{" "}
                        <span className="text-indigo-600 relative inline-block">
                            yang Sering Diajukan
                            <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                            </svg>
                        </span>
                    </h2>

                    <div className="space-y-2 md:space-y-4 max-w-4xl mx-auto">
                        {faqs.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1 }}
                                className={`bg-white border transition-all duration-300 rounded-xl md:rounded-[2.5rem] overflow-hidden shadow-lg shadow-slate-200/20 hover:shadow-xl ${activeIndex === i
                                    ? 'border-indigo-200 ring-1 md:ring-4 ring-indigo-50'
                                    : 'border-slate-200/60 hover:border-indigo-200'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleFAQ(i)}
                                    className="w-full px-4 md:px-10 py-4 md:py-8 flex justify-between items-center text-left group"
                                    aria-expanded={activeIndex === i}
                                    aria-controls={`faq-answer-${i}`}
                                >
                                    <span className="font-bold md:font-black text-slate-900 text-sm md:text-xl lg:text-2xl tracking-tight group-hover:text-indigo-600 transition-colors pr-4 text-left">
                                        {item.q}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: activeIndex === i ? 180 : 0 }}
                                        className={`p-1.5 md:p-3 rounded-lg md:rounded-2xl transition-all flex-shrink-0 ${activeIndex === i
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                            : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'
                                            }`}
                                    >
                                        <ChevronDown className="w-4 h-4 md:w-6 md:h-6" />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {activeIndex === i && (
                                        <motion.div
                                            id={`faq-answer-${i}`}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-4 md:px-10 pb-4 md:pb-8 text-slate-500 text-sm md:text-lg leading-relaxed border-t border-slate-100 pt-4 md:pt-8">
                                                {item.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="container mx-auto px-4 sm:px-6 py-12 md:py-20 max-w-7xl">
                <div className="bg-indigo-600 rounded-xl md:rounded-[3rem] lg:rounded-[4rem] p-6 md:p-12 lg:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 shadow-3xl shadow-indigo-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] bg-indigo-500/30 rounded-full blur-[40px] md:blur-[80px] lg:blur-[100px] -mr-8 md:-mr-24 -mt-8 md:-mt-24 transition-transform group-hover:scale-125 duration-700"></div>

                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-6 leading-tight tracking-tight">
                            Masih Ada <br />
                            Pertanyaan?
                        </h2>
                        <p className="text-indigo-100 text-sm md:text-lg lg:text-xl font-medium opacity-90">
                            Jangan biarkan kebingungan menghambat progres skripsi Anda. Tim kami siap memberikan konsultasi gratis sekarang.
                        </p>
                    </div>

                    <Link
                        href="https://wa.me/6285236110219"
                        target="_blank"
                        className="relative z-10 bg-white text-indigo-600 px-6 md:px-12 py-3 md:py-6 rounded-xl md:rounded-3xl font-bold md:font-black text-base md:text-xl shadow-2xl hover:bg-slate-900 hover:text-white transition-all whitespace-nowrap active:scale-95 flex items-center gap-2 group/btn"
                    >
                        <MessageCircle className="w-4 h-4 md:w-6 md:h-6" />
                        <span>Konsultasi Gratis</span>
                        <ArrowRight className="w-3 h-3 md:w-5 md:h-5 group-hover/btn:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <footer className="container mx-auto px-4 sm:px-6 pb-12 md:pb-20 text-center">
                <div className="p-6 md:p-12 lg:p-24 bg-white border border-slate-200 rounded-xl md:rounded-[3rem] lg:rounded-[5rem] shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-50/50 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full -z-10 origin-center"></div>

                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-6xl lg:text-8xl font-black mb-4 md:mb-10 tracking-tight leading-[1.1] text-slate-900"
                    >
                        Mulai Riset Anda{" "}
                        <span className="text-indigo-600 block md:inline">Hari Ini?</span>
                    </motion.h2>

                    <Link
                        href="https://wa.me/6285236110219"
                        target="_blank"
                        className="inline-flex items-center gap-3 bg-indigo-600 text-white px-6 md:px-10 lg:px-16 py-3 md:py-5 lg:py-7 rounded-lg md:rounded-2xl font-bold md:font-black text-base md:text-xl lg:text-2xl shadow-xl hover:bg-slate-900 transition-all hover:scale-105 active:scale-95 group"
                    >
                        Mulai Konsultasi Sekarang
                        <MessageSquare className="w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <p className="mt-4 md:mt-8 text-slate-400 font-bold text-[10px] md:text-sm uppercase tracking-[0.15em] md:tracking-[0.2em]">Fast Response • 24/7 Support • Garansi Kepuasan</p>
                </div>
            </footer>
        </main>
    );
}