"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, ArrowRight, UserCircle,
    Sparkles, MessageCircle, Clock,
    ChevronLeft, ChevronRight, Search, X, PlayCircle,
    GraduationCap, Users, Bookmark
} from "lucide-react";
import Link from "next/link";
// IMPORT KONEKSI SUPABASE
import { supabase } from "../../lib/supabase";

export default function ArtikelPage() {
    const [filter, setFilter] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");
    const [activePage, setActivePage] = useState(1);
    const [articles, setArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 8;

    const categories = ["Semua", "Responden", "SPSS", "Kuesioner", "Validitas"];

    // --- 1. LOGIKA FETCH DATA DENGAN PENJADWALAN ---
    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            const sekarang = new Date().toISOString(); // Waktu Real-time

            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('status', 'Published') // Hanya yang sudah Published
                .lte('published_at', sekarang) // HANYA muncul jika sudah jatuh tempo
                .order('published_at', { ascending: false });

            if (data) {
                setArticles(data);
            }
            setIsLoading(false);
        };

        fetchArticles();
    }, []);

    // --- 2. LOGIKA FILTER & SEARCH ---
    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const matchesFilter = filter === "Semua" || article.category === filter;
            const matchesSearch =
                (article.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (article.excerpt?.toLowerCase() || "").includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [filter, searchQuery, articles]);

    // Logika Pagination
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    const paginatedArticles = filteredArticles.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

    return (
        <main className="pt-32 md:pt-48 pb-20 bg-[#F8FAFC] min-h-screen">
            {/* --- HERO SECTION: TRUST SIGNALS --- */}
            <div className="container mx-auto px-6 mb-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full text-indigo-700 font-bold text-xs uppercase tracking-widest mb-8 shadow-sm">
                            <Sparkles size={14} /> Knowledge Hub & Tutorial
                        </motion.div>
                        <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.95] mb-8 tracking-tighter">
                            Panduan Akademik <br /> <span className="text-indigo-600">Teruji.</span>
                        </h1>
                        <p className="text-slate-500 text-lg md:text-2xl max-w-xl font-medium leading-relaxed">
                            Disusun untuk membantu <span className="text-slate-900 font-bold">12.000+ mahasiswa</span> lolos sidang <span className="text-indigo-600 underline decoration-indigo-400 font-bold underline-offset-8">tanpa revisi berulang.</span>
                        </p>
                    </div>
                    <div className="hidden lg:grid grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-indigo-100/50 border border-slate-50">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Users size={24} /></div>
                            <div className="text-4xl font-black text-slate-900 mb-1">12.000+</div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">Mahasiswa Berhasil Lulus</p>
                        </div>
                        <div className="bg-slate-950 p-8 rounded-[3rem] shadow-xl text-white translate-y-8">
                            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6"><GraduationCap size={24} /></div>
                            <div className="text-4xl font-black mb-1">95%</div>
                            <p className="text-[10px] text-indigo-300 font-black uppercase tracking-widest leading-relaxed">Tingkat Kelolosan Sidang</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- STICKY NAVIGATION: SEARCH & FILTER --- */}
            <div className="sticky top-0 z-30 bg-[#F8FAFC]/80 backdrop-blur-md border-b border-slate-200 py-6 mb-12 shadow-sm">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="relative w-full lg:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Cari topik (SPSS, Validitas, Responden)..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setActivePage(1); }}
                                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium text-slate-700 shadow-sm"
                            />
                            {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={16} /></button>}
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map((cat) => (
                                <button key={cat} onClick={() => { setFilter(cat); setActivePage(1); }} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-100 hover:border-indigo-200"}`}>{cat}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ARTICLES GRID --- */}
            <div className="container mx-auto px-6 mb-20">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <div className="text-center py-40">
                            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Menyelaraskan Pengetahuan...</p>
                        </div>
                    ) : paginatedArticles.length > 0 ? (
                        <motion.div key={filter + searchQuery + activePage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {paginatedArticles.map((post) => (
                                <Link key={post.id} href={`/artikel/${post.id}`} className="group bg-white border border-slate-100 p-5 rounded-[2.5rem] hover:shadow-2xl hover:shadow-indigo-200/40 transition-all flex flex-col relative overflow-hidden">
                                    <div className="absolute top-8 left-8 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black text-indigo-600 shadow-sm uppercase tracking-widest border border-indigo-50">
                                        {post.badge || 'Terbaru'}
                                    </div>

                                    <div className="aspect-[4/3] rounded-[1.8rem] mb-6 flex items-center justify-center overflow-hidden relative shadow-inner bg-slate-50">
                                        {post.visual_type === 'icon' ? (
                                            <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                                                <Bookmark size={48} strokeWidth={1.5} />
                                            </div>
                                        ) : (
                                            <img src={post.visual_type === 'video' ? `https://img.youtube.com/vi/${post.visual_value}/hqdefault.jpg` : post.visual_value} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Thumbnail" />
                                        )}

                                        {post.visual_type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl text-red-600"><PlayCircle size={32} fill="currentColor" className="text-white" /></div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center mb-4 px-1">
                                        <span className="text-[9px] font-black px-3 py-1 rounded-full uppercase bg-indigo-50 text-indigo-700 tracking-widest">{post.category}</span>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1"><Clock size={10} /> 5 min</span>
                                    </div>

                                    <h3 className="font-black text-slate-900 text-lg mb-3 leading-tight group-hover:text-indigo-600 transition-colors px-1 line-clamp-2">{post.title}</h3>
                                    <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-grow line-clamp-3 font-medium px-1">{post.excerpt}</p>

                                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-50 px-1">
                                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200 italic font-black text-[8px]">{post.author?.charAt(0)}</div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{post.author || 'Tim EduAssist'}</span>
                                        <ArrowRight size={14} className="ml-auto text-indigo-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                            <Search size={48} className="mx-auto text-slate-200 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900">Topik tidak ditemukan</h3>
                            <p className="text-slate-400 text-sm mt-2 font-medium">Coba gunakan kata kunci lain atau cek kembali nanti.</p>
                        </div>
                    )}
                </AnimatePresence>

                {/* --- PAGINATION --- */}
                {totalPages > 1 && (
                    <div className="mt-20 flex justify-center items-center gap-3">
                        <button onClick={() => setActivePage(prev => Math.max(prev - 1, 1))} disabled={activePage === 1} className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"><ChevronLeft size={20} /></button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i + 1} onClick={() => setActivePage(i + 1)} className={`w-14 h-14 rounded-2xl font-black text-sm transition-all shadow-sm ${activePage === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-300'}`}>{i + 1}</button>
                        ))}
                        <button onClick={() => setActivePage(prev => Math.min(prev + 1, totalPages))} disabled={activePage === totalPages} className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"><ChevronRight size={20} /></button>
                    </div>
                )}
            </div>

            {/* --- FOOTER CTA: PERSUASIF --- */}
            <section className="container mx-auto px-6">
                <div className="bg-slate-950 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="max-w-xl text-center md:text-left">
                            <div className="flex justify-center md:justify-start gap-2 mb-6 text-indigo-300">
                                <Sparkles size={20} /> <span className="uppercase font-black text-[10px] tracking-[0.3em]">Premium Support</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tight">Butuh panduan riset yang dipersonalisasi?</h2>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed">Tim analis data akademik kami siap memastikan sidang Anda sukses tanpa revisi mayor.</p>
                        </div>
                        <Link href="https://wa.me/628123456789" className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white hover:text-indigo-600 transition-all shadow-xl active:scale-95 whitespace-nowrap flex items-center gap-3">
                            <MessageCircle size={22} /> Tanya Strategi Riset
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}