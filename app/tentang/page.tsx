"use client";
import { motion } from "framer-motion";
import {
    Target,
    Users,
    Award,
    ShieldCheck,
    TrendingUp,
    Heart,
    ShoppingBag,
    ArrowRight,
    Send,
    BarChart3,
    Check,
    MessageCircle,
    ShieldAlert
} from "lucide-react";
import Link from "next/link";

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

    return (
        <main className="bg-[#F8FAFC] text-slate-900 overflow-x-hidden min-h-screen selection:bg-indigo-100 selection:text-indigo-700">

            {/* --- HERO SECTION --- */}
            <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 overflow-hidden bg-white">
                <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/70 via-white to-transparent -z-10"></div>

                <div className="container mx-auto max-w-6xl flex flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full text-indigo-700 font-bold text-xs md:text-sm uppercase tracking-[0.15em] mb-8 shadow-sm"
                    >
                        <Target size={16} className="text-indigo-600" />
                        Mengenal EduAssist
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight text-center"
                    >
                        Data Valid. <br />
                        <span className="text-indigo-600 relative inline-block text-center">
                            Lulus Lebih Cepat
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                            </svg>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-base md:text-xl lg:text-2xl max-w-3xl mx-auto mb-10 md:mb-14 font-medium leading-relaxed text-center"
                    >
                        EduAssist hadir untuk menghapus drama responden dalam riset Anda. Kami memastikan data yang Anda terima valid, reliabel, dan akurat untuk sidang skripsi tanpa hambatan.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                        <Link
                            href="https://wa.me/6285236110219"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto bg-slate-900 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200 active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            Konsultasi via WhatsApp <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
                        </Link>
                        <Link
                            href="https://id.shp.ee/RoYtQCu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-lg hover:border-indigo-400 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3"
                        >
                            Lihat di Shopee <ShoppingBag size={22} className="text-orange-500" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- STATS SECTION --- */}
            <section className="py-20 bg-slate-100/50 border-y border-slate-200/60">
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
                        <span className="text-indigo-600 relative inline-block">
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
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 transform -translate-y-1/2"></div>
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
            <section className="bg-indigo-50/50 py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-indigo-100/50 rounded-full blur-[80px] md:blur-[100px] -mr-24 -mt-24"></div>

                <div className="container mx-auto px-6 py-20 max-w-7xl relative z-10">
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

            {/* --- CTA SECTION --- */}
            <section className="container mx-auto px-6 py-20 max-w-7xl">
                <div className="bg-indigo-600 rounded-[3rem] md:rounded-[4rem] p-12 md:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl shadow-indigo-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-indigo-500/30 rounded-full blur-[80px] md:blur-[100px] -mr-24 -mt-24 transition-transform group-hover:scale-125 duration-700"></div>

                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight">
                            Siap Lulus <br />
                            Tanpa Drama?
                        </h2>
                        <p className="text-indigo-100 text-lg md:text-xl font-medium opacity-90">
                            Ratusan mahasiswa mempercepat kelulusan setiap bulan bersama EduAssist. Jangan biarkan kuesioner kosong menghambat masa depan Anda.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                        <Link
                            href="https://wa.me/6285236110219"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-indigo-600 px-12 py-6 rounded-3xl font-black text-xl shadow-2xl hover:bg-slate-900 hover:text-white transition-all whitespace-nowrap active:scale-95 flex items-center justify-center gap-3 group/btn"
                        >
                            <MessageCircle size={24} />
                            <span>Konsultasi Gratis</span>
                            <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                        </Link>
                        <Link
                            href="https://id.shp.ee/RoYtQCu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-indigo-500 text-white px-12 py-6 rounded-3xl font-black text-xl shadow-2xl hover:bg-orange-600 transition-all whitespace-nowrap active:scale-95 flex items-center justify-center gap-3"
                        >
                            <ShoppingBag size={24} />
                            <span>Lihat Shopee</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <footer className="container mx-auto px-6 pb-20 text-center">
                <div className="p-12 md:p-24 bg-white border border-slate-200 rounded-[3rem] md:rounded-[5rem] shadow-sm relative overflow-hidden group">
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
        </main>
    );
}