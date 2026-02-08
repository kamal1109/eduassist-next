"use client";

import { motion } from "framer-motion";
import {
    Target,
    Users,
    Award,
    ShieldCheck,
    TrendingUp,
    Heart,
    Send,
    BarChart3,
    Check,
    MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function TentangPage() {
    const stats = [
        { label: "Klien Terlayani", value: "10.000+", icon: <Users size={28} className="text-indigo-600" /> },
        { label: "Rating Shopee", value: "4.9/5.0", icon: <Award size={28} className="text-amber-500" /> },
        { label: "Data Valid", value: "100%", icon: <ShieldCheck size={28} className="text-emerald-500" /> },
    ];

    const steps = [
        { title: "Kirim Kuesioner", desc: "Berikan link kuesioner & kriteria responden Anda.", icon: <Send size={24} /> },
        { title: "Penyebaran Real", desc: "Kami sebar ke jaringan responden manusia asli.", icon: <Users size={24} /> },
        { title: "Data Siap Olah", desc: "Terima hasil valid yang siap masuk SPSS/PLS.", icon: <BarChart3 size={24} /> },
    ];

    const values = [
        {
            title: "Integritas Data",
            desc: "Kami menjamin setiap responden adalah manusia asli (bukan bot) untuk menjaga kualitas penelitian Anda.",
            icon: <ShieldCheck size={32} className="text-indigo-600" />
        },
        {
            title: "Kecepatan Express",
            desc: "Memahami deadline mahasiswa yang mepet, kami menyediakan layanan pengerjaan kurang dari 1 jam.",
            icon: <TrendingUp size={32} className="text-indigo-600" />
        },
        {
            title: "Empati Akademik",
            desc: "Lahir dari kebutuhan mahasiswa, kami berkomitmen memberikan harga yang paling terjangkau di kelasnya.",
            icon: <Heart size={32} className="text-indigo-600" />
        }
    ];

    // Array logo kampus 1-36
    const campusLogos = Array.from({ length: 36 }, (_, i) => `/kampus/${i + 1}.png`);

    // Duplikasi logo 3x agar scrolling terlihat 'infinite' (tidak putus)
    const infiniteLogos = [...campusLogos, ...campusLogos, ...campusLogos];

    // --- LOGIC AUTO SCROLL + DRAG ---
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationFrameId: number;
        const speed = 0.5; // Kecepatan scroll

        const scroll = () => {
            if (!isPaused) {
                if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth / 3)) {
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += speed;
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused]);

    return (
        <main className="bg-[#F8FAFC] text-slate-900 overflow-x-hidden min-h-screen selection:bg-indigo-100 selection:text-indigo-700 font-sans">

            {/* --- HERO SECTION (Updated to Match Home) --- */}
            <section className="relative pt-28 pb-16 md:pt-40 md:pb-28 px-4 sm:px-6 overflow-hidden bg-white border-b border-slate-100">
                <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/70 via-white to-transparent -z-10"></div>

                <div className="container mx-auto max-w-[1600px] flex flex-col items-center justify-center text-center px-4 lg:px-20">

                    {/* Badge Style: Identik dengan Home */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-indigo-700 font-bold text-xs md:text-sm uppercase tracking-[0.15em] mb-8 shadow-sm"
                    >
                        <Target size={14} className="fill-indigo-500 text-indigo-500 animate-pulse" />
                        <span>Mengenal EduAssist</span>
                    </motion.div>

                    {/* Headline: Identik dengan Home */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl xl:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter"
                    >
                        Data Valid. <br />
                        <span className="text-indigo-600 relative inline-block mx-2">
                            Lulus Lebih Cepat
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                            </svg>
                        </span>
                    </motion.h1>

                    {/* Description: Identik dengan Home */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-base md:text-xl lg:text-2xl max-w-4xl mx-auto mb-12 font-medium leading-relaxed"
                    >
                        EduAssist hadir untuk menghapus drama responden dalam riset Anda. Kami memastikan data yang Anda terima valid, reliabel, dan akurat untuk sidang skripsi tanpa hambatan.
                    </motion.p>
                </div>
            </section>

            {/* --- CAMPUS LOGO SECTION --- */}
            <section className="py-16 bg-white border-y border-slate-100 overflow-hidden">
                <div className="container mx-auto px-6 mb-12 text-center">
                    <p className="text-slate-400 font-bold text-xs md:text-sm uppercase tracking-[0.3em] mb-2">
                        Telah Membantu Mahasiswa & Peneliti Dari
                    </p>
                    <div className="h-1 w-12 bg-indigo-600 mx-auto rounded-full"></div>
                </div>

                {/* Logo Slider Container */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing py-4"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                >
                    <div className="flex space-x-16 px-6">
                        {infiniteLogos.map((logo, index) => (
                            <div
                                key={index}
                                className="relative flex-none w-40 h-24 md:w-52 md:h-28 select-none"
                            >
                                <Image
                                    src={logo}
                                    alt={`Logo Kampus ${index}`}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    sizes="(max-width: 768px) 160px, 208px"
                                    className="drop-shadow-sm pointer-events-none"
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- STATS SECTION --- */}
            <section className="py-20 bg-slate-100/50">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                whileHover={{ y: -5 }}
                                className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-lg shadow-slate-200/20 text-center hover:shadow-2xl hover:border-indigo-200 transition-all"
                            >
                                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    {stat.icon}
                                </div>
                                <div className="text-5xl md:text-6xl font-black text-slate-900 mb-2 leading-none">{stat.value}</div>
                                <div className="text-slate-500 font-bold uppercase tracking-[0.15em] text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- HOW IT WORKS --- */}
            <section className="container mx-auto px-6 py-20 max-w-7xl">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 leading-tight tracking-tight text-center">
                        Langkah <br />
                        <span className="text-indigo-600 relative inline-block text-center">
                            Menuju Kelulusan
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                            </svg>
                        </span>
                    </h2>
                    <p className="text-slate-500 text-lg md:text-xl font-bold max-w-2xl mx-auto text-center">
                        Proses sederhana yang telah membantu 10.000+ mahasiswa menyelesaikan penelitian mereka.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 text-center relative group hover:shadow-2xl hover:border-indigo-200 transition-all"
                        >
                            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-100 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                {step.icon}
                            </div>
                            <div className="absolute top-6 right-6 text-slate-100 font-black text-4xl group-hover:text-indigo-100 transition-colors">
                                {i + 1}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black mb-4 text-slate-900">{step.title}</h3>
                            <p className="text-slate-500 text-lg leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- VALUES SECTION --- */}
            <section className="bg-indigo-50/50 py-20 relative overflow-hidden border-y border-slate-200/60">
                <div className="container mx-auto px-6 py-10 max-w-7xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
                                Dedikasi Kami <br />
                                <span className="text-indigo-600 relative inline-block">
                                    Untuk Anda
                                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                                    </svg>
                                </span>
                            </h2>
                            <p className="text-slate-500 text-lg md:text-xl leading-relaxed mb-12">
                                Kami memulai perjalanan ini dari sebuah keresahan mahasiswa yang sulit mencari responden kuesioner. Kini, EduAssist telah menjadi standar baru layanan pendukung riset di Indonesia yang mengutamakan <strong>etika akademik</strong> dan <strong>validitas nyata</strong>.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {["Tanpa Bot", "Bebas Manipulasi", "Aman untuk Sidang"].map((badge, i) => (
                                    <div key={i} className="flex items-center gap-2 text-indigo-700 font-bold text-sm bg-indigo-100 px-4 py-2 rounded-full border border-indigo-200">
                                        <Check size={16} className="text-indigo-600" /> {badge}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            {values.map((v, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-lg shadow-slate-200/20 hover:shadow-2xl hover:border-indigo-200 transition-all group"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className="shrink-0 w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                            {v.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 mb-3">{v.title}</h3>
                                            <p className="text-slate-500 leading-relaxed">{v.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <footer className="container mx-auto px-4 pb-20 text-center max-w-[1400px]">
                <div className="p-12 md:p-24 bg-white border border-slate-200 rounded-[3rem] md:rounded-[5rem] shadow-sm relative overflow-hidden group text-center flex flex-col items-center">
                    <div className="absolute inset-0 bg-indigo-50/50 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full -z-10 origin-center"></div>

                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-4xl md:text-8xl font-black mb-10 tracking-tight leading-[1.1] text-slate-900"
                    >
                        Mulai Riset Anda <br className="hidden md:block" />
                        <span className="text-indigo-600">Hari Ini?</span>
                    </motion.h2>

                    <Link
                        href="https://wa.me/6285236110219"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 bg-indigo-600 text-white px-10 md:px-16 py-5 md:py-7 rounded-[2rem] font-black text-xl md:text-2xl shadow-xl hover:bg-slate-900 transition-all hover:scale-105 active:scale-95 group"
                    >
                        Mulai Konsultasi Sekarang
                        <MessageCircle size={28} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <p className="mt-8 text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">Fast Response • 24/7 Support • Garansi Kepuasan</p>
                </div>
            </footer>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </main>
    );
}