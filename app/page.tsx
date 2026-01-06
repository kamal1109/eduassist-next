"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Users, ShieldCheck, Sparkles, MessageCircle, Zap,
    MousePointerClick, Star, ShoppingBag, ChevronLeft,
    ChevronRight, ShieldIcon, CheckIcon, ChevronDown,
    ArrowRight,
    Search,
    PenTool
} from "lucide-react";

// Data Ulasan dengan tambahan Konteks (UX Point #4)
const shopeeReviews = [
    { name: "dahliamarufi12", context: "Skripsi S1 Manajemen", review: "seller responsif amanah dan gercep, terima kasih seller sukses selalu", rating: 5 },
    { name: "sammian420", context: "Penelitian SEM-PLS", review: "Aman derr, normal dan valid P value < 0.001 semua dan reliabel cronbach alpha diatas 0.700. Thanks!", rating: 5 },
    { name: "muhammadriyani835", context: "Tesis Psikologi", review: "Pengisiannya cepat selesai dan jawabannya benar-benar dibaca gak sembarangan klik", rating: 5 },
    { name: "r*****n", context: "Olah Data SPSS", review: "Pengerjaannya tidak asal sehingga saat diuji validitas hasilnya valid dan reliabel!", rating: 5 },
];

export default function Home() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <main className="bg-[#F8FAFC] text-slate-900 overflow-x-hidden min-h-screen pb-24 md:pb-0">

            {/* --- FIX 2: STICKY BOTTOM CTA (Mobile Only) --- */}
            <div className="fixed bottom-6 left-0 w-full px-6 z-50 md:hidden">
                <Link href="https://wa.me/628123456789" className="flex items-center justify-center gap-3 bg-green-500 text-white py-4 rounded-2xl font-black shadow-2xl active:scale-95 transition-all border-2 border-white/20">
                    <MessageCircle size={24} />
                    Konsultasi Gratis (WA)
                </Link>
            </div>

            {/* --- HERO SECTION (Hierarchy Level 1) --- */}
            <section className="relative pt-20 md:pt-32 pb-16 px-6 overflow-hidden bg-white">
                <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-indigo-50/50 via-white to-[#F8FAFC] -z-10"></div>
                <div className="container mx-auto max-w-6xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full text-indigo-700 font-bold text-[10px] md:text-sm uppercase tracking-widest mb-8 shadow-sm"
                    >
                        <Sparkles size={14} className="fill-indigo-500 text-indigo-500" />
                        Jasa Kuesioner No.1 Indonesia
                    </motion.div>

                    <motion.h1 className="text-4xl md:text-8xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tighter">
                        Riset Selesai <br /> <span className="text-indigo-600">Nggak Sendirian.</span>
                    </motion.h1>

                    <motion.p className="text-slate-500 text-base md:text-2xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                        “Dari proposal sampai skripsi, kami bantu cari responden asli.” Validitas terjamin untuk hasil olah data yang sempurna.
                    </motion.p>

                    {/* CTA Utama (UX Point #2: Sederhanakan Pilihan) */}
                    <div className="flex flex-col gap-3 justify-center items-center">
                        <Link href="https://wa.me/628123456789" className="w-full md:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3">
                            Konsultasi via WhatsApp <ArrowRight size={20} />
                        </Link>
                        <Link href="https://id.shp.ee/RoYtQCu" className="text-slate-400 font-bold text-sm hover:text-orange-500 transition-all flex items-center gap-2">
                            atau cek Toko Shopee <ShoppingBag size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- FIX 3: HOW IT WORKS (Mental Flow) --- */}
            <section className="py-16 px-6 bg-white border-y border-slate-100">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-4xl font-black mb-10 text-center tracking-tight">3 Langkah Riset Beres</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Konsultasi", desc: "Sampaikan kebutuhan & target responden kamu.", icon: <MessageCircle /> },
                            { step: "02", title: "Penyebaran", desc: "Kami sebar kuesioner ke kriteria yang tepat.", icon: <Zap /> },
                            { step: "03", title: "Terima Data", desc: "Data siap diolah (SPSS/PLS/Amos).", icon: <CheckIcon /> },
                        ].map((item, i) => (
                            <div key={i} className="relative p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <span className="text-4xl font-black text-indigo-100 absolute top-4 right-6">{item.step}</span>
                                <div className="text-indigo-600 mb-4">{item.icon}</div>
                                <h4 className="font-black text-lg mb-1">{item.title}</h4>
                                <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- BENTO GRID (Trust Section) --- */}
            <section className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
                    {/* Card Utama (Primary Trust) */}
                    <div className="lg:col-span-7 bg-slate-950 rounded-[2.5rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-600/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                        <div className="relative z-10">
                            <h3 className="text-5xl md:text-8xl font-black tracking-tighter mb-2 leading-none">10k+</h3>
                            <p className="text-lg md:text-2xl font-bold text-slate-300">Mahasiswa telah terbantu lulus tepat waktu.</p>
                            <div className="mt-8 flex items-center gap-2 bg-white/5 border border-white/10 w-fit px-4 py-2 rounded-xl">
                                <Star size={14} className="fill-amber-400 text-amber-400" />
                                <span className="text-xs font-black">4.9/5 RATING SHOPEE</span>
                            </div>
                        </div>
                    </div>

                    {/* Card Fitur (Secondary) */}
                    <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-1 gap-4">
                        {[
                            { title: "Manusia Asli", icon: <Users size={20} />, bg: "bg-blue-50", text: "text-blue-600" },
                            { title: "Kilat", icon: <Zap size={20} />, bg: "bg-amber-50", text: "text-amber-500" },
                            { title: "Validitas", icon: <ShieldCheck size={20} />, bg: "bg-emerald-50", text: "text-emerald-600" },
                            { title: "Custom", icon: <MousePointerClick size={20} />, bg: "bg-purple-50", text: "text-purple-600" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
                                <div className={`w-10 h-10 shrink-0 ${item.bg} ${item.text} rounded-xl flex items-center justify-center`}>{item.icon}</div>
                                <h4 className="text-xs md:text-lg font-black text-slate-900 leading-tight">{item.title}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS (With Context) --- */}
            <section className="py-16 bg-slate-900 text-white rounded-[3rem] mx-4 md:mx-0">
                <div className="container mx-auto px-6 mb-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2">Cerita Sukses.</h2>
                    <p className="text-slate-400 text-sm font-bold">Ulasan terverifikasi dari Shopee.</p>
                </div>

                <div className="relative px-6">
                    <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide py-4 no-scrollbar snap-x snap-mandatory">
                        {shopeeReviews.map((t, i) => (
                            <div key={i} className="shrink-0 w-[280px] md:w-[350px] bg-white/5 p-8 rounded-[2.5rem] border border-white/10 flex flex-col snap-start">
                                <div className="flex gap-0.5 mb-4 text-[#FFB800]">
                                    {[...Array(5)].map((_, idx) => <Star key={idx} size={14} fill="currentColor" strokeWidth={0} />)}
                                </div>
                                <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed mb-6 italic">"{t.review}"</p>
                                <div className="mt-auto pt-4 border-t border-white/5">
                                    <h4 className="font-black text-white text-sm mb-1">{t.name}</h4>
                                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-lg font-bold uppercase">{t.context}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FIX 6: RISK REVERSAL --- */}
            <section className="px-6 py-16 text-center">
                <div className="max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
                        <ShieldCheck size={32} />
                    </div>
                    <h3 className="text-2xl font-black mb-4">Garansi Validitas 100%</h3>
                    <p className="text-slate-500 font-medium">
                        Jika data tidak lolos uji validitas/reliabilitas awal, kami bantu revisi pola jawaban atau tambah responden <strong>Tanpa Biaya Tambahan.</strong>
                    </p>
                </div>
            </section>

            {/* --- FIX 1: S&K ACCORDION (Hierarchy Level 3) --- */}
            <section className="container mx-auto px-6 pb-24">
                <div className="bg-indigo-600 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl">
                    <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight tracking-tight">Kustomisasi & <br className="hidden md:block" /> Protocol</h2>

                    <div className="space-y-3">
                        {[
                            { q: "Apa itu Protocol S&K?", a: "Kami melarang konten SARA, Pornografi, dan mewajibkan fitur 'Record Email' dimatikan demi privasi responden." },
                            { q: "Berapa minimal order?", a: "Pemesanan minimal adalah 30 responden untuk menjamin distribusi data yang baik." },
                            { q: "Bisa request demografi spesifik?", a: "Bisa! Kami menyediakan filter umur, pekerjaan, domisili, hingga kriteria khusus lainnya." },
                        ].map((item, i) => (
                            <div key={i} className="bg-indigo-700/50 rounded-2xl border border-indigo-400/30 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm md:text-lg"
                                >
                                    {item.q}
                                    <ChevronDown size={20} className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-5 pb-5 text-indigo-100 text-sm md:text-base font-medium"
                                        >
                                            {item.a}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <footer className="px-6 pb-12 text-center">
                <div className="py-16 bg-white border border-slate-200 rounded-[3rem] shadow-sm overflow-hidden relative">
                    <h2 className="text-3xl md:text-6xl font-black mb-8 tracking-tight text-slate-900">Mulai Riset Kamu <br /> Hari Ini.</h2>
                    <Link href="https://wa.me/628123456789" className="bg-indigo-600 text-white px-8 py-5 rounded-2xl font-black text-lg shadow-xl inline-block active:scale-95 transition-all">
                        Konsultasi Gratis Sekarang
                    </Link>
                </div>
            </footer>
        </main>
    );
}