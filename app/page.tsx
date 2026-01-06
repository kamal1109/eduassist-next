"use client";
import { useRef } from "react";
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

export default function Home() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <main className="bg-[#F8FAFC] text-slate-900 overflow-x-hidden min-h-screen selection:bg-indigo-100 selection:text-indigo-700">

            {/* --- HERO SECTION --- */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-6 overflow-hidden bg-white">
                <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/70 via-white to-transparent -z-10"></div>

                <div className="container mx-auto max-w-6xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full text-indigo-700 font-bold text-xs md:text-sm uppercase tracking-[0.15em] mb-8 shadow-sm"
                    >
                        <Sparkles size={16} className="fill-indigo-500 text-indigo-500 animate-pulse" />
                        Jasa Kuesioner No.1 di Indonesia
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight"
                    >
                        Riset Selesai <br />
                        <span className="text-indigo-600 relative inline-block">
                            Lebih Terpercaya
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                            </svg>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-base md:text-xl lg:text-2xl max-w-3xl mx-auto mb-10 md:mb-14 font-medium leading-relaxed"
                    >
                        Akselerasi penelitian Anda dengan data responden manusia asli. Validitas terjamin untuk hasil olah data SPSS & PLS yang sempurna.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="https://wa.me/628123456789" className="w-full sm:w-auto bg-slate-900 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200 active:scale-95 flex items-center justify-center gap-3 group">
                            Order via WhatsApp <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
                        </Link>
                        <Link href="https://id.shp.ee/RoYtQCu" target="_blank" className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-lg hover:border-indigo-400 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3">
                            Toko Shopee <ShoppingBag size={22} className="text-orange-500" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- BENTO GRID SECTION --- */}
            <section className="container mx-auto px-6 mb-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">

                    {/* Main Card: Heroic Metric */}
                    <div className="lg:col-span-7 bg-slate-950 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl group min-h-[320px] md:min-h-[450px]">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-indigo-600/30 rounded-full blur-[80px] md:blur-[120px] -mr-24 -mt-24 transition-transform group-hover:scale-125 duration-700"></div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] text-indigo-300 mb-6 uppercase">
                                    Trusted Partner
                                </div>
                                <h3 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 leading-none">
                                    10.000+
                                </h3>
                                <p className="text-lg md:text-3xl font-bold text-slate-200 max-w-sm md:max-w-md leading-tight">
                                    Klien Mahasiswa Berhasil Lulus Melalui Layanan Kami.
                                </p>
                            </div>

                            <div className="mt-8">
                                <div className="inline-block bg-white/5 border border-white/10 backdrop-blur-md px-5 md:px-7 py-3 md:py-4 rounded-2xl">
                                    <p className="text-lg md:text-2xl font-bold flex items-center gap-2">
                                        4.9/5.0 <Star size={20} className="fill-amber-400 text-amber-400" />
                                    </p>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Shopee Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Cards Grid */}
                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
                        {[
                            { title: "100% Manusia Asli", desc: "Akun aktif & real.", icon: <Users size={24} />, bg: "bg-blue-50", text: "text-blue-600" },
                            { title: "Pengerjaan Kilat", desc: "Hitungan jam beres.", icon: <Zap size={24} />, bg: "bg-amber-50", text: "text-amber-500" },
                            { title: "Garansi Validitas", desc: "Siap olah SPSS.", icon: <ShieldCheck size={24} />, bg: "bg-emerald-50", text: "text-emerald-600" },
                            { title: "Custom Request", desc: "Bebas atur pola.", icon: <MousePointerClick size={24} />, bg: "bg-purple-50", text: "text-purple-600" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex items-center gap-5 group">
                                <div className={`w-14 h-14 md:w-16 md:h-16 shrink-0 ${item.bg} ${item.text} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="text-lg md:text-xl font-black text-slate-900 leading-tight">{item.title}</h4>
                                    <p className="text-slate-500 text-sm md:text-base font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS SECTION --- */}
            <section className="py-20 bg-slate-100/50 border-y border-slate-200/60 relative group/carousel overflow-hidden">
                <div className="container mx-auto px-6 mb-12 max-w-7xl">
                    <h2 className="text-3xl md:text-6xl font-black tracking-tight mb-3 text-slate-950">Suara Komunitas.</h2>
                    <p className="text-slate-500 text-base md:text-xl font-bold">Ulasan terverifikasi langsung dari transaksi Shopee.</p>
                </div>

                <div className="relative container mx-auto px-6 max-w-[1400px]">
                    {/* Scroll Buttons - Hidden on Mobile */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 shadow-xl text-slate-700 hover:text-indigo-600 transition-all hidden lg:flex opacity-0 group-hover/carousel:opacity-100 active:scale-90"
                    >
                        <ChevronLeft size={28} />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex gap-4 md:gap-6 overflow-x-auto py-6 no-scrollbar snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {shopeeReviews.map((t, i) => (
                            <div
                                key={i}
                                className="shrink-0 w-[85%] sm:w-[450px] md:w-[400px] lg:w-[calc((100%-72px)/4)] bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200/60 shadow-lg shadow-slate-200/20 flex flex-col snap-center hover:border-indigo-200 transition-colors"
                            >
                                <div className="flex gap-0.5 mb-6 text-[#FFB800]">
                                    {[...Array(5)].map((_, idx) => <Star key={idx} size={18} fill="currentColor" strokeWidth={0} />)}
                                </div>
                                <p className="text-slate-700 text-lg md:text-xl font-medium leading-relaxed mb-8 flex-grow italic">
                                    "{t.review}"
                                </p>
                                <div className="mt-auto pt-6 border-t border-slate-100">
                                    <h4 className="font-black text-slate-900 text-base md:text-lg leading-none mb-2">{t.name}</h4>
                                    <p className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-wider">{t.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 shadow-xl text-slate-700 hover:text-indigo-600 transition-all hidden lg:flex opacity-0 group-hover/carousel:opacity-100 active:scale-90"
                    >
                        <ChevronRight size={28} />
                    </button>
                </div>
            </section>

            {/* --- S&K SECTION --- */}
            <section className="container mx-auto px-6 py-20 max-w-7xl">
                <div className="bg-indigo-600 rounded-[3rem] md:rounded-[4rem] p-8 md:p-20 text-white grid md:grid-cols-2 gap-12 items-center shadow-3xl shadow-indigo-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_10s_infinite_linear]"></div>

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight tracking-tight">Kustomisasi <br /> Tanpa Batas.</h2>
                        <ul className="space-y-5 font-bold text-lg md:text-xl">
                            {[
                                "Pola Skala Likert Tersistem",
                                "Demografi Responden Spesifik",
                                "Jaminan Data 100% Reliabel"
                            ].map((text, idx) => (
                                <li key={idx} className="flex items-center gap-4">
                                    <div className="shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                        <CheckIcon size={18} className="text-white" />
                                    </div>
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-slate-950 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl relative z-10 border border-white/10">
                        <div className="flex items-center gap-3 mb-8">
                            <ShieldIcon size={32} className="text-indigo-400" />
                            <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest">Protocol S&K</h3>
                        </div>
                        <ul className="text-base md:text-lg space-y-4 font-medium text-slate-300">
                            <li className="flex gap-3"><span>•</span> No SARA / Pornography Content</li>
                            <li className="flex gap-3"><span>•</span> Record Email must be Disabled</li>
                            <li className="flex gap-3"><span>•</span> Consultation before Payment</li>
                            <li className="flex gap-3"><span>•</span> Min. Order: 30 Respondents</li>
                        </ul>
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
                        Siap Menyelesaikan <br className="hidden md:block" /> Penelitian Anda?
                    </motion.h2>

                    <Link href="https://wa.me/628123456789" className="inline-flex items-center gap-4 bg-indigo-600 text-white px-10 md:px-16 py-5 md:py-7 rounded-[2rem] font-black text-xl md:text-2xl shadow-xl hover:bg-slate-900 transition-all hover:scale-105 active:scale-95 group">
                        Konsultasi Sekarang
                        <MessageCircle size={28} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <p className="mt-8 text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">Fast Response • 24/7 Support</p>
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
      `}</style>
        </main>
    );
}