"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Users, ShieldCheck, Sparkles, MessageCircle, Zap, MousePointerClick,
    Star, ShoppingBag, ChevronLeft, ChevronRight, Check, Clock,
    FileText, AlertCircle, CheckCircle, XCircle, Search, BarChart3, GraduationCap
} from "lucide-react";

// --- DATA DUMMY TESTIMONI ---
const shopeeReviews = [
    { name: "dahliamarufi12", date: "2025-04-27", review: "seller responsif amanah dan gercep, terima kasih seller sukses selalu", rating: 5 },
    { name: "chraelstore", date: "2025-10-11", review: "Respon toko sangat baik dan cepat tanggap, diproses lebih cepat dari dugaan, mantap 👍", rating: 5 },
    { name: "9a52jg56ct", date: "2025-08-28", review: "Penggunaan: sangat membantu. Efek: hasil sesuai pesanan. Penjual responsif dan sangat membantu", rating: 5 },
    { name: "m*****9", date: "2025-07-14", review: "Baik banget kak nya ngasih lebih responden nya padahal cuma pesan 50. Terimakasih kak memuaskan.", rating: 5 },
    { name: "sammian420", date: "2025-01-10", review: "Aman derr, normal dan valid P value < 0.001 semua dan reliabel cronbach alpha diatas 0.700 semuaa. Thanks banget!", rating: 5 },
    { name: "muhammadriyani835", date: "2025-12-07", review: "Pengisiannya cepat selesai dan jawabannya benar-benar dibaca gak sembarangan klik, makasih banyak ya minn", rating: 5 },
    { name: "h*****y", date: "2025-10-14", review: "Penggunaan: sangat bagus. Beli disini kuesionernya real ❤️❤️❤️", rating: 5 },
    { name: "z*****n", date: "2025-04-17", review: "pengerjaan cepat, akurat, dan responden dilebihin 🥰", rating: 5 },
    { name: "indahmuzdalifah378", date: "2025-12-02", review: "Sangat membantu, hasilnya bagus recommended banget. Gak perlu lagi mohon-mohon sama teman minta tolong isi kan", rating: 5 },
    { name: "l*****4", date: "2025-12-21", review: "Tepat waktu dan hasilnya melebihi ekspektasi saya. Harga terjangkau. Sangat direkomendasikan👍", rating: 5 },
    { name: "auranabilasahda236", date: "2025-10-11", review: "puas dengan hasilnya, gercep dan responsif sellernya. trimakasii sellerr", rating: 5 },
    { name: "oktaadion", date: "2025-12-24", review: "Udah 2 kali order disini hasilnya memuaskan terus pedagang nya ramah terus sabar banget", rating: 5 },
    { name: "q*****_", date: "2025-07-19", review: "Penggunaan: sangat membantuu. Pengerjaan cepat dan efektif, data dapat diolah.", rating: 5 },
    { name: "alyafauziah12345678910", date: "2025-10-17", review: "Terimakasi seller sangat baik dan membantu... Thank u so much😍", rating: 5 },
    { name: "e*****h", date: "2025-07-23", review: "Sesuai dengan deskripsi, sangat cocok bagi yang sedang penelitian. Desain modern.", rating: 5 },
    { name: "mdewani14", date: "2025-10-04", review: "Sumpah ini membantu banget, first time gw beli dan amanah cuyy pengerjaan juga cepet. Next pasti gw order lagi!!!", rating: 5 },
    { name: "g*****e", date: "2025-05-25", review: "sangat membantu, jumlah respondennya juga dikasih bonus, terima kasih", rating: 5 },
    { name: "r*****n", date: "2025-12-02", review: "Pengerjaannya tidak asal sehingga saat diuji validitas hasilnya valid dan reliabel! Recommended!", rating: 5 },
    { name: "k*****o", date: "2025-10-27", review: "worth itt, seller fast respp, lgsg dikerjain. yg mau beli lgsg cuss aja", rating: 5 },
    { name: "a*****9", date: "2025-11-15", review: "mantap hasil valid semua admin ramah gausah ragu checkout disini", rating: 5 },
];

const universities = [
    "UI", "ITB", "UGM", "Unair", "Binus", "UPI", "UNPAD", "ITS", "IPB", "UNDIP",
    "UNNES", "UNY", "UNS", "UNJ", "UNM", "UNHAS", "UB", "UNIBRAW", "UNUD", "UNSRAT"
];

export default function Home() {
    // --- STATE CAROUSEL ---
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Responsiveness Logic
    const [reviewsPerSlide, setReviewsPerSlide] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setReviewsPerSlide(1);
            else if (window.innerWidth < 1024) setReviewsPerSlide(2);
            else setReviewsPerSlide(4);
        };
        handleResize(); // Set initial
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalSlides = Math.ceil(shopeeReviews.length / reviewsPerSlide);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth; // Scroll satu layar penuh

            if (direction === "left") {
                scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
                setCurrentSlide(prev => Math.max(0, prev - 1));
            } else {
                scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
                setCurrentSlide(prev => Math.min(totalSlides - 1, prev + 1));
            }
        }
    };

    return (
        <main className="bg-[#F8FAFC] text-slate-900 overflow-x-hidden min-h-screen selection:bg-indigo-100 selection:text-indigo-700 font-sans">

            {/* --- HERO SECTION --- */}
            <section className="relative pt-28 pb-16 md:pt-40 md:pb-28 px-4 sm:px-6 overflow-hidden bg-white border-b border-slate-100">
                <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/70 via-white to-transparent -z-10"></div>

                <div className="container mx-auto max-w-[1600px] flex flex-col items-center justify-center text-center px-4 lg:px-20">

                    {/* BADGE UTAMA (JADIKAN PATOKAN) */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-indigo-700 font-bold text-xs sm:text-sm uppercase tracking-[0.15em] mb-8 shadow-sm"
                    >
                        <Sparkles size={14} className="fill-indigo-500 text-indigo-500 animate-pulse" />
                        <span>Penyedia Responden No. 1</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl xl:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter"
                    >
                        Riset Anda Selesai<br className="hidden md:block" />
                        <span className="text-indigo-600 relative inline-block mx-2">
                            Tanpa Ribet & Terjamin
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                            </svg>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-base md:text-xl lg:text-2xl max-w-4xl mx-auto mb-12 font-medium leading-relaxed"
                    >
                        Solusi lengkap untuk mahasiswa S1, S2, & S3. Dari penyebaran kuesioner hingga data siap olah, kami pastikan riset Anda lolos uji validitas.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full mb-12"
                    >
                        <Link
                            href="https://wa.me/6285236110219"
                            target="_blank"
                            className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200 active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            Konsultasi via WhatsApp <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
                        </Link>
                        <Link
                            href="https://id.shp.ee/RoYtQCu"
                            target="_blank"
                            className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-200 px-10 py-5 rounded-2xl font-black text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            Lihat di Shopee <ShoppingBag size={22} className="text-orange-500 group-hover:scale-110 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* ANXIETY COUNTER */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs sm:text-sm text-slate-500 bg-slate-50/80 backdrop-blur px-6 py-3 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-emerald-500" />
                                <span><span className="font-black text-emerald-600">12.450+</span> mahasiswa terbantu</span>
                            </div>
                            <div className="hidden sm:block w-px h-4 bg-slate-300"></div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-indigo-500" />
                                <span>Privasi data 100% terjamin</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* TRUST BAR */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="w-full mt-16"
                    >
                        <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-6">
                            Dipercaya oleh mahasiswa dari:
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {universities.slice(0, 10).map((uni, index) => (
                                <div key={index} className="px-4 py-2 bg-white border border-slate-100 rounded-lg text-slate-400 font-bold text-xs hover:border-indigo-200 hover:text-indigo-600 transition-colors cursor-default shadow-sm">
                                    {uni}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- NEW SECTION: PAIN POINTS (MASALAH) --- */}
            <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]"></div>
                <div className="container mx-auto px-4 max-w-[1600px] relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                            Kenapa Skripsi Sering <span className="text-indigo-400">Macet?</span>
                        </h2>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            Jangan biarkan kendala teknis menghambat kelulusan Anda. Kami paham betul masalah yang sering dihadapi mahasiswa.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Responden Tidak Valid", desc: "Data asal-asalan menyebabkan uji validitas & reliabilitas gagal berulang kali.", icon: <XCircle size={32} className="text-red-500" /> },
                            { title: "Deadline Menghantui", desc: "Waktu sidang sudah dekat tapi kuota responden belum terpenuhi sama sekali.", icon: <Clock size={32} className="text-amber-500" /> },
                            { title: "Biaya Membengkak", desc: "Menggunakan jasa abal-abal yang meminta biaya tambahan tak terduga.", icon: <AlertCircle size={32} className="text-orange-500" /> }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all group">
                                <div className="bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- NEW SECTION: SERVICE OVERVIEW (LAYANAN UNGGULAN) --- */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-[1600px]">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-2 block">Layanan Kami</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                            Solusi Akademik <span className="text-indigo-600">Terintegrasi</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Sebar Kuesioner", desc: "Responden 100% manusia asli sesuai kriteria inklusi.", icon: <Users size={24} /> },
                            { title: "Cek Validitas", desc: "Pengecekan konsistensi jawaban agar lolos uji statistik.", icon: <Search size={24} /> },
                            { title: "Olah Data", desc: "Bantuan olah data SPSS/PLS/SEM hingga interpretasi.", icon: <BarChart3 size={24} /> },
                            { title: "Konsultasi Judul", desc: "Diskusi arah penelitian bagi yang masih bingung.", icon: <GraduationCap size={24} /> },
                        ].map((srv, i) => (
                            <div key={i} className="group p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-700 shadow-sm mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    {srv.icon}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-3">{srv.title}</h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed">{srv.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- BENTO GRID STATS --- */}
            <section className="container mx-auto px-4 sm:px-6 py-20 max-w-[1600px] relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                    {/* Main Card (Left) */}
                    <div className="lg:col-span-7 bg-slate-950 rounded-[2.5rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl group min-h-[450px] flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-1000"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest text-indigo-300 mb-8 uppercase">
                                Impact Metrics
                            </div>
                            <h3 className="text-6xl md:text-9xl font-black tracking-tighter mb-6 leading-none">
                                10K+
                            </h3>
                            <p className="text-xl md:text-3xl font-bold text-slate-200 max-w-md leading-tight">
                                Data Penelitian <br /> <span className="text-indigo-400">Telah Terselesaikan.</span>
                            </p>
                        </div>

                        <div className="mt-10">
                            <div className="inline-block bg-white/5 border border-white/10 backdrop-blur-sm px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors">
                                <p className="text-3xl font-black flex items-center gap-3">
                                    4.9 <span className="text-base font-medium text-slate-400">/ 5.0</span>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-amber-400 text-amber-400" />)}
                                    </div>
                                </p>
                                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mt-2">Shopee Customer Rating</p>
                            </div>
                        </div>
                    </div>

                    {/* Feature Cards Grid (Right) */}
                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
                        {[
                            { title: "Responden Berkualitas", desc: "100% manusia asli, akun aktif & terverifikasi.", icon: <Users size={24} />, bg: "bg-blue-50", text: "text-blue-600" },
                            { title: "Eksekusi Kilat", desc: "Hasil dalam 24-48 jam setelah konfirmasi.", icon: <Zap size={24} />, bg: "bg-amber-50", text: "text-amber-500" },
                            { title: "Garansi Validitas", desc: "Data lolos uji SPSS & SmartPLS.", icon: <ShieldCheck size={24} />, bg: "bg-emerald-50", text: "text-emerald-600" },
                            { title: "Fleksibilitas Penuh", desc: "Custom skala, demografi, dan instrument.", icon: <MousePointerClick size={24} />, bg: "bg-purple-50", text: "text-purple-600" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 transition-all flex items-center gap-5 group h-full">
                                <div className={`w-14 h-14 shrink-0 ${item.bg} ${item.text} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 leading-tight mb-1">{item.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- COMPARISON SECTION --- */}
            <section className="container mx-auto px-4 sm:px-6 mb-24 max-w-[1400px]">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">
                        Mengapa Solusi Kami <span className="text-indigo-600">Berbeda?</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                        Bandingkan dengan metode konvensional yang menyita waktu dan energi Anda.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Metode Biasa */}
                    <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 md:p-12">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shrink-0">
                                <AlertCircle size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">Metode Konvensional</h3>
                        </div>
                        <div className="space-y-6">
                            {[
                                { icon: <Clock size={18} />, title: "Durasi Panjang", desc: "7-14 hari mencari responden manual." },
                                { icon: <AlertCircle size={18} />, title: "Risiko Tinggi", desc: "Data palsu, asal isi, responden drop out." },
                                { icon: <FileText size={18} />, title: "Proses Rumit", desc: "Harus olah data sendiri, risiko error tinggi." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-5 items-start">
                                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0 mt-1">{item.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                                        <p className="text-slate-500 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Solusi EduAssist */}
                    <div className="bg-white border-2 border-indigo-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-2 rounded-bl-3xl font-bold text-sm tracking-wider uppercase">Recommended</div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                                <Sparkles size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">Solusi EduAssist</h3>
                        </div>
                        <div className="space-y-6">
                            {[
                                { icon: <Zap size={18} />, title: "Super Cepat", desc: "Data terkumpul dalam 1-2 hari." },
                                { icon: <Users size={18} />, title: "Kualitas Terjamin", desc: "100% manusia asli, respons berkualitas." },
                                { icon: <Check size={18} />, title: "Siap Sidang", desc: "Data siap olah, garansi valid." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-5 items-start">
                                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shrink-0 mt-1 shadow-md shadow-indigo-200">{item.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                                        <p className="text-slate-500 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 pt-8 border-t border-indigo-50 text-center">
                            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-wide">
                                <ShieldCheck size={18} /> Hemat 86% waktu penelitian
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS SECTION --- */}
            <section className="py-24 bg-slate-100/50 border-y border-slate-200/60 overflow-hidden relative group/carousel">
                <div className="container mx-auto px-4 sm:px-6 mb-16 max-w-[1600px] text-center">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-950">
                        Testimoni <span className="text-indigo-600">Kepercayaan</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-bold">
                        Ribuan mahasiswa sudah membuktikan solusi kami.
                    </p>
                </div>

                <div className="relative container mx-auto px-4 sm:px-6 max-w-[1600px]">
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 shadow-xl text-slate-700 hover:text-indigo-600 hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 hidden md:block"
                    >
                        <ChevronLeft size={28} />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto py-8 no-scrollbar snap-x snap-mandatory scroll-smooth px-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {shopeeReviews.map((t, i) => (
                            <div
                                key={i}
                                className="shrink-0 w-[85%] sm:w-[45%] lg:w-[30%] xl:w-[23%] bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 flex flex-col snap-center hover:border-indigo-300 hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="flex gap-1 mb-5 text-amber-400">
                                    {[...Array(5)].map((_, idx) => (
                                        <Star key={idx} size={16} fill="currentColor" strokeWidth={0} />
                                    ))}
                                </div>
                                <p className="text-slate-700 text-base font-medium leading-relaxed mb-8 flex-grow italic">
                                    "{t.review}"
                                </p>
                                <div className="mt-auto pt-5 border-t border-slate-100">
                                    <h4 className="font-black text-slate-900 text-base mb-1">{t.name}</h4>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 shadow-xl text-slate-700 hover:text-indigo-600 hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 hidden md:block"
                    >
                        <ChevronRight size={28} />
                    </button>
                </div>
            </section>

            {/* --- CTA SECTION (FOOTER) --- */}
            <footer className="container mx-auto px-6 py-24 text-center max-w-[1400px]">
                <div className="p-12 md:p-24 bg-white border border-slate-200 rounded-[3rem] md:rounded-[5rem] shadow-sm relative overflow-hidden group text-center flex flex-col items-center">
                    <div className="absolute inset-0 bg-indigo-50/50 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full -z-10 origin-center"></div>

                    <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight leading-[1.1] text-slate-900">
                        Mulai Riset Anda <br className="hidden md:block" />
                        <span className="text-indigo-600">Hari Ini?</span>
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="https://wa.me/6285236110219"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-indigo-600 text-white px-10 md:px-12 py-5 rounded-2xl font-black text-lg md:text-xl shadow-xl hover:bg-slate-900 transition-all hover:scale-105 active:scale-95 group"
                        >
                            Mulai Konsultasi
                            <MessageCircle size={24} className="group-hover:-rotate-12 transition-transform" />
                        </Link>
                        <Link
                            href="/layanan"
                            className="inline-flex items-center gap-3 bg-white text-slate-900 border-2 border-slate-200 px-10 md:px-12 py-5 rounded-2xl font-black text-lg md:text-xl hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95"
                        >
                            Cek Harga
                            <ShoppingBag size={24} />
                        </Link>
                    </div>

                    <p className="mt-8 text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
                        Fast Response • 24/7 Support • Garansi Kepuasan
                    </p>
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