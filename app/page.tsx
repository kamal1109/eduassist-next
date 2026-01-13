"use client";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Users,
    ShieldCheck,
    Sparkles,
    MessageCircle,
    Zap,
    MousePointerClick,
    Star,
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    ShieldIcon,
    CheckIcon,
    Clock,
    FileText,
    AlertCircle,
    CheckCircle,
} from "lucide-react";

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
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [visibleReviews, setVisibleReviews] = useState<typeof shopeeReviews>([]);
    const reviewsPerSlide = 4;
    const totalSlides = Math.ceil(shopeeReviews.length / reviewsPerSlide);

    useEffect(() => {
        const startIndex = currentSlide * reviewsPerSlide;
        const endIndex = startIndex + reviewsPerSlide;
        setVisibleReviews(shopeeReviews.slice(startIndex, endIndex));
    }, [currentSlide]);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
            if (direction === "left") {
                setCurrentSlide(prev => Math.max(0, prev - 1));
            } else {
                setCurrentSlide(prev => Math.min(totalSlides - 1, prev + 1));
            }
        }
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentSlide(slideIndex);
        if (scrollRef.current) {
            const cardWidth = scrollRef.current.clientWidth / reviewsPerSlide;
            const scrollPosition = slideIndex * reviewsPerSlide * cardWidth;
            scrollRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
        }
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
                        className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-indigo-700 font-bold text-xs sm:text-sm uppercase tracking-[0.15em] mb-4 sm:mb-6 md:mb-8 shadow-sm"
                    >
                        <Sparkles size={14} className="fill-indigo-500 text-indigo-500 animate-pulse" />
                        <span className="text-xs sm:text-sm">Penyedia Responden No. 1 di Indonesia</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 leading-[1.15] mb-3 sm:mb-4 md:mb-8 tracking-tight text-center"
                    >
                        Riset Anda Selesai<br />
                        <span className="text-indigo-600 relative inline-block text-center">
                            Tanpa Ribet & Terjamin
                            <svg className="absolute -bottom-1 sm:-bottom-1.5 md:-bottom-2 left-0 w-full h-1.5 sm:h-2 md:h-3 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="6" fill="transparent" />
                            </svg>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-xs sm:text-sm md:text-base lg:text-xl max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-14 font-medium leading-relaxed text-center px-2"
                    >
                        Transformasi total proses penelitian Anda. Dari kuesioner hingga laporan sidang - semua dalam satu solusi terintegrasi.
                    </motion.p>

                    {/* BUTTONS DAN ANXIETY COUNTER */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center w-full mb-6 px-2">
                        <Link
                            href="https://wa.me/6285236110219"
                            className="w-full sm:w-auto bg-slate-900 text-white px-4 sm:px-6 md:px-10 py-2.5 sm:py-3 md:py-5 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 group"
                        >
                            Konsultasi Solusi Riset
                            <MessageCircle size={18} className="group-hover:rotate-12 transition-transform" />
                        </Link>
                        <Link
                            href="https://id.shp.ee/RoYtQCu"
                            target="_blank"
                            className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-4 sm:px-6 md:px-10 py-2.5 sm:py-3 md:py-5 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:border-indigo-400 hover:shadow-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2"
                        >
                            Lihat Portfolio
                            <ShoppingBag size={18} className="text-orange-500" />
                        </Link>
                    </div>

                    {/* ANXIETY COUNTER */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center px-2"
                    >
                        <div className="inline-flex flex-col sm:flex-row items-center gap-2 text-xs text-slate-500 bg-white/50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-1">
                                <CheckCircle size={12} className="text-emerald-500" />
                                <span className="font-bold text-emerald-600">12.450+</span> mahasiswa terbantu
                            </div>
                            <div className="hidden sm:block text-slate-300">•</div>
                            <div className="flex items-center gap-1">
                                <ShieldCheck size={12} className="text-indigo-500" />
                                Privasi data 100% terjamin
                            </div>
                        </div>
                    </motion.div>

                    {/* TRUST BAR - UNIVERSITAS TOP */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-full max-w-4xl mx-auto mt-8 sm:mt-12 px-2"
                    >
                        <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-widest font-bold mb-3 sm:mb-4 text-center">
                            Dipercaya oleh mahasiswa dari:
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
                            {universities.slice(0, 8).map((uni, index) => (
                                <div
                                    key={index}
                                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-50 border border-slate-100 rounded text-slate-500 font-bold text-xs sm:text-sm transition-all hover:border-indigo-200 hover:text-slate-700"
                                >
                                    {uni}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- BENTO GRID SECTION --- */}
            <section className="container mx-auto px-4 sm:px-6 mb-12 sm:mb-16 md:mb-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 max-w-7xl mx-auto">

                    {/* Main Card: Heroic Metric */}
                    <div className="lg:col-span-7 bg-slate-950 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-8 md:p-14 text-white relative overflow-hidden shadow-xl group min-h-[280px] sm:min-h-[320px] md:min-h-[450px]">
                        <div className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[450px] md:h-[450px] bg-indigo-600/30 rounded-full blur-[60px] sm:blur-[80px] md:blur-[120px] -mr-12 sm:-mr-24 -mt-12 sm:-mt-24 transition-transform group-hover:scale-125 duration-700"></div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-2 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] text-indigo-300 mb-4 sm:mb-6 uppercase">
                                    Impact Metrics
                                </div>
                                <h3 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter mb-2 sm:mb-4 leading-none">
                                    10.000+
                                </h3>
                                <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-slate-200 max-w-sm leading-tight">
                                    Solusi Lengkap untuk Riset Siap Sidang.
                                </p>
                            </div>

                            <div className="mt-6 sm:mt-8">
                                <div className="inline-block bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-2 sm:px-5 md:px-7 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl">
                                    <p className="text-base sm:text-lg md:text-2xl font-bold flex items-center gap-2">
                                        4.9/5.0 <Star size={16} className="fill-amber-400 text-amber-400" />
                                    </p>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-0.5">Trust Score</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Cards Grid */}
                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 md:gap-6">
                        {[
                            { title: "Responden Berkualitas", desc: "100% manusia asli, akun aktif & terverifikasi.", icon: <Users size={20} />, bg: "bg-blue-50", text: "text-blue-600" },
                            { title: "Eksekusi Kilat", desc: "Hasil dalam 24-48 jam setelah konfirmasi.", icon: <Zap size={20} />, bg: "bg-amber-50", text: "text-amber-500" },
                            { title: "Garansi Validitas", desc: "Data lolos uji SPSS & SmartPLS.", icon: <ShieldCheck size={20} />, bg: "bg-emerald-50", text: "text-emerald-600" },
                            { title: "Fleksibilitas Penuh", desc: "Custom skala, demografi, dan instrument.", icon: <MousePointerClick size={20} />, bg: "bg-purple-50", text: "text-purple-600" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-4 sm:p-5 md:p-8 rounded-xl sm:rounded-2xl border border-slate-200/60 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex items-center gap-4 group">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 shrink-0 ${item.bg} ${item.text} rounded-lg sm:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-slate-900 leading-tight">{item.title}</h4>
                                    <p className="text-xs sm:text-sm md:text-base text-slate-500 font-medium mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- MENGAPA KAMI BERBEDA SECTION --- */}
            <section className="container mx-auto px-4 sm:px-6 mb-12 sm:mb-16 md:mb-24 max-w-6xl">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2 sm:mb-3 md:mb-4 text-slate-950">
                        Mengapa Solusi Kami <span className="text-indigo-600">Berbeda?</span>
                    </h2>
                    <p className="text-slate-500 text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                        Bandingkan dengan metode konvensional yang menyita waktu dan energi.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    {/* Metode Biasa */}
                    <div className="bg-white border-2 border-red-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                                <AlertCircle size={18} className="text-red-500" />
                            </div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900">Metode Konvensional</h3>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Clock size={12} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">Durasi Panjang</h4>
                                    <p className="text-slate-600 text-xs sm:text-sm">7-14 hari untuk mencari responden manual</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 sm:gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <AlertCircle size={12} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">Risiko Tinggi</h4>
                                    <p className="text-slate-600 text-xs sm:text-sm">Data palsu, responden tidak serius, drop out</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 sm:gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <FileText size={12} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">Proses Rumit</h4>
                                    <p className="text-slate-600 text-xs sm:text-sm">Harus olah data sendiri, risiko error tinggi</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Solusi EduAssist */}
                    <div className="bg-white border-2 border-indigo-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl relative overflow-hidden">
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-indigo-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">
                            RECOMMENDED
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                                <Sparkles size={18} className="text-indigo-600" />
                            </div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900">Solusi EduAssist</h3>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Zap size={12} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">Super Cepat</h4>
                                    <p className="text-slate-600 text-xs sm:text-sm">Data terkumpul dalam <strong>1-2 hari</strong></p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 sm:gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Users size={12} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">Kualitas Terjamin</h4>
                                    <p className="text-slate-600 text-xs sm:text-sm"><strong>100% manusia asli</strong>, respons berkualitas</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 sm:gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <CheckCircle size={12} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">Siap Sidang</h4>
                                    <p className="text-slate-600 text-xs sm:text-sm">Data siap olah SPSS/PLS, <strong>garansi valid</strong></p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-indigo-50">
                            <div className="text-center">
                                <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
                                    <ShieldCheck size={14} />
                                    <span className="font-bold">Hemat 86% waktu penelitian</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS SECTION --- */}
            <section className="py-12 sm:py-16 md:py-20 bg-slate-100/50 border-y border-slate-200/60 relative group/carousel overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12 max-w-7xl">
                    <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2 sm:mb-3 text-slate-950 text-center">
                        Testimoni <span className="text-indigo-600">Kepercayaan</span>.
                    </h2>
                    <p className="text-slate-500 text-sm sm:text-base md:text-lg lg:text-xl font-bold text-center">
                        Ribuan mahasiswa sudah membuktikan solusi kami.
                    </p>
                </div>

                <div className="relative container mx-auto px-4 sm:px-6 max-w-[1400px]">
                    {/* Scroll Buttons */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 md:p-4 bg-white/80 backdrop-blur-sm md:backdrop-blur-md rounded-full border border-slate-200 shadow-lg md:shadow-xl text-slate-700 hover:text-indigo-600 transition-all hidden sm:flex opacity-0 group-hover/carousel:opacity-100 active:scale-90"
                    >
                        <ChevronLeft size={20} className="sm:w-5 sm:h-5 md:w-7 md:h-7" />
                    </button>

                    {/* Testimonial Cards Container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto py-4 sm:py-6 no-scrollbar snap-x snap-mandatory scroll-smooth px-1"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* Menampilkan testimonial 4 per slide */}
                        {visibleReviews.map((t, i) => (
                            <div
                                key={i}
                                className="shrink-0 w-[80%] xs:w-[70%] sm:w-[45%] md:w-[48%] lg:w-[30%] xl:w-[23%] bg-white p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-slate-200/60 shadow-md sm:shadow-lg shadow-slate-200/20 flex flex-col snap-center hover:border-indigo-200 transition-colors"
                            >
                                <div className="flex gap-0.5 mb-3 sm:mb-4 text-[#FFB800]">
                                    {[...Array(5)].map((_, idx) => (
                                        <Star key={idx} size={12} className="sm:w-4 sm:h-4" fill="currentColor" strokeWidth={0} />
                                    ))}
                                </div>
                                <p className="text-slate-700 text-xs sm:text-sm md:text-base font-medium leading-relaxed mb-4 sm:mb-6 flex-grow italic line-clamp-4">
                                    "{t.review}"
                                </p>
                                <div className="mt-auto pt-3 sm:pt-4 border-t border-slate-100">
                                    <h4 className="font-black text-slate-900 text-xs sm:text-sm md:text-base leading-none mb-0.5">{t.name}</h4>
                                    <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">{t.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'bg-indigo-600 w-6 sm:w-8'
                                    : 'bg-slate-300 hover:bg-slate-400'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 md:p-4 bg-white/80 backdrop-blur-sm md:backdrop-blur-md rounded-full border border-slate-200 shadow-lg md:shadow-xl text-slate-700 hover:text-indigo-600 transition-all hidden sm:flex opacity-0 group-hover/carousel:opacity-100 active:scale-90"
                    >
                        <ChevronRight size={20} className="sm:w-5 sm:h-5 md:w-7 md:h-7" />
                    </button>
                </div>

                {/* Info jumlah testimonial */}
                <div className="text-center mt-4 sm:mt-6 text-slate-500 text-xs sm:text-sm px-2">
                    Menampilkan {currentSlide * reviewsPerSlide + 1}-{Math.min((currentSlide + 1) * reviewsPerSlide, shopeeReviews.length)} dari {shopeeReviews.length} testimonial
                </div>
            </section>

            {/* --- SOLUSI END-TO-END SECTION - DIPERBAIKI --- */}
            <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 max-w-7xl">
                <div className="bg-indigo-600 rounded-2xl sm:rounded-3xl md:rounded-[4rem] p-6 sm:p-8 md:p-12 lg:p-20 text-white grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center shadow-xl shadow-indigo-100 relative overflow-hidden">
                    {/* Background effect yang sederhana */}
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] bg-indigo-500/30 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] bg-indigo-400/20 rounded-full blur-[60px] -ml-20 -mb-20"></div>

                    {/* KOLOM KIRI - Solusi End-to-End */}
                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 md:mb-8 leading-tight tracking-tight">
                            Solusi <span className="text-indigo-200">End-to-End</span>.
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-indigo-100 mb-6 sm:mb-8">
                            Tidak sekadar jasa pengumpulan data, tetapi solusi lengkap untuk penelitian Anda.
                        </p>
                        <ul className="space-y-3 sm:space-y-4 font-medium text-sm sm:text-base md:text-lg">
                            {[
                                "Konsultasi desain kuesioner gratis",
                                "Panel responden spesifik target penelitian",
                                "Quality control real-time selama pengisian",
                                "Support analisis data & interpretasi hasil"
                            ].map((text, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <div className="shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-white/20 rounded-lg flex items-center justify-center mt-0.5">
                                        <CheckIcon size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                                    </div>
                                    <span className="font-bold leading-tight">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* KOLOM KANAN - Protocol Assurance */}
                    <div className="bg-slate-900 p-5 sm:p-6 md:p-8 lg:p-12 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl relative z-10 border border-white/10 mt-6 md:mt-0">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
                            <ShieldIcon size={24} className="sm:w-6 sm:h-6 md:w-8 md:h-8 text-indigo-400" />
                            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black uppercase tracking-widest">Protocol Assurance</h3>
                        </div>
                        <ul className="text-xs sm:text-sm md:text-base lg:text-lg space-y-3 sm:space-y-4 font-medium text-slate-300">
                            <li className="flex items-start gap-2 sm:gap-3">
                                <span className="text-indigo-400 mt-0.5">✓</span>
                                <div>
                                    <strong className="text-indigo-100">Ethical Compliance:</strong>
                                    <p className="mt-0.5">No sensitive/personal data mining</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2 sm:gap-3">
                                <span className="text-indigo-400 mt-0.5">✓</span>
                                <div>
                                    <strong className="text-indigo-100">Data Security:</strong>
                                    <p className="mt-0.5">Anonymity & encryption guaranteed</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2 sm:gap-3">
                                <span className="text-indigo-400 mt-0.5">✓</span>
                                <div>
                                    <strong className="text-indigo-100">Academic Integrity:</strong>
                                    <p className="mt-0.5">Valid methodology & reporting</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2 sm:gap-3">
                                <span className="text-indigo-400 mt-0.5">✓</span>
                                <div>
                                    <strong className="text-indigo-100">Consultation First:</strong>
                                    <p className="mt-0.5">Free pre-payment discussion</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <footer className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16 md:pb-20 text-center">
                <div className="p-6 sm:p-8 md:p-12 lg:p-16 xl:p-24 bg-white border border-slate-200 rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-[5rem] shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-50/50 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full -z-10 origin-center"></div>

                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 md:mb-10 tracking-tight leading-[1.1] text-slate-900"
                    >
                        Transformasi <br className="hidden sm:block" />
                        <span className="text-indigo-600">Pengalaman Riset</span> Anda.
                    </motion.h2>

                    <div className="mb-4 sm:mb-6 md:mb-10 max-w-2xl mx-auto">
                        <p className="text-slate-500 text-sm sm:text-base md:text-lg lg:text-xl">
                            Dari ribet mencari responden hingga sidang sukses - semua dalam satu solusi terintegrasi.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center">
                        <Link
                            href="https://wa.me/6285236110219"
                            className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 bg-indigo-600 text-white px-6 sm:px-8 md:px-10 lg:px-16 py-3 sm:py-4 md:py-5 lg:py-6 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-sm sm:text-base md:text-lg lg:text-xl shadow-lg sm:shadow-xl hover:bg-slate-900 transition-all hover:scale-105 active:scale-95 group w-full sm:w-auto"
                        >
                            Mulai Solusi Riset Anda
                            <MessageCircle size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-7 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="https://id.shp.ee/RoYtQCu"
                            target="_blank"
                            className="inline-flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-white text-slate-800 border border-slate-300 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl font-bold hover:border-indigo-400 hover:shadow-sm transition-all active:scale-95 text-xs sm:text-sm md:text-base w-full sm:w-auto"
                        >
                            Lihat Portfolio Lengkap
                            <ShoppingBag size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-6" />
                        </Link>
                    </div>

                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck size={14} className="sm:w-4 sm:h-4" />
                            <span>Garansi 100% kepuasan</span>
                        </div>
                        <div className="hidden sm:block">•</div>
                        <div className="flex items-center gap-1.5">
                            <Zap size={14} className="sm:w-4 sm:h-4" />
                            <span>Proses 24-48 jam</span>
                        </div>
                        <div className="hidden sm:block">•</div>
                        <div className="flex items-center gap-1.5">
                            <Users size={14} className="sm:w-4 sm:h-4" />
                            <span>Responden terverifikasi</span>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx global>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .scroll-smooth {
                    scroll-behavior: smooth;
                }
                .line-clamp-4 {
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                @media (max-width: 640px) {
                    .xs\\:w-\\[70\\%\\] {
                        width: 70% !important;
                    }
                }
            `}</style>
        </main>
    );
}