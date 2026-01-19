"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Users, ShieldCheck, Sparkles, MessageCircle, Zap, MousePointerClick,
    Star, ShoppingBag, ChevronLeft, ChevronRight, Shield, Check, Clock,
    FileText, AlertCircle, CheckCircle
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
    const [visibleReviews, setVisibleReviews] = useState<typeof shopeeReviews>([]);

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

    useEffect(() => {
        const startIndex = currentSlide * reviewsPerSlide;
        const endIndex = startIndex + reviewsPerSlide;
        setVisibleReviews(shopeeReviews.slice(startIndex, endIndex));
    }, [currentSlide, reviewsPerSlide]);

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

    const goToSlide = (slideIndex: number) => {
        setCurrentSlide(slideIndex);
        if (scrollRef.current) {
            const width = scrollRef.current.clientWidth;
            scrollRef.current.scrollTo({ left: slideIndex * width, behavior: "smooth" });
        }
    };

    return (
        <main className="bg-[#F8FAFC] text-slate-900 overflow-x-hidden min-h-screen selection:bg-indigo-100 selection:text-indigo-700">

            {/* --- HERO SECTION --- */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 overflow-hidden bg-white">
                <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/70 via-white to-transparent -z-10"></div>

                <div className="container mx-auto max-w-6xl flex flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-indigo-700 font-bold text-xs sm:text-sm uppercase tracking-[0.15em] mb-6 shadow-sm"
                    >
                        <Sparkles size={14} className="fill-indigo-500 text-indigo-500 animate-pulse" />
                        <span className="text-xs sm:text-sm">Penyedia Responden No. 1 di Indonesia</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.15] mb-6 tracking-tight text-center"
                    >
                        Riset Anda Selesai<br />
                        <span className="text-indigo-600 relative inline-block text-center">
                            Tanpa Ribet & Terjamin
                            <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="6" fill="transparent" />
                            </svg>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-sm sm:text-base md:text-xl max-w-3xl mx-auto mb-10 font-medium leading-relaxed text-center px-4"
                    >
                        Transformasi total proses penelitian Anda. Dari kuesioner hingga laporan sidang - semua dalam satu solusi terintegrasi.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full mb-8 px-4">
                        <Link
                            href="https://wa.me/6285236110219"
                            target="_blank"
                            className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2 group"
                        >
                            Konsultasi via WhatsApp <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
                        </Link>
                        <Link
                            href="https://id.shp.ee/RoYtQCu"
                            target="_blank"
                            className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-indigo-400 hover:shadow-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                        >
                            Lihat di Shopee <ShoppingBag size={20} className="text-orange-500" />
                        </Link>
                    </div>

                    {/* ANXIETY COUNTER */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center px-4"
                    >
                        <div className="inline-flex flex-col sm:flex-row items-center gap-2 text-xs sm:text-sm text-slate-500 bg-white/50 px-4 py-2 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-1">
                                <CheckCircle size={14} className="text-emerald-500" />
                                <span className="font-bold text-emerald-600">12.450+</span> mahasiswa terbantu
                            </div>
                            <div className="hidden sm:block text-slate-300">•</div>
                            <div className="flex items-center gap-1">
                                <ShieldCheck size={14} className="text-indigo-500" />
                                Privasi data 100% terjamin
                            </div>
                        </div>
                    </motion.div>

                    {/* TRUST BAR */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-full max-w-4xl mx-auto mt-12 px-4"
                    >
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-4 text-center">
                            Dipercaya oleh mahasiswa dari:
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {universities.slice(0, 10).map((uni, index) => (
                                <div key={index} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded text-slate-500 font-bold text-xs hover:border-indigo-200 hover:text-slate-700 transition-colors cursor-default">
                                    {uni}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- BENTO GRID STATS --- */}
            <section className="container mx-auto px-4 sm:px-6 mb-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">

                    {/* Main Card */}
                    <div className="lg:col-span-7 bg-slate-950 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl group min-h-[400px] flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-600/30 rounded-full blur-[100px] -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-700"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1 rounded-full text-xs font-bold tracking-widest text-indigo-300 mb-6 uppercase">
                                Impact Metrics
                            </div>
                            <h3 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-none">
                                10.000+
                            </h3>
                            <p className="text-xl md:text-2xl font-bold text-slate-200 max-w-sm leading-tight">
                                Solusi Lengkap untuk Riset Siap Sidang.
                            </p>
                        </div>

                        <div className="mt-8">
                            <div className="inline-block bg-white/5 border border-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl">
                                <p className="text-2xl font-bold flex items-center gap-2">
                                    4.9/5.0 <Star size={20} className="fill-amber-400 text-amber-400" />
                                </p>
                                <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mt-1">Trust Score</p>
                            </div>
                        </div>
                    </div>

                    {/* Feature Cards Grid */}
                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        {[
                            { title: "Responden Berkualitas", desc: "100% manusia asli, akun aktif & terverifikasi.", icon: <Users size={20} />, bg: "bg-blue-50", text: "text-blue-600" },
                            { title: "Eksekusi Kilat", desc: "Hasil dalam 24-48 jam setelah konfirmasi.", icon: <Zap size={20} />, bg: "bg-amber-50", text: "text-amber-500" },
                            { title: "Garansi Validitas", desc: "Data lolos uji SPSS & SmartPLS.", icon: <ShieldCheck size={20} />, bg: "bg-emerald-50", text: "text-emerald-600" },
                            { title: "Fleksibilitas Penuh", desc: "Custom skala, demografi, dan instrument.", icon: <MousePointerClick size={20} />, bg: "bg-purple-50", text: "text-purple-600" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex items-center gap-4 group h-full">
                                <div className={`w-12 h-12 shrink-0 ${item.bg} ${item.text} rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 leading-tight">{item.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- COMPARISON SECTION --- */}
            <section className="container mx-auto px-4 sm:px-6 mb-24 max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-950">
                        Mengapa Solusi Kami <span className="text-indigo-600">Berbeda?</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                        Bandingkan dengan metode konvensional yang menyita waktu dan energi Anda.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Metode Biasa */}
                    <div className="bg-white border-2 border-red-100 rounded-3xl p-8 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-500">
                                <AlertCircle size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">Metode Konvensional</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0"><Clock size={16} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Durasi Panjang</h4>
                                    <p className="text-sm text-slate-500">7-14 hari mencari responden manual.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0"><AlertCircle size={16} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Risiko Tinggi</h4>
                                    <p className="text-sm text-slate-500">Data palsu, asal isi, responden drop out.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0"><FileText size={16} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Proses Rumit</h4>
                                    <p className="text-sm text-slate-500">Harus olah data sendiri, risiko error tinggi.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Solusi EduAssist */}
                    <div className="bg-white border-2 border-indigo-100 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">RECOMMENDED</div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                <Sparkles size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">Solusi EduAssist</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0"><Zap size={16} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Super Cepat</h4>
                                    <p className="text-sm text-slate-500">Data terkumpul dalam <strong>1-2 hari</strong>.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0"><Users size={16} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Kualitas Terjamin</h4>
                                    <p className="text-sm text-slate-500"><strong>100% manusia asli</strong>, respons berkualitas.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0"><Check size={16} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Siap Sidang</h4>
                                    <p className="text-sm text-slate-500">Data siap olah, <strong>garansi valid</strong>.</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-indigo-50 text-center">
                            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold">
                                <ShieldCheck size={16} /> Hemat 86% waktu penelitian
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS SECTION --- */}
            <section className="py-20 bg-slate-100/50 border-y border-slate-200/60 overflow-hidden relative group/carousel">
                <div className="container mx-auto px-4 sm:px-6 mb-12 max-w-7xl text-center">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-950">
                        Testimoni <span className="text-indigo-600">Kepercayaan</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-bold">
                        Ribuan mahasiswa sudah membuktikan solusi kami.
                    </p>
                </div>

                <div className="relative container mx-auto px-4 sm:px-6 max-w-[1400px]">
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 shadow-xl text-slate-700 hover:text-indigo-600 transition-all opacity-0 group-hover/carousel:opacity-100 hidden md:block"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto py-6 no-scrollbar snap-x snap-mandatory scroll-smooth px-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {shopeeReviews.map((t, i) => (
                            <div
                                key={i}
                                className="shrink-0 w-[85%] sm:w-[45%] lg:w-[30%] xl:w-[23%] bg-white p-6 rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20 flex flex-col snap-center hover:border-indigo-200 transition-colors"
                            >
                                <div className="flex gap-1 mb-4 text-amber-400">
                                    {[...Array(5)].map((_, idx) => (
                                        <Star key={idx} size={14} fill="currentColor" strokeWidth={0} />
                                    ))}
                                </div>
                                <p className="text-slate-700 text-sm md:text-base font-medium leading-relaxed mb-6 flex-grow italic">
                                    "{t.review}"
                                </p>
                                <div className="mt-auto pt-4 border-t border-slate-100">
                                    <h4 className="font-black text-slate-900 text-sm mb-0.5">{t.name}</h4>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 shadow-xl text-slate-700 hover:text-indigo-600 transition-all opacity-0 group-hover/carousel:opacity-100 hidden md:block"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="container mx-auto px-4 sm:px-6 py-20 max-w-7xl">
                <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-white flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/30 rounded-full blur-[100px] -mr-24 -mt-24 transition-transform group-hover:scale-125 duration-700"></div>

                    <div className="relative z-10 max-w-2xl text-center lg:text-left">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
                            Siap Lulus <br /> Tanpa Drama?
                        </h2>
                        <p className="text-indigo-100 text-lg md:text-xl font-medium opacity-90">
                            Jangan biarkan kuesioner kosong menghambat masa depan Anda. Hubungi kami sekarang.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                        <Link
                            href="https://wa.me/6285236110219"
                            target="_blank"
                            className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-900 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            <MessageCircle size={22} /> Konsultasi Gratis
                        </Link>
                        <Link
                            href="https://id.shp.ee/RoYtQCu"
                            target="_blank"
                            className="bg-indigo-500 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            <ShoppingBag size={22} /> Lihat Shopee
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- FOOTER CTA --- */}
            <footer className="container mx-auto px-6 pb-20 text-center">
                <div className="p-12 md:p-20 bg-white border border-slate-200 rounded-[3rem] shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-50/50 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full -z-10 origin-center"></div>

                    <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight leading-[1.1] text-slate-900">
                        Mulai Riset Anda <br className="hidden md:block" />
                        <span className="text-indigo-600">Hari Ini?</span>
                    </h2>

                    <Link
                        href="https://wa.me/6285236110219"
                        target="_blank"
                        className="inline-flex items-center gap-3 bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-slate-900 transition-all hover:scale-105 active:scale-95"
                    >
                        Mulai Konsultasi Sekarang
                        <MessageCircle size={24} />
                    </Link>

                    <p className="mt-8 text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">
                        Fast Response • 24/7 Support • Garansi Kepuasan
                    </p>
                </div>
            </footer>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </main>
    );
}