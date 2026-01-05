"use client";
import { motion } from "framer-motion";
import {
    Users,
    BookOpen,
    BarChart3,
    CheckCircle2,
    MessageCircle,
    Package,
    Clock,
    Zap,
    ArrowRight,
    Sparkles,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default function Layanan() {
    const detailLayanan = [
        {
            title: "Target Responden",
            tagline: "Data 100% Manusia Asli",
            desc: "Kami menyebarkan kuesioner Anda ke jaringan komunitas aktif kami. Tidak ada manipulasi, tidak ada bot. Hanya responden nyata yang sesuai dengan kriteria penelitian Anda.",
            features: ["Responden sesuai kriteria (Domisili, Usia, Profesi)", "Hasil pengisian unik (IP Address berbeda)", "Laporan progres berkala"],
            icon: <Users size={32} className="text-blue-600" />,
            price: "Mulai Rp 3.000 / Responden"
        },
        {
            title: "Jasa Olah Data",
            tagline: "Output Akurat & Siap Sidang",
            desc: "Bantuan analisis data menggunakan software statistik terkini (SPSS, SmartPLS, EViews). Kami membantu Anda menerjemahkan angka menjadi narasi penelitian yang kuat.",
            features: ["Uji Validitas & Reliabilitas", "Uji Hipotesis & Regresi", "Interpretasi hasil dalam format Word/PDF"],
            icon: <BarChart3 size={32} className="text-emerald-600" />,
            price: "Mulai Rp 150.000 / Model"
        },
        {
            title: "Review Materi",
            tagline: "Bedah Kualitas Riset",
            desc: "Layanan konsultasi untuk mematangkan konsep kuesioner atau hasil riset Anda agar minim celah saat ditanyakan oleh dosen penguji.",
            features: ["Review butir kuesioner", "Cek konsistensi antar variabel", "Briefing cara jawab pertanyaan sulit"],
            icon: <BookOpen size={32} className="text-indigo-600" />,
            price: "Mulai Rp 50.000 / Sesi"
        }
    ];

    const pricingPackages = [
        { name: "Starter Kit", price: "150rb", limit: "50 Responden", bestFor: "Kuesioner Sederhana", features: ["Kriteria Umum", "Proses 1-2 Hari", "Garansi Validitas"] },
        { name: "Premium Research", price: "280rb", limit: "100 Responden", bestFor: "Skripsi / Tugas Akhir", features: ["Kriteria Spesifik", "Proses < 24 Jam", "Interpretasi Data Dasar", "Gratis 5 Responden"], popular: true },
        { name: "Professional Data", price: "500rb+", limit: "200+ Responden", bestFor: "Tesis / Publikasi", features: ["Kriteria Sangat Detail", "Prioritas Utama", "Full Support Olah Data", "Bonus Audit Kuesioner"] },
    ];

    return (
        <main className="bg-[#F8FAFC] min-h-screen pt-32 pb-20 overflow-hidden">
            {/* --- HERO SECTION --- */}
            <section className="container mx-auto px-6 mb-24">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-5 py-2 rounded-full text-indigo-700 font-bold text-xs uppercase tracking-widest mb-8">
                        <Sparkles size={14} /> Solusi Lengkap Untuk Riset Anda
                    </motion.div>
                    <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[1] mb-8 tracking-tighter">
                        Detail Layanan <br /> & <span className="text-indigo-600">Investasi Riset.</span>
                    </h1>
                </div>
            </section>

            {/* --- DETAILED DESCRIPTION --- */}
            <section className="container mx-auto px-6 mb-32 max-w-7xl">
                <div className="space-y-24">
                    {detailLayanan.map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`flex flex-col lg:flex-row items-center gap-16 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                            <div className="lg:w-1/2">
                                <div className="mb-6 p-4 bg-white inline-block rounded-3xl shadow-xl shadow-indigo-100">{s.icon}</div>
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">{s.title}</h2>
                                <p className="text-indigo-600 font-bold text-lg mb-6">{s.tagline}</p>
                                <p className="text-slate-500 text-lg leading-relaxed mb-8">{s.desc}</p>
                                <div className="space-y-4">
                                    {s.features.map((f, idx) => (
                                        <div key={idx} className="flex items-center gap-3 font-bold text-slate-700">
                                            <CheckCircle2 size={20} className="text-indigo-500" /> {f}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:w-1/2 bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden text-center">
                                <div className="absolute top-0 right-0 p-8"><Zap className="text-indigo-100" size={120} /></div>
                                <h4 className="text-slate-400 font-black uppercase tracking-widest text-sm mb-4">Investasi</h4>
                                <div className="text-4xl md:text-5xl font-black text-slate-900 mb-8">{s.price}</div>
                                <Link href="https://wa.me/628123456789" className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-900 transition-all inline-flex items-center gap-3 active:scale-95 shadow-lg shadow-indigo-100">
                                    Pesan Layanan Ini <ArrowRight size={20} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- PRICELIST SECTION --- */}
            <section className="container mx-auto px-6 mb-32 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4">Paket Hemat Responden.</h2>
                    <p className="text-slate-500 font-bold">Pilih paket yang sesuai dengan skala penelitian Anda.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {pricingPackages.map((p, i) => (
                        <div key={i} className={`p-12 rounded-[4rem] border transition-all relative ${p.popular ? 'bg-slate-950 text-white border-slate-800 shadow-3xl scale-105 z-10' : 'bg-white border-slate-100 text-slate-900 shadow-xl'}`}>
                            {p.popular && <div className="absolute top-8 right-8 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">Paling Laris</div>}
                            <h3 className="text-2xl font-black mb-1">{p.name}</h3>
                            <p className={`${p.popular ? 'text-slate-400' : 'text-slate-500'} font-bold mb-8`}>{p.bestFor}</p>
                            <div className="text-5xl font-black mb-10">Rp {p.price}</div>
                            <div className="space-y-5 mb-12">
                                <div className="flex items-center gap-3 font-bold"><Package size={18} className="text-indigo-500" /> {p.limit}</div>
                                {p.features.map((f, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-sm opacity-80"><CheckCircle2 size={16} className="text-indigo-500" /> {f}</div>
                                ))}
                            </div>
                            <Link href="https://wa.me/628123456789" className={`w-full py-5 rounded-2xl font-black text-center transition-all inline-block ${p.popular ? 'bg-indigo-600 hover:bg-white hover:text-indigo-600' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}>
                                Pilih Paket
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="mt-12 text-center text-slate-400 font-medium">
                    <p>*Harga dapat berubah sewaktu-waktu tergantung kesulitan kriteria responden.</p>
                </div>
            </section>

            {/* --- CUSTOM ORDER CTA --- */}
            <section className="container mx-auto px-6 max-w-7xl">
                <div className="bg-indigo-600 rounded-[4rem] p-12 md:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl shadow-indigo-200">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tight">Butuh jumlah responden custom?</h2>
                        <p className="text-indigo-100 text-lg font-medium opacity-80">Kami melayani pesanan responden dalam jumlah berapapun dengan kriteria yang sangat spesifik sekalipun.</p>
                    </div>
                    <Link href="https://wa.me/628123456789" className="bg-white text-indigo-600 px-12 py-6 rounded-3xl font-black text-xl shadow-2xl hover:bg-slate-900 hover:text-white transition-all whitespace-nowrap active:scale-95 flex items-center gap-3">
                        <MessageCircle size={24} /> Chat Konsultasi Gratis
                    </Link>
                </div>
            </section>
        </main>
    );
}