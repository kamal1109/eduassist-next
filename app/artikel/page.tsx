"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, ArrowRight, Users,
    Sparkles, MessageCircle, PlayCircle,
    ChevronLeft, ChevronRight, Search, X, Eye,
    GraduationCap, Bookmark, ShoppingBag, Filter, Loader2
} from "lucide-react";
import Link from "next/link";
import { supabase } from '@/lib/supabase';
import { useSearchParams, useRouter } from "next/navigation";

// Type untuk artikel
interface Article {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    badge: string;
    visual_type: 'icon' | 'image' | 'video';
    cover_image?: string;
    visual_value?: string;
    published_at: string;
    status: string;
    view_count: number;
    content?: string;
    seo_description?: string;
    tags?: string[];
}

export default function ArtikelPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialFilter = searchParams.get('category') || "Semua";
    const initialSearch = searchParams.get('search') || "";
    const initialTag = searchParams.get('tag') || "";

    const [filter, setFilter] = useState(initialFilter);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [activePage, setActivePage] = useState(1);
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalViews, setTotalViews] = useState(0);
    const [stats, setStats] = useState({
        totalArticles: 0,
        totalCategories: 0,
        latestArticleDate: ""
    });
    const itemsPerPage = 8;

    const categories = ["Semua", "Responden", "SPSS", "Kuesioner", "Validitas", "Analisis", "Metodologi"];

    // Fetch data dari Supabase
    const fetchArticles = useCallback(async () => {
        setIsLoading(true);
        try {
            let query = supabase
                .from('articles')
                .select('*')
                .eq('status', 'published')
                .order('published_at', { ascending: false });

            // Filter berdasarkan tag jika ada
            if (initialTag) {
                query = query.contains('tags', [initialTag]);
            }

            const { data: articlesData, error: articlesError, count } = await query;

            if (articlesError) {
                console.error('Error fetching articles:', articlesError);
                throw articlesError;
            }

            if (articlesData && articlesData.length > 0) {
                // Format data dari Supabase
                const formattedData: Article[] = articlesData.map(article => ({
                    id: article.id,
                    title: article.title || "Judul Artikel",
                    excerpt: article.excerpt ||
                        article.content?.substring(0, 150) + "..." ||
                        article.seo_description ||
                        "Artikel bermanfaat untuk penelitian Anda...",
                    category: article.category || "Umum",
                    author: article.author || "Tim EduAssist",
                    badge: article.badge || getBadgeFromCategory(article.category),
                    visual_type: article.visual_type || (article.cover_image ? 'image' : 'icon'),
                    cover_image: article.cover_image,
                    visual_value: article.visual_value,
                    published_at: article.published_at || new Date().toISOString(),
                    status: article.status || 'published',
                    view_count: article.view_count || 0,
                    content: article.content,
                    seo_description: article.seo_description,
                    tags: article.tags || []
                }));

                setArticles(formattedData);

                // Hitung total views
                const total = formattedData.reduce((sum, article) => sum + article.view_count, 0);
                setTotalViews(total);

                // Hitung statistik
                const uniqueCategories = new Set(formattedData.map(article => article.category));
                const latestDate = formattedData[0]?.published_at || "";

                setStats({
                    totalArticles: count || formattedData.length,
                    totalCategories: uniqueCategories.size,
                    latestArticleDate: latestDate
                });

            } else {
                // Jika belum ada data, gunakan dummy
                console.log('No articles found in database, using sample data');
                const dummyData = getDummyArticles();
                setArticles(dummyData);
                const total = dummyData.reduce((sum, article) => sum + article.view_count, 0);
                setTotalViews(total);

                setStats({
                    totalArticles: dummyData.length,
                    totalCategories: 4,
                    latestArticleDate: dummyData[0]?.published_at || ""
                });
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            const dummyData = getDummyArticles();
            setArticles(dummyData);
            const total = dummyData.reduce((sum, article) => sum + article.view_count, 0);
            setTotalViews(total);

            setStats({
                totalArticles: dummyData.length,
                totalCategories: 4,
                latestArticleDate: dummyData[0]?.published_at || ""
            });
        } finally {
            setIsLoading(false);
        }
    }, [initialTag]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    // Update URL ketika filter/search berubah
    useEffect(() => {
        const params = new URLSearchParams();
        if (filter !== "Semua") params.set('category', filter);
        if (searchQuery) params.set('search', searchQuery);
        if (initialTag) params.set('tag', initialTag);

        const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
        window.history.replaceState({}, '', newUrl);
    }, [filter, searchQuery, initialTag]);

    // Helper function untuk menentukan badge berdasarkan kategori
    const getBadgeFromCategory = (category: string): string => {
        const badgeMap: Record<string, string> = {
            'SPSS': 'Tutorial',
            'Validitas': 'Panduan',
            'Responden': 'Tips',
            'Kuesioner': 'Desain',
            'Analisis': 'Statistik',
            'Metodologi': 'Metode',
            'default': 'Artikel'
        };
        return badgeMap[category] || badgeMap['default'];
    };

    // Fungsi untuk update view count ketika artikel dibuka
    const incrementViewCount = async (articleId: string) => {
        try {
            // Dapatkan view count saat ini
            const { data: currentArticle } = await supabase
                .from('articles')
                .select('view_count')
                .eq('id', articleId)
                .single();

            if (currentArticle) {
                // Update view count
                await supabase
                    .from('articles')
                    .update({
                        view_count: currentArticle.view_count + 1,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', articleId);
            }
        } catch (error) {
            console.error('Error updating view count:', error);
        }
    };

    // Data artikel contoh (fallback)
    const getDummyArticles = (): Article[] => [
        {
            id: "1",
            title: "Cara Validasi Data Kuesioner untuk Skripsi",
            excerpt: "Panduan lengkap untuk menguji validitas dan reliabilitas data kuesioner Anda sebelum masuk ke tahap analisis SPSS.",
            category: "Validitas",
            author: "Tim EduAssist",
            badge: "Panduan",
            visual_type: 'icon',
            published_at: new Date().toISOString(),
            status: 'published',
            view_count: 1245,
            tags: ["validitas", "reliabilitas", "kuesioner"]
        },
        {
            id: "2",
            title: "Tips Menemukan Responden yang Tepat",
            excerpt: "Strategi efektif untuk mendapatkan responden yang sesuai dengan kriteria penelitian dalam waktu singkat.",
            category: "Responden",
            author: "Tim EduAssist",
            badge: "Tips",
            visual_type: 'icon',
            published_at: new Date().toISOString(),
            status: 'published',
            view_count: 987,
            tags: ["responden", "sampling", "populasi"]
        },
        {
            id: "3",
            title: "Analisis Regresi di SPSS untuk Pemula",
            excerpt: "Step-by-step tutorial melakukan analisis regresi linear dengan output yang siap untuk laporan penelitian.",
            category: "SPSS",
            author: "Tim EduAssist",
            badge: "Tutorial",
            visual_type: 'icon',
            published_at: new Date().toISOString(),
            status: 'published',
            view_count: 2156,
            tags: ["spss", "regresi", "analisis"]
        },
        {
            id: "4",
            title: "Desain Kuesioner yang Efektif",
            excerpt: "Rahasia membuat pertanyaan kuesioner yang tidak membuat responden jenuh namun tetap menghasilkan data berkualitas.",
            category: "Kuesioner",
            author: "Tim EduAssist",
            badge: "Desain",
            visual_type: 'icon',
            published_at: new Date().toISOString(),
            status: 'published',
            view_count: 743,
            tags: ["kuesioner", "desain", "pertanyaan"]
        },
        {
            id: "5",
            title: "Uji Normalitas Data dengan SPSS",
            excerpt: "Metode terbaik untuk menguji distribusi normal data penelitian Anda sebelum melakukan uji hipotesis.",
            category: "SPSS",
            author: "Tim EduAssist",
            badge: "Statistik",
            visual_type: 'icon',
            published_at: new Date().toISOString(),
            status: 'published',
            view_count: 1892,
            tags: ["spss", "normalitas", "statistik"]
        },
        {
            id: "6",
            title: "Mengatasi Missing Data dalam Penelitian",
            excerpt: "Teknik-teknik canggih untuk menangani data yang hilang tanpa mengurangi validitas hasil penelitian.",
            category: "Validitas",
            author: "Tim EduAssist",
            badge: "Solusi",
            visual_type: 'icon',
            published_at: new Date().toISOString(),
            status: 'published',
            view_count: 632,
            tags: ["data", "missing", "validitas"]
        },
        {
            id: "7",
            title: "Cara Menentukan Jumlah Responden",
            excerpt: "Rumus Slovin dan metode sampling lainnya untuk menentukan jumlah responden yang ideal untuk penelitian Anda.",
            category: "Responden",
            author: "Tim EduAssist",
            badge: "Formula",
            visual_type: 'icon',
            published_at: new Date().toISOString(),
            status: 'published',
            view_count: 1105,
            tags: ["responden", "sampling", "rumus"]
        },
        {
            id: "8",
            title: "Interpretasi Output SPSS untuk Sidang",
            excerpt: "Cara membaca dan mempresentasikan hasil analisis SPSS dengan bahasa yang mudah dipahami dosen penguji.",
            category: "SPSS",
            author: "Tim EduAssist",
            badge: "Presentasi",
            visual_type: 'icon',
            published_at: new Date().toISOString(),
            status: 'published',
            view_count: 1743,
            tags: ["spss", "presentasi", "sidang"]
        }
    ];

    // Logika Filter & Search
    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const matchesFilter = filter === "Semua" || article.category === filter;
            const matchesSearch =
                (article.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (article.excerpt?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (article.category?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (article.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) || false);
            return matchesFilter && matchesSearch;
        });
    }, [filter, searchQuery, articles]);

    // Logika Pagination
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    const paginatedArticles = filteredArticles.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );

    // Reset page ketika filter/search berubah
    useEffect(() => {
        setActivePage(1);
    }, [filter, searchQuery]);

    // Format tanggal
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "Baru saja";
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return "Baru saja";
        }
    };

    // Fungsi untuk menangani klik artikel (update view count)
    const handleArticleClick = async (articleId: string) => {
        await incrementViewCount(articleId);
    };

    // Fungsi untuk render visual content
    const renderVisualContent = (article: Article) => {
        if (article.visual_type === 'video' && article.visual_value) {
            return (
                <div className="relative h-full">
                    <img
                        src={`https://img.youtube.com/vi/${article.visual_value}/hqdefault.jpg`}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-video.jpg';
                        }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl text-red-600">
                            <PlayCircle size={32} className="fill-current" />
                        </div>
                    </div>
                </div>
            );
        } else if (article.visual_type === 'image' && article.cover_image) {
            return (
                <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center text-indigo-600 bg-gradient-to-br from-indigo-50 to-blue-50">
                                <Bookmark size={48} strokeWidth={1.5} />
                            </div>
                        `;
                    }}
                />
            );
        } else {
            return (
                <div className="w-full h-full flex items-center justify-center text-indigo-600 bg-gradient-to-br from-indigo-50 to-blue-50 group-hover:scale-110 transition-transform duration-500">
                    <Bookmark size={48} strokeWidth={1.5} />
                </div>
            );
        }
    };

    // Clear tag filter
    const clearTagFilter = () => {
        router.push('/artikel');
    };

    return (
        <main className="bg-[#F8FAFC] text-slate-900 overflow-x-hidden min-h-screen selection:bg-indigo-100 selection:text-indigo-700">

            {/* --- HERO SECTION --- */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-6 overflow-hidden bg-white">
                <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/70 via-white to-transparent -z-10"></div>

                <div className="container mx-auto max-w-6xl flex flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full text-indigo-700 font-bold text-xs md:text-sm uppercase tracking-[0.15em] mb-8 shadow-sm"
                    >
                        <Sparkles size={16} className="fill-indigo-500 text-indigo-500 animate-pulse" />
                        Knowledge Hub & Tutorial
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight text-center"
                    >
                        Panduan Akademik <br />
                        <span className="text-indigo-600 relative inline-block text-center">
                            Teruji
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                            </svg>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-base md:text-xl lg:text-2xl max-w-3xl mx-auto mb-10 md:mb-14 font-medium leading-relaxed text-center"
                    >
                        Disusun untuk membantu <span className="text-slate-900 font-bold">12.000+ mahasiswa</span> lolos sidang <span className="text-indigo-600 underline decoration-indigo-400 font-bold underline-offset-8">tanpa revisi berulang.</span>
                    </motion.p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                        <Link
                            href="https://wa.me/6285236110219"
                            target="_blank"
                            className="w-full sm:w-auto bg-slate-900 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200 active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            Konsultasi via WhatsApp <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
                        </Link>
                        <Link
                            href="https://id.shp.ee/RoYtQCu"
                            target="_blank"
                            className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-lg hover:border-indigo-400 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3"
                        >
                            Lihat Tutorial di Shopee <ShoppingBag size={22} className="text-orange-500" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- STATS SECTION --- */}
            <section className="py-20 bg-slate-100/50 border-y border-slate-200/60">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-lg shadow-slate-200/20 text-center hover:shadow-2xl hover:border-indigo-200 transition-all"
                        >
                            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Users size={28} className="text-indigo-600" />
                            </div>
                            <div className="text-5xl md:text-6xl font-black text-slate-900 mb-2 leading-none">
                                {totalViews.toLocaleString()}+
                            </div>
                            <div className="text-slate-500 font-bold uppercase tracking-[0.15em] text-sm">Total Pembaca Artikel</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            whileHover={{ y: -5 }}
                            className="bg-slate-950 p-10 rounded-[3rem] border border-slate-800 shadow-lg shadow-slate-900/20 text-center hover:shadow-2xl hover:border-indigo-500 transition-all text-white"
                        >
                            <div className="w-20 h-20 bg-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <GraduationCap size={28} className="text-indigo-300" />
                            </div>
                            <div className="text-5xl md:text-6xl font-black mb-2 leading-none">
                                {stats.totalArticles}+
                            </div>
                            <div className="text-indigo-200 font-bold uppercase tracking-[0.15em] text-sm">Artikel Tersedia</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-lg shadow-slate-200/20 text-center hover:shadow-2xl hover:border-indigo-200 transition-all"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Filter size={28} className="text-purple-600" />
                            </div>
                            <div className="text-5xl md:text-6xl font-black text-slate-900 mb-2 leading-none">
                                {stats.totalCategories}+
                            </div>
                            <div className="text-slate-500 font-bold uppercase tracking-[0.15em] text-sm">Kategori</div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- TAG FILTER (jika ada) --- */}
            {initialTag && (
                <div className="container mx-auto px-6 max-w-7xl pt-8">
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <Bookmark size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Filter Aktif</p>
                                <p className="text-slate-900 font-bold">Tag: <span className="text-indigo-600">#{initialTag}</span></p>
                            </div>
                        </div>
                        <button
                            onClick={clearTagFilter}
                            className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-full font-bold hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
                        >
                            <X size={16} />
                            Hapus Filter
                        </button>
                    </div>
                </div>
            )}

            {/* --- SEARCH & FILTER SECTION --- */}
            <section className="py-12 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Search Bar */}
                        <div className="relative w-full lg:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Cari topik (SPSS, Validitas, Responden)..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                }}
                                className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white border border-slate-200/60 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium text-slate-700 shadow-sm hover:shadow-md"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Filter Categories */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.1em] transition-all ${filter === cat
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
                                        : "bg-white text-slate-500 border border-slate-200/60 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Result Counter */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Menampilkan <span className="text-indigo-600 font-bold">{filteredArticles.length}</span> artikel
                            {filter !== "Semua" && ` dalam kategori "${filter}"`}
                            {searchQuery && ` untuk pencarian "${searchQuery}"`}
                            {initialTag && ` dengan tag "${initialTag}"`}
                        </p>
                    </div>
                </div>
            </section>

            {/* --- ARTICLES GRID --- */}
            <section className="container mx-auto px-6 py-20 max-w-7xl">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-40"
                        >
                            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Menyelaraskan Pengetahuan...</p>
                        </motion.div>
                    ) : paginatedArticles.length > 0 ? (
                        <motion.div
                            key={filter + searchQuery + activePage + initialTag}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {paginatedArticles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/artikel/${article.id}`}
                                    onClick={() => handleArticleClick(article.id)}
                                    className="group bg-white border border-slate-200/60 p-6 rounded-[2.5rem] hover:shadow-2xl hover:shadow-indigo-200/20 hover:border-indigo-200 transition-all flex flex-col relative overflow-hidden"
                                >
                                    {/* Badge */}
                                    <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-black text-indigo-600 shadow-sm uppercase tracking-[0.1em] border border-indigo-100">
                                        {article.badge || 'Terbaru'}
                                    </div>

                                    {/* View Count */}
                                    <div className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                        <Eye size={12} /> {article.view_count.toLocaleString()}
                                    </div>

                                    {/* Image/Icon */}
                                    <div className="aspect-[4/3] rounded-[2rem] mb-6 flex items-center justify-center overflow-hidden relative shadow-inner bg-gradient-to-br from-indigo-50 to-blue-50 group-hover:from-indigo-100 group-hover:to-blue-100 transition-colors">
                                        {renderVisualContent(article)}
                                    </div>

                                    {/* Category & Time */}
                                    <div className="flex justify-between items-center mb-4 px-1">
                                        <span className="text-xs font-black px-3 py-1.5 rounded-full uppercase bg-indigo-50 text-indigo-700 tracking-[0.1em]">
                                            {article.category}
                                        </span>
                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-[0.1em] flex items-center gap-1">
                                            <Calendar size={12} /> {formatDate(article.published_at)}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-black text-slate-900 text-xl mb-3 leading-tight group-hover:text-indigo-600 transition-colors px-1 line-clamp-2">
                                        {article.title}
                                    </h3>

                                    {/* Excerpt */}
                                    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3 font-medium px-1">
                                        {article.excerpt}
                                    </p>

                                    {/* Tags */}
                                    {article.tags && article.tags.length > 0 && (
                                        <div className="mb-4 px-1">
                                            <div className="flex flex-wrap gap-1">
                                                {article.tags.slice(0, 3).map((tag, index) => (
                                                    <span key={index} className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                                        #{tag}
                                                    </span>
                                                ))}
                                                {article.tags.length > 3 && (
                                                    <span className="text-[10px] text-slate-400">+{article.tags.length - 3}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Author & Arrow */}
                                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-100 px-1">
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200 italic font-black text-xs">
                                            {article.author?.charAt(0) || 'E'}
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">
                                            {article.author || 'Tim EduAssist'}
                                        </span>
                                        <ArrowRight size={16} className="ml-auto text-indigo-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 bg-white rounded-[4rem] border-2 border-dashed border-slate-200/60"
                        >
                            <Search size={48} className="mx-auto text-slate-200 mb-6" />
                            <h3 className="text-2xl font-black text-slate-900 mb-3">Topik tidak ditemukan</h3>
                            <p className="text-slate-500 text-lg mt-2 font-medium max-w-md mx-auto">
                                {searchQuery
                                    ? `Tidak ada artikel yang cocok dengan "${searchQuery}"`
                                    : filter !== "Semua"
                                        ? `Tidak ada artikel dalam kategori "${filter}"`
                                        : "Belum ada artikel yang tersedia"}
                            </p>
                            <div className="mt-6 flex gap-3 justify-center">
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-full font-bold text-sm hover:bg-indigo-100 transition-colors"
                                >
                                    Reset Pencarian
                                </button>
                                <button
                                    onClick={() => setFilter("Semua")}
                                    className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-full font-bold text-sm hover:bg-slate-50 transition-colors"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- PAGINATION --- */}
                {totalPages > 1 && filteredArticles.length > 0 && (
                    <div className="mt-20 flex justify-center items-center gap-3">
                        <button
                            onClick={() => setActivePage(prev => Math.max(prev - 1, 1))}
                            disabled={activePage === 1}
                            className="p-4 rounded-2xl bg-white border border-slate-200/60 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-30 transition-all shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {[...Array(totalPages)].map((_, i) => {
                            // Logic untuk pagination dengan ellipsis
                            const pageNumber = i + 1;
                            const showPage =
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                Math.abs(pageNumber - activePage) <= 1;

                            if (!showPage) {
                                if (i === 1 || i === totalPages - 2) {
                                    return (
                                        <span key={i} className="text-slate-400 px-2">
                                            ...
                                        </span>
                                    );
                                }
                                return null;
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => setActivePage(pageNumber)}
                                    className={`w-14 h-14 rounded-2xl font-black text-sm transition-all shadow-sm ${activePage === pageNumber
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                                        : 'bg-white text-slate-400 border border-slate-200/60 hover:border-indigo-300 hover:text-indigo-600'
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setActivePage(prev => Math.min(prev + 1, totalPages))}
                            disabled={activePage === totalPages}
                            className="p-4 rounded-2xl bg-white border border-slate-200/60 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
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
                        Mulai Riset Anda <br className="hidden md:block" />
                        <span className="text-indigo-600">Hari Ini?</span>
                    </motion.h2>

                    <Link
                        href="https://wa.me/6285236110219"
                        target="_blank"
                        className="inline-flex items-center gap-4 bg-indigo-600 text-white px-10 md:px-16 py-5 md:py-7 rounded-[2rem] font-black text-xl md:text-2xl shadow-xl hover:bg-slate-900 transition-all hover:scale-105 active:scale-95 group"
                    >
                        Mulai Konsultasi Sekarang
                        <MessageCircle size={28} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <p className="mt-8 text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">Fast Response • 24/7 Support • Garansi Kepuasan</p>
                </div>
            </footer>
        </main>
    );
}