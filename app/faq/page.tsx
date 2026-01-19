"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown, HelpCircle, ShieldCheck, Lock,
    MessageCircle, ShieldAlert, ShoppingBag, Users,
    MessageSquare, FileText, Wallet
} from "lucide-react";
import Link from "next/link";

// --- DATA FAQ ---
const faqs = [
    {
        category: "Layanan & Umum",
        icon: <MessageSquare size={20} />,
        items: [
            {
                q: "Apa itu EduAssist dan bagaimana cara kerjanya?",
                a: "EduAssist adalah layanan profesional pencarian responden kuesioner untuk keperluan riset akademik (Skripsi, Tesis, Disertasi). Berbeda dengan platform mandiri yang rumit, di EduAssist Anda cukup kirim link kuesioner, tentukan kriteria, dan tim kami yang akan menyebarkannya ke jaringan komunitas responden kami hingga target tercapai."
            },
            {
                q: "Platform kuesioner apa saja yang didukung?",
                a: "Kami mendukung hampir semua platform survei digital yang populer digunakan di Indonesia, seperti Google Forms, Microsoft Forms, Typeform, SurveyMonkey, hingga Qualtrics. Pastikan link Anda dapat diakses publik sebelum dikirimkan."
            },
            {
                q: "Apakah respondennya manusia asli atau bot?",
                a: "Kami menjamin 100% responden adalah MANUSIA ASLI. Kami memiliki jaringan komunitas responden terverifikasi. Kami sangat anti terhadap penggunaan bot atau software pengisi otomatis karena hal tersebut melanggar etika akademik dan merusak validitas data Anda."
            }
        ]
    },
    {
        category: "Biaya & Pembayaran",
        icon: <Wallet size={20} />,
        items: [
            {
                q: "Berapa biaya jasa responden di EduAssist?",
                a: "Biaya sangat terjangkau bagi mahasiswa, dimulai dari Rp 2.000 per responden (tergantung kompleksitas dan durasi pengerjaan). Anda bisa menggunakan fitur Kalkulator Harga di halaman Layanan untuk mendapatkan estimasi transparan tanpa biaya tersembunyi."
            },
            {
                q: "Metode pembayaran apa saja yang tersedia?",
                a: "Untuk memudahkan transaksi, kami menerima pembayaran melalui Transfer Bank (BCA, BNI, Mandiri, BRI), E-Wallet (Dana, OVO, GoPay), serta pembayaran via Shopee (ShopeePay/SPayLater) untuk keamanan ekstra."
            },
            {
                q: "Bagaimana kebijakan Refund (Pengembalian Dana)?",
                a: "Kami menyediakan garansi uang kembali (Refund) jika kami gagal memenuhi target jumlah responden dalam tenggat waktu yang telah disepakati, sesuai dengan syarat dan ketentuan yang berlaku."
            }
        ]
    },
    {
        category: "Teknis & Jaminan Kualitas",
        icon: <FileText size={20} />,
        items: [
            {
                q: "Apakah data dijamin valid dan reliabel?",
                a: "Tentu. Karena responden kami adalah manusia asli yang membaca pertanyaan, data yang dihasilkan memiliki tingkat validitas dan reliabilitas tinggi saat diuji menggunakan software seperti SPSS, SmartPLS, atau SEM-AMOS."
            },
            {
                q: "Bisa revisi jika kriteria responden tidak sesuai?",
                a: "Ya, kami memberikan garansi revisi/penggantian responden GRATIS jika ditemukan data yang outlier parah, tidak mengisi dengan serius (pola jawaban lurus), atau tidak sesuai dengan kriteria inklusi (screening) yang Anda tetapkan di awal."
            },
            {
                q: "Apakah kerahasiaan penelitian saya aman?",
                a: "Privasi adalah prioritas mutlak. Identitas peneliti, data mentah, dan hasil olahan kuesioner tidak akan pernah kami publikasikan atau jual ke pihak ketiga. Data hanya digunakan untuk keperluan penyelesaian pesanan Anda."
            }
        ]
    }
];

export default function FAQPage() {
    // State untuk Accordion (Default item pertama terbuka)
    const [activeId, setActiveId] = useState<string | null>("0-0");

    const toggleFAQ = (id: string) => {
        setActiveId(activeId === id ? null : id);
    };

    return (
        <main className="bg-[#F8FAFC] text-slate-900 overflow-x-hidden min-h-screen selection:bg-indigo-100 selection:text-indigo-700">

            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-10 px-4 sm:px-6 bg-white border-b border-slate-100">
                <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/40 via-white to-transparent -z-10"></div>

                <div className="container mx-auto max-w-5xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4"
                    >
                        <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100">
                            <HelpCircle size={14} /> Pusat Bantuan
                        </span>
                    </motion.div>

                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Ada yang Bisa <span className="text-indigo-600">Kami Bantu?</span>
                    </h1>

                    <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                        Kami menyediakan layanan pencarian responden yang <strong>Valid, Cepat, dan Amanah</strong>.
                        Silakan cek pertanyaan populer di bawah atau hubungi kami langsung.
                    </p>

                    {/* Tombol CTA Kecil */}
                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        <Link href="https://wa.me/6285236110219" target="_blank" className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition shadow-lg shadow-slate-200 hover:-translate-y-0.5">
                            <MessageCircle size={18} /> Chat WhatsApp
                        </Link>
                        <Link href="https://id.shp.ee/RoYtQCu" target="_blank" className="flex items-center gap-2 bg-white text-orange-500 border border-slate-200 px-6 py-3 rounded-xl font-bold text-sm hover:border-orange-200 hover:bg-orange-50 transition shadow-sm hover:-translate-y-0.5">
                            <ShoppingBag size={18} /> Cek Shopee
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs font-bold text-slate-400 uppercase tracking-wide border-t border-slate-100 pt-8">
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg"><Lock size={14} className="text-indigo-500" /> Privasi Aman</div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg"><Users size={14} className="text-indigo-500" /> 100% Manusia</div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg"><ShieldCheck size={14} className="text-indigo-500" /> Garansi Valid</div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg"><ShieldAlert size={14} className="text-indigo-500" /> Etika Akademik</div>
                    </div>
                </div>
            </section>

            {/* --- FAQ LIST SECTION --- */}
            <div className="py-16 md:py-20 bg-[#F8FAFC]">
                <div className="max-w-3xl mx-auto px-4 space-y-12">
                    {faqs.map((category, catIdx) => (
                        <div key={catIdx}>
                            {/* Category Header */}
                            <div className="flex items-center gap-3 mb-5 pl-1">
                                <div className="p-2.5 bg-white rounded-xl shadow-sm text-indigo-600 border border-slate-100">
                                    {category.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{category.category}</h3>
                            </div>

                            {/* FAQ Items */}
                            <div className="space-y-4">
                                {category.items.map((item, itemIdx) => {
                                    const uniqueId = `${catIdx}-${itemIdx}`;
                                    const isOpen = activeId === uniqueId;

                                    return (
                                        <motion.div
                                            key={uniqueId}
                                            initial={false}
                                            className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md' : 'border-slate-200 hover:border-indigo-300'}`}
                                        >
                                            <button
                                                onClick={() => toggleFAQ(uniqueId)}
                                                className="w-full px-6 py-5 flex justify-between items-center text-left gap-4 bg-white"
                                            >
                                                <span className={`font-bold text-sm md:text-base leading-snug ${isOpen ? 'text-indigo-700' : 'text-slate-700'}`}>
                                                    {item.q}
                                                </span>
                                                <ChevronDown
                                                    size={20}
                                                    className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`}
                                                />
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                                    >
                                                        <div className="px-6 pb-6 pt-0 text-slate-600 text-sm md:text-base leading-relaxed border-t border-transparent">
                                                            <div className="w-full h-px bg-slate-100 mb-4"></div>
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

            {/* --- FINAL CTA --- */}
            <footer className="bg-white border-t border-slate-200 py-16 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">
                        Masih ragu? <span className="text-indigo-600">Konsultasi gratis dulu aja.</span>
                    </h2>
                    <p className="text-slate-500 mb-8 max-w-lg mx-auto">
                        Tim admin kami siap menjawab pertanyaan spesifik mengenai riset Anda.
                    </p>
                    <Link
                        href="https://wa.me/6285236110219"
                        target="_blank"
                        className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold hover:bg-[#20bd5a] transition shadow-xl shadow-green-100 hover:-translate-y-1"
                    >
                        <MessageCircle size={20} /> Chat WhatsApp Sekarang
                    </Link>
                </div>
            </footer>
        </main>
    );
}