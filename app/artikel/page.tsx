"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { Search, Sparkles, BookOpen, MessageCircle, LineChart, Users, PlayCircle, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Import aman
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// --- TYPE DEFINITION ---
interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
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

// --- KOMPONEN KONTEN UTAMA ---
function ArtikelContent() {
    const searchParams = useSearchParams();
    const initialFilter = searchParams.get('category') || "Semua";
    const initialSearch = searchParams.get('search') || "";
    const initialTag = searchParams.get('tag') || "";

    const [filter, setFilter] = useState(initialFilter);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [activePage, setActivePage] = useState(1);
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 9;

    const categories = [
        "Semua", "Edukasi Umum", "Mahasiswa", "Dosen & Peneliti",
        "Bisnis & UMKM", "Studi Kasus", "Teknis & Metode", "Info Jasa"
    ];

    // Helper: Mapping Badge sesuai Kategori
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

    // --- FETCH DATA ---
    const fetchArticles = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Query Supabase
            let query = supabase
                .from('articles')
                .select('*')
                .eq('status', 'Published')
                .order('published_at', { ascending: false });

            if (initialTag) {
                // Catatan: Pastikan kolom 'tags' di database bertipe array
                // query = query.contains('tags', [initialTag]);
            }

            const { data, error } = await query;
            if (error) throw error;

            if (data) {
                // 2. Formatting Data
                const formatted: Article[] = data.map(item => {
                    let finalImageUrl = "";

                    if (item.visual_type === 'video' && item.visual_value) {
                        // Jika Video -> Ambil Thumbnail YouTube
                        finalImageUrl = `https://img.youtube.com/vi/${item.visual_value}/hqdefault.jpg`;
                    } else if (item.visual_type === 'image') {
                        // Jika Image -> Prioritaskan cover_image, lalu visual_value
                        finalImageUrl = item.cover_image || item.visual_value || "";
                    }

                    return {
                        id: item.id,
                        title: item.title || "Judul Artikel",
                        slug: item.slug || item.id,
                        excerpt: item.excerpt || (item.content ? item.content.substring(0, 120) + "..." : ""),
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
    }, [initialTag]);

    useEffect(() => { fetchArticles(); }, [fetchArticles]);

    // --- FILTERING LOGIC ---
    const filteredArticles = useMemo(() => {
        return articles.filter(item => {
            const matchesFilter = filter === "Semua" || item.category === filter;
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [filter, searchQuery, articles]);

    // Pagination Logic
    const paginatedArticles = filteredArticles.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

    return (
        <main className="min-h-screen bg-white text-slate-900 relative">

            {/* Sticky WA Button */}
            <a href="https://wa.me/628123456789" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-2xl hover:bg-[#20bd5a] hover:-translate-y-1 transition-all group font-bold border-2 border-white">
                <MessageCircle size={24} className="fill-white text-[#25D366]" />
                <span className="hidden md:inline group-hover:inline transition-all duration-300">Butuh Responden?</span>
            </a>

            {/* HEADER */}
            <section className="pt-32 pb-10 px-4 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                                <LineChart size={14} /> Pusat Riset & Data
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
                                EduAssist <span className="text-blue-600">Knowledge Base</span>
                            </h1>
                            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
                                Kumpulan wawasan strategis untuk <span className="font-bold text-slate-700">Mahasiswa, Dosen, & Pebisnis</span> dalam mengolah data riset yang valid.
                            </p>
                        </div>
                        <div className="w-full md:w-80 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Cari topik riset..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-slate-200 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    {/* Filter Categories */}
                    <div className="flex flex-wrap gap-2 pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => { setFilter(cat); setActivePage(1); }}
                                className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all border ${filter === cat ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600"}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            {filter === "Semua" ? <Sparkles size={20} className="text-amber-500" /> : <BookOpen size={20} className="text-blue-600" />}
                            {filter === "Semua" ? "Insight Terbaru" : `Topik: ${filter}`}
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                            <p className="text-slate-400 font-bold text-sm">Sedang mengambil data...</p>
                        </div>
                    ) : paginatedArticles.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {paginatedArticles.map((article, index) => (
                                    <div key={article.id} className="contents">
                                        {/* ARTIKEL CARD */}
                                        <article className="group bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">

                                            {/* Header Visual */}
                                            <div className="relative h-48 bg-slate-100 overflow-hidden">
                                                {article.visual_type === 'video' ? (
                                                    <>
                                                        <img src={article.cover_image || ""} alt={article.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
                                                            <PlayCircle className="text-white w-12 h-12 drop-shadow-lg" />
                                                        </div>
                                                    </>
                                                ) : article.cover_image ? (
                                                    <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                                                        <BookOpen size={48} />
                                                    </div>
                                                )}

                                                {/* Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                                                        {article.badge}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-3">
                                                    <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{article.category}</span>
                                                    <span>• {new Date(article.published_at).toLocaleDateString('id-ID')}</span>
                                                </div>

                                                <Link href={`/artikel/${article.id}`}>
                                                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                        {article.title}
                                                    </h3>
                                                </Link>

                                                <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
                                                    {article.excerpt}
                                                </p>

                                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold">
                                                    <span className="text-slate-400 flex items-center gap-1"><Users size={12} /> {article.author}</span>
                                                    <Link href={`/artikel/${article.id}`} className="text-blue-600 hover:underline uppercase tracking-wider">Baca &rarr;</Link>
                                                </div>
                                            </div>
                                        </article>

                                        {/* CTA BANNER LOGIC (Muncul setelah artikel ke-3) */}
                                        {index === 2 && activePage === 1 && (
                                            <div className="md:col-span-2 lg:col-span-3 my-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl">
                                                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                                                    <div>
                                                        <h3 className="text-2xl font-black mb-2">Riset Bisnis Macet Karena Data?</h3>
                                                        <p className="text-blue-100 max-w-xl text-sm md:text-base">
                                                            Jangan biarkan bisnis atau skripsi Anda terhambat. Kami menyediakan responden valid dalam waktu &lt; 3 hari.
                                                        </p>
                                                    </div>
                                                    <a href="/layanan" className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-amber-400 hover:text-slate-900 transition-all shadow-lg whitespace-nowrap">
                                                        Lihat Layanan Kami
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-16 flex justify-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setActivePage(page)}
                                            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${activePage === page ? "bg-slate-900 text-white shadow-md" : "bg-white border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600"}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
                            <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-700">Belum ada artikel di topik ini</h3>
                            <button onClick={() => { setFilter("Semua"); setSearchQuery(""); }} className="text-blue-600 font-bold hover:underline mt-2">
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