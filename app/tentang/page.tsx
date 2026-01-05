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
    CheckCircle,
    Clock,
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
        <main className="bg-[#F8FAFC] text-slate-900 min-h-screen pt-32 pb-20 overflow-hidden">
            {/* Background Decorative Aura */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3"></div>

            {/* --- HERO SECTION --- */}
            <section className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl mb-32">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-5 py-2 rounded-full text-indigo-700 font-bold text-sm uppercase tracking-widest mb-8"
                    >
                        <Target size={18} /> Mengenal EduAssist
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-black text-slate-900 leading-[1] mb-10 tracking-tighter"
                    >
                        Data Valid. <br />
                        <span className="text-indigo-600 text-shadow-sm">Lulus Lebih Cepat.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-xl md:text-3xl max-w-3xl leading-relaxed font-medium mb-12"
                    >
                        EduAssist hadir untuk menghapus drama responden dalam riset Anda. Kami memastikan data yang Anda terima valid, reliabel, dan akurat untuk sidang skripsi tanpa hambatan.
                    </motion.p>

                    {/* Ethical Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap gap-6 mt-10"
                    >
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm bg-white px-4 py-2 rounded-xl border border-slate-100">
                            <CheckCircle size={16} className="text-emerald-500" /> Tanpa Bot
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm bg-white px-4 py-2 rounded-xl border border-slate-100">
                            <ShieldAlert size={16} className="text-indigo-500" /> Bebas Manipulasi
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm bg-white px-4 py-2 rounded-xl border border-slate-100">
                            <Award size={16} className="text-amber-500" /> Aman untuk Sidang
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- STATS SECTION (Premium Polish) --- */}
            <section className="bg-white py-24 border-y border-slate-100 relative z-10 shadow-sm">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                className="flex flex-col items-center text-center p-12 bg-white rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 transition-all cursor-default"
                            >
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                                    {stat.icon}
                                </div>
                                <div className="text-6xl font-black text-slate-900 mb-2 tracking-tighter">{stat.value}</div>
                                <div className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- HOW IT WORKS (Bonus 10/10) --- */}
            <section className="container mx-auto px-6 py-32 max-w-7xl">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Langkah Menuju Kelulusan</h2>
                    <p className="text-slate-500 font-medium text-lg">Proses sederhana yang telah membantu 10.000+ mahasiswa.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 relative">
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
                    {steps.map((step, i) => (
                        <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 text-center relative hover:shadow-lg transition-all">
                            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-100">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-black mb-3">{step.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                            <div className="absolute top-4 right-4 text-slate-100 font-black text-4xl">{i + 1}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- STORY & VALUES --- */}
            <section className="bg-slate-50/50 py-32 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent"></div>
                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
                                Dedikasi Kami Untuk <br />
                                <span className="text-indigo-600">Masa Depan Anda.</span>
                            </h2>
                            <p className="text-slate-500 text-xl leading-relaxed mb-10 font-medium">
                                Kami memulai perjalanan ini dari sebuah keresahan mahasiswa yang sulit mencari responden kuesioner. Kini, EduAssist telah menjadi standar baru layanan pendukung riset di Indonesia yang mengutamakan <strong>etika akademik</strong> dan <strong>validitas nyata</strong>.
                            </p>
                            <Link
                                href="https://id.shp.ee/RoYtQCu"
                                target="_blank"
                                className="inline-flex items-center gap-4 bg-[#EE4D2D] text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-orange-200 hover:scale-105 transition-all"
                            >
                                <ShoppingBag size={24} /> Rekam Jejak Shopee
                            </Link>
                        </div>
                        <div className="grid gap-6">
                            {values.map((v, i) => (
                                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group">
                                    <div className="mb-4 group-hover:scale-110 transition-transform">{v.icon}</div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-3">{v.title}</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="container mx-auto px-6 py-20 max-w-7xl">
                <div className="bg-indigo-600 rounded-[4.5rem] p-16 md:p-28 text-center text-white relative overflow-hidden shadow-3xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full -ml-32 -mb-32 blur-2xl"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/30 px-4 py-1.5 rounded-full text-indigo-100 text-sm font-bold mb-8">
                            <Clock size={16} /> Slot pengerjaan cepat terbatas hari ini
                        </div>
                        <h2 className="text-4xl md:text-8xl font-black mb-8 leading-none tracking-tighter">
                            Siap Lulus <br /> Tanpa Drama?
                        </h2>
                        <p className="text-indigo-100 text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                            Ratusan mahasiswa mempercepat kelulusan setiap bulan bersama EduAssist. Jangan biarkan kuesioner kosong menghambat masa depan Anda.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <Link href="https://wa.me/628123456789" className="bg-white text-indigo-600 px-16 py-6 rounded-3xl font-black text-2xl shadow-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95">
                                Konsultasi Gratis <ArrowRight size={28} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="mt-32 text-center pb-10">
                <div className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-4">
                    &copy; 2026 EduAssist Indonesia | Partner Riset No. 1
                </div>
                <div className="flex justify-center gap-6 text-slate-300 font-bold text-xs">
                    <span>KEAMANAN DATA</span>
                    <span>•</span>
                    <span>ETIKA AKADEMIK</span>
                    <span>•</span>
                    <span>RESPON KILAT</span>
                </div>
            </footer>
        </main>
    );
}