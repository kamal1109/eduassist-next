"use client";
import {
    MessageSquare,
    Link as LinkIcon,
    Settings,
    CreditCard,
    Send,
    CheckCircle,
    Sparkles,
    ShieldCheck,
    Smartphone,
    ArrowRight,
    ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const steps = [
    {
        icon: <MessageSquare className="w-6 h-6 md:w-8 md:h-8" />,
        title: "Konsultasi Strategis",
        desc: "Langkah awal dimulai dengan diskusi mendalam via WhatsApp. Admin kami akan membedah kebutuhan riset Anda, mulai dari kriteria responden hingga target demografi spesifik.",
        badge: "01"
    },
    {
        icon: <LinkIcon className="w-6 h-6 md:w-8 md:h-8" />,
        title: "Validasi Tautan",
        desc: "Kirimkan link instrumen penelitian Anda (Google Form/Lainnya). Tim kami akan melakukan pengecekan teknis untuk memastikan form siap menerima data tanpa kendala.",
        badge: "02"
    },
    {
        icon: <Settings className="w-6 h-6 md:w-8 md:h-8" />,
        title: "Sinkronisasi Pola",
        desc: "Kami menyesuaikan pola jawaban sesuai instruksi akademik Anda. Hal ini krusial untuk menjaga reliabilitas data saat Anda melakukan uji statistik nantinya.",
        badge: "03"
    },
    {
        icon: <CreditCard className="w-6 h-6 md:w-8 md:h-8" />,
        title: "Sistem Pembayaran Aman",
        desc: "Lakukan transaksi melalui kanal resmi (BCA/BNI/DANA). Keamanan pembayaran Anda terjamin dengan invoice resmi yang akan dikirimkan oleh admin.",
        badge: "04"
    },
    {
        icon: <Send className="w-6 h-6 md:w-8 md:h-8" />,
        title: "Eksekusi Lapangan",
        desc: "Responden asli kami mulai mengisi kuesioner Anda. Kami menghindari bot/script untuk menjaga integritas riset. Progres bisa Anda pantau secara real-time.",
        badge: "05"
    },
    {
        icon: <CheckCircle className="w-6 h-6 md:w-8 md:h-8" />,
        title: "Serah Terima Data",
        desc: "Setelah kuota terpenuhi, admin akan melakukan final check. Data mentah Anda kini siap diolah menjadi laporan skripsi atau publikasi jurnal.",
        badge: "06"
    },
];

export default function PanduanOrder() {
    return (
        <main className="bg-white text-slate-900 min-h-screen font-sans selection:bg-indigo-100 overflow-x-hidden">

            {/* --- LAYOUT WRAPPER --- */}
            <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12 xl:px-20">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 pt-32 md:pt-40">

                    {/* --- LEFT SIDE: HERO (STICKY ON DESKTOP) --- */}
                    <aside className="lg:w-5/12 lg:sticky lg:top-32 lg:h-fit space-y-8 text-center lg:text-left z-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full text-indigo-700 font-bold text-xs md:text-sm uppercase tracking-[0.15em] shadow-sm"
                        >
                            <Sparkles size={14} className="fill-indigo-500 text-indigo-500 animate-pulse" />
                            <span>Workflow System</span>
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tighter leading-[1.1] text-slate-900">
                            Bagaimana Kami <br className="hidden lg:block" />
                            <span className="text-indigo-600 relative inline-block">
                                Bekerja
                                <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                                </svg>
                            </span>
                            <br className="hidden lg:block" /> Untuk Anda.
                        </h1>

                        <p className="text-slate-500 text-base md:text-xl font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                            Kami telah menyederhanakan birokrasi riset yang rumit menjadi 6 langkah praktis. Fokus pada analisis Anda, biarkan kami menangani teknis pengumpulan data.
                        </p>

                        <div className="hidden lg:flex flex-col gap-5 pt-6">
                            <div className="flex items-center gap-4 text-slate-600 font-bold text-sm md:text-base">
                                <div className="bg-emerald-100 p-2 rounded-full"><ShieldCheck className="text-emerald-600" size={20} /></div>
                                Keamanan Transaksi Terjamin
                            </div>
                            <div className="flex items-center gap-4 text-slate-600 font-bold text-sm md:text-base">
                                <div className="bg-blue-100 p-2 rounded-full"><Smartphone className="text-blue-600" size={20} /></div>
                                Dukungan WhatsApp 24/7
                            </div>
                        </div>

                        <div className="pt-8 hidden lg:block">
                            <Link href="https://wa.me/6285236110219" target="_blank" className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl active:scale-95 text-lg group">
                                Konsultasi Sekarang <ArrowRight size={22} className="group-hover:-rotate-12 transition-transform" />
                            </Link>
                        </div>
                    </aside>

                    {/* --- RIGHT SIDE: STEPS (SCROLLING AREA) --- */}
                    <div className="lg:w-7/12 pb-10 relative">
                        <div className="space-y-8 md:space-y-12">
                            {steps.map((step, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    key={i}
                                    className="group relative"
                                >
                                    {/* Connector Line */}
                                    {i !== steps.length - 1 && (
                                        <div className="absolute left-[2.2rem] md:left-[3.25rem] top-24 bottom-[-48px] w-0.5 border-l-2 border-dashed border-slate-200 group-hover:border-indigo-300 transition-colors z-0"></div>
                                    )}

                                    <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/40 hover:border-indigo-100 transition-all duration-300 flex flex-col md:flex-row gap-6 md:gap-8 relative z-10">
                                        <div className="relative shrink-0 flex items-start">
                                            <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 text-indigo-600 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
                                                {step.icon}
                                            </div>
                                            <div className="absolute -top-3 -right-3 md:-top-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center text-xs md:text-sm font-black text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-all shadow-sm">
                                                {step.badge}
                                            </div>
                                        </div>
                                        <div className="space-y-3 py-1">
                                            <h3 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                {step.title}
                                            </h3>
                                            <p className="text-slate-500 leading-relaxed text-sm md:text-base font-medium">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Mobile only (Tombol Kecil di tengah list) */}
                        <div className="mt-16 lg:hidden">
                            <Link href="https://wa.me/6285236110219" className="flex items-center justify-center gap-3 bg-slate-900 text-white p-5 rounded-2xl font-black shadow-lg active:scale-95 transition-transform text-lg">
                                <MessageSquare size={22} /> Hubungi Admin Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FINAL CTA (NEW ADDITION) --- */}
            {/* Bagian ini penting agar user tidak 'buntu' setelah membaca langkah terakhir */}
            <section className="container mx-auto px-6 py-24 text-center max-w-[1400px] border-t border-slate-100 mt-10">
                <div className="p-12 md:p-24 bg-white border border-slate-200 rounded-[3rem] md:rounded-[5rem] shadow-sm relative overflow-hidden group text-center flex flex-col items-center">
                    <div className="absolute inset-0 bg-indigo-50/50 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full -z-10 origin-center"></div>

                    <h2 className="text-3xl md:text-6xl font-black mb-8 tracking-tight leading-[1.1] text-slate-900">
                        Sudah Paham Alurnya? <br />
                        <span className="text-indigo-600">Ayo Mulai Sekarang.</span>
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="https://wa.me/6285236110219"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-indigo-600 text-white px-10 md:px-12 py-5 rounded-2xl font-black text-lg md:text-xl shadow-xl hover:bg-slate-900 transition-all hover:scale-105 active:scale-95 group"
                        >
                            Order via WhatsApp
                            <MessageSquare size={24} className="group-hover:-rotate-12 transition-transform" />
                        </Link>
                        <Link
                            href="/layanan"
                            className="inline-flex items-center gap-3 bg-white text-slate-900 border-2 border-slate-200 px-10 md:px-12 py-5 rounded-2xl font-black text-lg md:text-xl hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95"
                        >
                            Cek Harga Dulu
                            <ShoppingBag size={24} />
                        </Link>
                    </div>

                    <p className="mt-8 text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
                        Admin Fast Response • Data Aman • Garansi Valid
                    </p>
                </div>
            </section>

            {/* --- DECORATIVE BACKGROUND ELEMENTS --- */}
            <div className="fixed top-0 left-0 -z-20 w-full h-full pointer-events-none opacity-40 overflow-hidden">
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] left-[5%] w-[30rem] h-[30rem] bg-indigo-50/50 rounded-full blur-[150px]"></div>
            </div>
        </main>
    );
}