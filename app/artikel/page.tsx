"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { Search, Sparkles, BookOpen, MessageCircle, LineChart, Users, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

// --- TYPE DEFINITION ---
interface Article {
    id: string;
    title: string;
    slug: string; // Pastikan ini ada
    excerpt: string;
    content: string;
    category: string;
    author: string;
    badge: string;
    visual_type: 'icon' | 'image' | 'video';
    visual_value: string;
    cover_image: string | null;
    published_at: string;
    status: string;
    view_count: number;
    tags?: string[];
}

// Helper untuk membersihkan tag HTML
const stripHtml = (html: string) => {
    if (typeof window === 'undefined') return html;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

// --- KOMPONEN KONTEN UTAMA ---
function ArtikelContent() {
    const searchParams = useSearchParams();
    const initialFilter = searchParams.get('category') || "Semua";
    const initialSearch = searchParams.get('search') || "";

    const [filter, setFilter] = useState(initialFilter);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [activePage, setActivePage] = useState(1);
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sesuaikan items per page
    const itemsPerPage = 12;

    const categories = [
        "Semua", "Edukasi Umum", "Mahasiswa", "Dosen & Peneliti",
        "Bisnis & UMKM", "Studi Kasus", "Teknis & Metode", "Info Jasa"
    ];

    const getBadge = (cat: string) => {
        const map: Record<string, string> = {
            "Mahasiswa": "Skripsi",
            "Bisnis & UMKM": "B2B",
            "Dosen & Peneliti": "Akademik",
            "Studi Kasus": "Success Story",
            "Teknis & Metode": "Teknis",
            "Info Jasa": "Promo",
            "Edukasi Umum": "Basics"
        };
        return map[cat] || "Artikel";
    };

    const fetchArticles = useCallback(async () => {
        setIsLoading(true);
        try {
            let query = supabase
                .from('articles')
                .select('*') // Ini otomatis mengambil kolom 'slug' juga
                .eq('status', 'Published')
                .order('published_at', { ascending: false });

            const { data, error } = await query;
            if (error) throw error;

            if (data) {
                const formatted: Article[] = data.map(item => {
                    let finalImageUrl = "";
                    if (item.visual_type === 'video' && item.visual_value) {
                        finalImageUrl = `https://img.youtube.com/vi/${item.visual_value}/hqdefault.jpg`;
                    } else if (item.visual_type === 'image') {
                        finalImageUrl = item.cover_image || item.visual_value || "";
                    }

                    const cleanText = stripHtml(item.content || "");

                    return {
                        id: item.id,
                        title: item.title || "Judul Artikel",
                        slug: item.slug || item.id, // PENTING: Gunakan slug dari DB, fallback ke ID
                        content: item.content || "",
                        excerpt: item.excerpt || (cleanText.substring(0, 100) + "..."),
                        category: item.category || "Edukasi Umum",
                        author: item.author || "Tim Riset",
                        badge: item.badge || getBadge(item.category),
                        visual_type: item.visual_type || 'icon',
                        visual_value: item.visual_value || "",
                        cover_image: finalImageUrl,
                        published_at: item.published_at || new Date().toISOString(),
                        status: item.status,
                        view_count: item.view_count || 0,
                        tags: item.tags || []
                    };
                });
                setArticles(formatted);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchArticles(); }, [fetchArticles]);

    const filteredArticles = useMemo(() => {
        return articles.filter(item => {
            const matchesFilter = filter === "Semua" || item.category === filter;
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [filter, searchQuery, articles]);

    const paginatedArticles = filteredArticles.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setActivePage(newPage);
            const gridElement = document.getElementById("article-grid");
            if (gridElement) {
                const yOffset = -150;
                const y = gridElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    return (
        <main className="min-h-screen bg-white text-slate-900 relative selection:bg-indigo-100 selection:text-indigo-700 font-sans">

            {/* Sticky WA Button */}
            <a href="https://wa.me/6285236110219" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-2xl hover:bg-[#20bd5a] hover:-translate-y-1 transition-all group font-bold border-2 border-white">
                <MessageCircle size={24} className="fill-white text-[#25D366]" />
                <span className="hidden md:inline group-hover:inline transition-all duration-300">Butuh Responden?</span>
            </a>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-28 pb-16 md:pt-40 md:pb-28 px-4 sm:px-6 overflow-hidden bg-white border-b border-slate-100">
                <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/70 via-white to-transparent -z-10"></div>

                <div className="container mx-auto max-w-[1600px] flex flex-col items-center justify-center text-center px-4 lg:px-20">

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-indigo-700 font-bold text-xs md:text-sm uppercase tracking-[0.15em] mb-8 shadow-sm"
                    >
                        <LineChart size={14} className="fill-indigo-500 text-indigo-500 animate-pulse" />
                        <span>Pusat Riset & Data</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl xl:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter"
                    >
                        EduAssist <br className="hidden md:block" />
                        <span className="text-indigo-600 relative inline-block mx-2">
                            Knowledge Base
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
                        Kumpulan wawasan strategis untuk mahasiswa, dosen, & pebisnis dalam mengolah data riset yang valid dan reliabel.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="w-full max-w-2xl mx-auto space-y-6"
                    >
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={22} />
                            <input
                                type="text"
                                placeholder="Cari topik riset (contoh: validitas, spss)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xl shadow-slate-200/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm md:text-base font-bold placeholder:font-medium placeholder:text-slate-400"
                            />
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => { setFilter(cat); setActivePage(1); }}
                                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all border ${filter === cat ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200" : "bg-white border-slate-200 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-sm"}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="py-20 px-4 bg-[#F8FAFC]">
                <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between mb-8" id="article-grid">
                        <h2 className="text-xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
                            {filter === "Semua" ? <Sparkles size={28} className="text-amber-500" /> : <BookOpen size={28} className="text-indigo-600" />}
                            {filter === "Semua" ? "Insight Terbaru" : `Topik: ${filter}`}
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-40">
                            <div className="animate-spin w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full mb-6"></div>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Sedang memuat data...</p>
                        </div>
                    ) : paginatedArticles.length > 0 ? (
                        <>
                            {/* GRID SYSTEM */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                                {paginatedArticles.map((article, index) => (
                                    <div key={article.id} className="contents">
                                        <article className="group bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">

                                            <div className="relative h-48 bg-slate-100 overflow-hidden">
                                                {article.visual_type === 'video' ? (
                                                    <>
                                                        <img src={article.cover_image || ""} alt={article.title} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
                                                            <PlayCircle className="text-white w-14 h-14 drop-shadow-lg group-hover:scale-110 transition-transform" />
                                                        </div>
                                                    </>
                                                ) : article.cover_image ? (
                                                    <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                                                        <BookOpen size={64} />
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm border border-indigo-50">
                                                        {article.badge}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">
                                                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{article.category}</span>
                                                    <span>• {new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: '2-digit' })}</span>
                                                </div>

                                                {/* UPDATE: LINK MENGGUNAKAN SLUG */}
                                                <Link href={`/artikel/${article.slug || article.id}`}>
                                                    <h3 className="text-lg md:text-xl font-black text-slate-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
                                                        {article.title}
                                                    </h3>
                                                </Link>

                                                <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed font-medium">
                                                    {article.excerpt}
                                                </p>

                                                <div className="pt-5 border-t border-slate-50 flex items-center justify-between text-xs font-bold">
                                                    <span className="text-slate-400 flex items-center gap-2 truncate max-w-[60%]"><Users size={16} className="text-indigo-400" /> {article.author}</span>
                                                    {/* UPDATE: LINK BACA SELENGKAPNYA MENGGUNAKAN SLUG */}
                                                    <Link href={`/artikel/${article.slug || article.id}`} className="text-indigo-600 hover:underline uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform whitespace-nowrap">Baca &rarr;</Link>
                                                </div>
                                            </div>
                                        </article>

                                        {/* CTA BANNER */}
                                        {index === 2 && activePage === 1 && (
                                            <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl group cursor-pointer hover:scale-[1.01] transition-transform flex flex-col justify-center min-h-[300px]">
                                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
                                                <div className="relative z-10 flex flex-col items-start justify-center gap-6 h-full">
                                                    <div>
                                                        <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Promo Terbatas</div>
                                                        <h3 className="text-3xl font-black mb-3 tracking-tight leading-none">Riset Macet?</h3>
                                                        <p className="text-indigo-100 text-base font-medium leading-relaxed max-w-xs">
                                                            Kami sediakan responden valid &lt; 3 hari. Garansi 100% uang kembali.
                                                        </p>
                                                    </div>
                                                    <Link href="/layanan" className="bg-white text-indigo-700 px-8 py-4 rounded-xl font-black text-sm hover:bg-amber-400 hover:text-slate-900 transition-all shadow-lg whitespace-nowrap active:scale-95 mt-auto w-full text-center sm:w-auto">
                                                        Cek Harga Layanan
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* PAGINATION */}
                            {totalPages > 1 && (
                                <div className="mt-20 flex justify-center items-center gap-3">
                                    <button
                                        onClick={() => handlePageChange(activePage - 1)}
                                        disabled={activePage === 1}
                                        className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-12 h-12 rounded-xl font-black text-sm transition-all ${activePage === page
                                                ? "bg-slate-900 text-white shadow-xl scale-110"
                                                : "bg-white border border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(activePage + 1)}
                                        disabled={activePage === totalPages}
                                        className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
                            <BookOpen size={80} className="mx-auto text-slate-200 mb-6" />
                            <h3 className="text-3xl font-black text-slate-800 mb-3">Belum ada artikel</h3>
                            <p className="text-slate-500 mb-8 text-lg">Coba cari topik lain atau kembali lagi nanti.</p>
                            <button onClick={() => { setFilter("Semua"); setSearchQuery(""); }} className="text-indigo-600 font-bold hover:underline uppercase tracking-wider text-base">
                                Lihat Semua Artikel
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default function ArtikelPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <ArtikelContent />
        </Suspense>
    );
}