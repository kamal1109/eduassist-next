"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
    Calendar, ArrowLeft, UserCircle, Clock, Share2, MessageCircle,
    PlayCircle, Sparkles, ChevronRight, Check, ThumbsUp,
    Bookmark, MessageSquare, ArrowRight, Eye, Home, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';

// Type untuk artikel
interface Article {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    visual_type: 'image' | 'video' | 'icon';
    visual_value: string;
    cover_image?: string;
    published_at: string;
    status: string;
    view_count: number;
    tags?: string[];
    badge?: string;
    seo_description?: string;
}

export default function DetailArtikel() {
    const params = useParams();
    const router = useRouter();
    const [article, setArticle] = useState<Article | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isNotFound, setIsNotFound] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [contentError, setContentError] = useState(false);

    // 1. FITUR: Reading Progress Bar
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const fetchArticleData = async () => {
            // Cek apakah ada ID
            if (!params || !params.id) {
                console.error('❌ No article ID provided in params:', params);
                setIsNotFound(true);
                setIsLoading(false);
                return;
            }

            const articleId = params.id as string;
            console.log('🔍 Fetching article with ID:', articleId);

            try {
                setIsLoading(true);
                setIsNotFound(false);
                setErrorMessage(null);
                setContentError(false);

                // ✅ PERBAIKAN: Fetch artikel utama
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('id', articleId)
                    .single();

                if (error) {
                    console.error('❌ Error fetching article:', error);
                    setErrorMessage(error.message);
                    setIsNotFound(true);
                    setIsLoading(false);
                    return;
                }

                if (!data) {
                    console.log('⚠️ No article data found');
                    setIsNotFound(true);
                    setIsLoading(false);
                    return;
                }

                console.log('✅ Article data received:', data);

                // Format data artikel
                const formattedArticle: Article = {
                    id: data.id || '',
                    title: data.title || "Judul Artikel Tidak Tersedia",
                    excerpt: data.excerpt || data.content?.substring(0, 200) + "..." || "Artikel informatif untuk penelitian Anda...",
                    content: data.content || "<p>Konten artikel sedang dalam proses penyusunan.</p>",
                    category: data.category || "Umum",
                    author: data.author || "Tim EduAssist",
                    visual_type: data.visual_type || (data.cover_image ? 'image' : 'icon'),
                    visual_value: data.visual_value || data.cover_image || '',
                    cover_image: data.cover_image,
                    published_at: data.published_at || new Date().toISOString(),
                    status: data.status || 'published',
                    view_count: data.view_count || 0,
                    tags: data.tags || [],
                    badge: data.badge || 'Artikel',
                    seo_description: data.seo_description
                };

                setArticle(formattedArticle);
                document.title = `${formattedArticle.title} | EduAssist`;

                // ✅ PERBAIKAN: Validasi konten HTML
                if (!formattedArticle.content || formattedArticle.content.trim() === '') {
                    setContentError(true);
                    formattedArticle.content = `
                        <div class="text-center p-8 bg-slate-50 rounded-xl">
                            <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 class="text-lg font-bold text-slate-700 mb-2">Konten Sedang Disiapkan</h3>
                            <p class="text-slate-500">Konten artikel ini sedang dalam proses penyusunan. Silakan kembali nanti.</p>
                        </div>
                    `;
                }

                // ✅ PERBAIKAN: Update view count (async, tidak blocking)
                const updateViewCount = async () => {
                    try {
                        await supabase
                            .from('articles')
                            .update({
                                view_count: (data.view_count || 0) + 1,
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', articleId);
                        console.log('📈 View count updated');
                    } catch (updateError) {
                        console.error('Failed to update view count:', updateError);
                    }
                };
                updateViewCount();

                // ✅ PERBAIKAN: Fetch artikel terkait
                const category = formattedArticle.category || 'Umum';
                const { data: relatedData, error: relatedError } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('category', category)
                    .neq('id', articleId)
                    .eq('status', 'published')
                    .limit(3)
                    .order('published_at', { ascending: false });

                if (relatedError) {
                    console.error('Error fetching related articles:', relatedError);
                } else if (relatedData && relatedData.length > 0) {
                    const formattedRelated = relatedData.map(item => ({
                        id: item.id || '',
                        title: item.title || "Artikel Terkait",
                        excerpt: item.excerpt || item.content?.substring(0, 150) + "..." || "Baca artikel terkait...",
                        content: item.content || "",
                        category: item.category || "Umum",
                        author: item.author || "Tim EduAssist",
                        visual_type: item.visual_type || 'icon',
                        visual_value: item.visual_value || item.cover_image || '',
                        cover_image: item.cover_image,
                        published_at: item.published_at || new Date().toISOString(),
                        status: item.status || 'published',
                        view_count: item.view_count || 0,
                        tags: item.tags || [],
                        badge: item.badge || 'Artikel'
                    }));
                    setRelatedArticles(formattedRelated);
                }

            } catch (error: any) {
                console.error('💥 Unexpected error:', error);
                setErrorMessage(error.message || 'Terjadi kesalahan tidak terduga');
                setIsNotFound(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticleData();
    }, [params]);

    // Hitung waktu baca
    const readingTime = useMemo(() => {
        if (!article?.content) return 1;
        try {
            const cleanContent = article.content.replace(/<[^>]*>?/gm, '');
            const words = cleanContent.split(/\s+/).filter(word => word.length > 0).length;
            return Math.max(1, Math.ceil(words / 200));
        } catch {
            return 3;
        }
    }, [article]);

    // Format tanggal
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "Baru saja";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return "Baru saja";

            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return "Baru saja";
        }
    };

    // Fungsi untuk share
    const handleShare = async () => {
        if (typeof window === 'undefined') return;

        try {
            await navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleWhatsAppShare = () => {
        if (typeof window === 'undefined' || !article) return;

        const text = `Baca artikel menarik: "${article.title}" - ${window.location.href}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    // ✅ PERBAIKAN: Loading state dengan skeleton
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 px-4">
                <div className="w-full max-w-4xl mx-auto px-4">
                    {/* Skeleton Progress Bar */}
                    <div className="h-1.5 bg-slate-200 rounded-full mb-8"></div>

                    {/* Skeleton Breadcrumb */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="h-4 w-20 bg-slate-200 rounded-full"></div>
                        <div className="h-4 w-4 bg-slate-200 rounded-full"></div>
                        <div className="h-4 w-24 bg-slate-200 rounded-full"></div>
                        <div className="h-4 w-4 bg-slate-200 rounded-full"></div>
                        <div className="h-4 w-32 bg-slate-300 rounded-full"></div>
                    </div>

                    {/* Skeleton Badge */}
                    <div className="h-8 w-32 bg-slate-200 rounded-full mb-6"></div>

                    {/* Skeleton Title */}
                    <div className="h-12 bg-slate-200 rounded-xl mb-4"></div>
                    <div className="h-12 bg-slate-200 rounded-xl mb-8"></div>

                    {/* Skeleton Meta Info */}
                    <div className="flex items-center justify-between pb-8 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                            <div>
                                <div className="h-3 w-16 bg-slate-200 rounded-full mb-2"></div>
                                <div className="h-4 w-24 bg-slate-300 rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
                            <div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
                            <div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
                        </div>
                    </div>

                    {/* Skeleton Content */}
                    <div className="mt-12 space-y-4">
                        <div className="h-4 bg-slate-200 rounded-full"></div>
                        <div className="h-4 bg-slate-200 rounded-full"></div>
                        <div className="h-4 bg-slate-200 rounded-full w-5/6"></div>
                        <div className="h-4 bg-slate-200 rounded-full w-4/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ PERBAIKAN: Not found state dengan tombol yang lebih jelas
    if (isNotFound || !article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 px-6 py-12">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={48} className="text-red-500" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Artikel Tidak Ditemukan</h1>
                    <p className="text-slate-600 mb-6">
                        {errorMessage || "Artikel yang Anda cari mungkin telah dihapus, dipindahkan, atau tidak tersedia."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-full font-bold hover:bg-slate-50 transition-colors text-sm shadow-sm"
                        >
                            <ArrowLeft size={18} />
                            Kembali
                        </button>
                        <Link
                            href="/artikel"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors text-sm shadow-md"
                        >
                            <Bookmark size={18} />
                            Lihat Artikel Lain
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-colors text-sm"
                        >
                            <Home size={18} />
                            Beranda
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Render artikel jika data tersedia
    return (
        <main className="pt-24 md:pt-28 pb-16 md:pb-20 bg-white min-h-screen selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 origin-left z-[100]"
                style={{ scaleX }}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-slate-500 font-medium mb-8 md:mb-10 text-sm flex-wrap">
                    <Link
                        href="/"
                        className="hover:text-indigo-600 transition-colors flex items-center gap-1"
                    >
                        <Home size={16} />
                        Beranda
                    </Link>
                    <ChevronRight size={16} className="text-slate-300" />
                    <Link
                        href="/artikel"
                        className="hover:text-indigo-600 transition-colors"
                    >
                        Artikel
                    </Link>
                    <ChevronRight size={16} className="text-slate-300" />
                    <span className="text-slate-900 font-semibold truncate max-w-[200px]">
                        {article.category || 'Detail'}
                    </span>
                </nav>

                {/* Hero Section */}
                <header className="mb-10 md:mb-12">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 px-4 py-2 rounded-full text-indigo-700 font-bold text-xs uppercase tracking-wider mb-6"
                    >
                        <Sparkles size={14} className="fill-indigo-500 text-indigo-500" />
                        {article.category} • {readingTime} min baca
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-6 md:mb-8"
                    >
                        {article.title}
                    </motion.h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 md:pb-8 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-600 border-2 border-white shadow-sm">
                                <UserCircle size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Penulis</p>
                                <p className="text-sm font-bold text-slate-900">{article.author}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <Calendar size={16} className="text-slate-400" />
                                <span className="text-xs font-semibold text-slate-700">
                                    {formatDate(article.published_at)}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <Clock size={16} className="text-slate-400" />
                                <span className="text-xs font-semibold text-slate-700">
                                    {readingTime} min
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <Eye size={16} className="text-slate-400" />
                                <span className="text-xs font-semibold text-slate-700">
                                    {(article.view_count || 0).toLocaleString()}x
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Summary Box */}
                {article.excerpt && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-100/50 p-6 md:p-8 rounded-2xl md:rounded-3xl mb-10 md:mb-12 relative overflow-hidden"
                    >
                        <div className="absolute top-6 right-6 text-indigo-200/50">
                            <Bookmark size={40} strokeWidth={1.5} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-indigo-900 font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                                <Sparkles size={14} /> Ringkasan Artikel
                            </h3>
                            <p className="text-slate-800 font-medium leading-relaxed text-base md:text-lg">
                                {article.excerpt}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Featured Media */}
                {(article.visual_type === 'video' || article.visual_type === 'image') && article.visual_value && (
                    <div className="mb-10 md:mb-16">
                        {article.visual_type === 'video' && (
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <PlayCircle size={16} className="text-red-500 fill-red-500" /> Video Penjelasan
                            </p>
                        )}
                        <div className="aspect-video rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 shadow-xl border border-slate-200 relative">
                            {article.visual_type === 'video' ? (
                                <>
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${article.visual_value}?rel=0&modestbranding=1`}
                                        title={article.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        loading="lazy"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                                        YouTube
                                    </div>
                                </>
                            ) : (
                                <div className="relative h-full">
                                    <img
                                        src={article.visual_value}
                                        className="w-full h-full object-cover"
                                        alt={article.title}
                                        loading="lazy"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                parent.innerHTML = `
                                                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                                                        <div class="text-slate-400 text-center p-8">
                                                            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <p class="text-sm font-medium text-slate-500">Gambar tidak tersedia</p>
                                                        </div>
                                                    </div>
                                                `;
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Article Content */}
                <article className="mb-12 md:mb-16">
                    {contentError ? (
                        <div className="text-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                            <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Konten Sedang Disiapkan</h3>
                            <p className="text-slate-500">Konten artikel ini sedang dalam proses penyusunan. Silakan kembali nanti.</p>
                        </div>
                    ) : (
                        <div
                            className="prose prose-slate max-w-none prose-lg
                            prose-headings:text-slate-900 prose-headings:font-black prose-headings:mt-8 prose-headings:mb-4
                            prose-p:text-slate-700 prose-p:leading-relaxed prose-p:my-4
                            prose-strong:text-slate-900 prose-strong:font-bold
                            prose-ul:my-6 prose-ul:pl-5
                            prose-li:my-2 prose-li:text-slate-700
                            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:mx-auto prose-img:max-w-full
                            prose-blockquote:border-l-4 prose-blockquote:border-indigo-600 
                            prose-blockquote:bg-indigo-50/50 prose-blockquote:py-4 prose-blockquote:px-6 
                            prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-slate-700
                            prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                            prose-table:my-8 prose-table:border prose-table:border-slate-200 prose-table:rounded-lg
                            prose-th:bg-slate-50 prose-th:p-3 prose-th:text-left prose-th:font-bold
                            prose-td:p-3 prose-td:border-t prose-td:border-slate-200
                            prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                            prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-4 prose-pre:rounded-lg"
                            dangerouslySetInnerHTML={{
                                __html: article.content ||
                                    `<p class="text-center text-slate-500 italic py-8">Konten artikel tidak tersedia.</p>`
                            }}
                        />
                    )}
                </article>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <div className="mb-8 md:mb-12">
                        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <Sparkles size={14} /> Tags Terkait:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.push(`/artikel?tag=${encodeURIComponent(tag)}`)}
                                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200 hover:bg-slate-200 hover:border-slate-300 transition-all duration-200 cursor-pointer active:scale-95"
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Interaction & Share */}
                <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <p className="text-sm font-bold text-slate-900 mb-2 sm:mb-0">Artikel ini membantu?</p>
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all border font-medium text-sm ${isLiked
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-transparent text-white shadow-lg shadow-indigo-100/50'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'}`}
                        >
                            <ThumbsUp size={16} className={isLiked ? 'fill-white' : ''} />
                            {isLiked ? 'Terima Kasih!' : 'Suka Artikel Ini'}
                            {isLiked && ' ❤️'}
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleWhatsAppShare}
                            className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-full font-medium text-sm hover:bg-[#128C7E] transition-colors shadow-md active:scale-95"
                        >
                            <MessageCircle size={16} />
                            <span>Share via WhatsApp</span>
                        </button>
                        <button
                            onClick={handleShare}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all shadow-md active:scale-95 ${isCopied
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                        >
                            {isCopied ? (
                                <>
                                    <Check size={16} />
                                    <span>Tersalin!</span>
                                </>
                            ) : (
                                <>
                                    <Share2 size={16} />
                                    <span>Salin Link</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* CTA Box */}
                <section className="mt-16 md:mt-20 p-6 md:p-8 lg:p-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl md:rounded-3xl text-white relative overflow-hidden shadow-xl md:shadow-2xl">
                    <div className="absolute top-0 right-0 w-40 h-40 md:w-60 md:h-60 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                <Sparkles size={14} /> Layanan Premium
                            </div>
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 md:mb-4 leading-tight">
                                Butuh Bantuan Riset?
                            </h3>
                            <p className="text-indigo-100 font-medium text-sm md:text-base max-w-xl">
                                Dapatkan bantuan responden valid, olah data SPSS, dan konsultasi penelitian profesional bersama EduAssist.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-sm text-indigo-200">
                                <Check size={14} className="text-green-300" /> Fast Response
                                <Check size={14} className="text-green-300" /> Garansi Kepuasan
                                <Check size={14} className="text-green-300" /> 24/7 Support
                            </div>
                        </div>
                        <Link
                            href="https://wa.me/6285236110219"
                            target="_blank"
                            className="bg-white text-indigo-600 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-slate-100 hover:text-indigo-700 transition-all shadow-2xl active:scale-95 whitespace-nowrap flex items-center gap-2"
                        >
                            <MessageSquare size={20} /> Konsultasi Gratis
                        </Link>
                    </div>
                </section>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <section className="mt-16 md:mt-24">
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                                Artikel <span className="text-indigo-600">Terkait</span>
                            </h2>
                            <Link
                                href="/artikel"
                                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
                            >
                                Lihat Semua
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={`/artikel/${rel.id}`}
                                    className="group bg-white border border-slate-200 rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300"
                                >
                                    <div className="aspect-video overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 relative">
                                        <img
                                            src={rel.visual_type === 'video' && rel.visual_value
                                                ? `https://img.youtube.com/vi/${rel.visual_value}/hqdefault.jpg`
                                                : rel.visual_value || '/placeholder-article.jpg'}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            alt={rel.title}
                                            loading="lazy"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder-article.jpg';
                                            }}
                                        />
                                        {rel.visual_type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                                    <PlayCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600 fill-red-600" />
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-white/90 backdrop-blur-sm text-xs font-bold text-indigo-600 px-2 py-1 rounded-full">
                                                {rel.badge || 'Artikel'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 md:p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                                {rel.category}
                                            </span>
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Eye size={12} /> {(rel.view_count || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 text-sm md:text-base">
                                            {rel.title}
                                        </h4>
                                        <p className="text-slate-500 text-xs mt-2 line-clamp-2">
                                            {rel.excerpt}
                                        </p>
                                        <div className="mt-3 flex items-center gap-2 text-indigo-500 group-hover:text-indigo-600 transition-colors">
                                            <span className="text-xs font-bold">Baca Selengkapnya</span>
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Back to Articles Button */}
                <div className="mt-12 md:mt-16 flex justify-center">
                    <Link
                        href="/artikel"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-full font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors text-sm shadow-sm"
                    >
                        <ArrowLeft size={16} />
                        Kembali ke Daftar Artikel
                    </Link>
                </div>
            </div>

            {/* Back to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 p-3 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-colors z-50 hover:opacity-100 opacity-80 transition-opacity duration-300 group"
                aria-label="Kembali ke atas"
            >
                <ArrowRight className="w-5 h-5 rotate-90 group-hover:-translate-y-1 transition-transform" />
            </button>
        </main>
    );
}