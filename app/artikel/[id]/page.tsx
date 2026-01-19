"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
    Calendar, Clock, Share2, MessageCircle,
    PlayCircle, Sparkles, ChevronRight, Check, ThumbsUp,
    MessageSquare, Eye, Home, AlertCircle, BookOpen
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from '@/lib/supabase'; // Pastikan path ini benar

// --- TYPE DEFINITION ---
interface Article {
    id: string;
    title: string;
    slug: string;
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
}

export default function DetailArtikel() {
    const params = useParams();

    // State
    const [article, setArticle] = useState<Article | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [contentError, setContentError] = useState(false);

    // Scroll Progress Bar
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Helper Badge
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

    useEffect(() => {
        const fetchArticleData = async () => {
            // Validasi ID
            if (!params?.id) return;
            const articleId = Array.isArray(params.id) ? params.id[0] : params.id;

            setIsLoading(true);
            setContentError(false);

            try {
                // 1. Fetch Artikel Utama
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('id', articleId)
                    .single();

                if (error) throw error;
                if (!data) throw new Error("Artikel tidak ditemukan");

                // Format Data
                const formattedArticle: Article = {
                    ...data,
                    badge: data.badge || getBadge(data.category || "Umum"),
                    visual_type: data.visual_type || 'icon',
                    // Fallback visual logic
                    visual_value: data.visual_value || data.cover_image || '',
                    cover_image: data.cover_image
                };

                setArticle(formattedArticle);
                document.title = `${formattedArticle.title} | EduAssist`;

                // Cek jika konten kosong
                if (!formattedArticle.content || formattedArticle.content.trim() === '') {
                    setContentError(true);
                }

                // 2. Increment View Count (Logic Perbaikan)
                const incrementView = async () => {
                    try {
                        // Coba panggil RPC (Stored Procedure) dulu karena lebih aman & atomik
                        const { error: rpcError } = await supabase.rpc('increment_view_count', { row_id: articleId });

                        if (rpcError) throw rpcError;
                    } catch (err) {
                        // JIKA GAGAL (Misal RPC belum dibuat), LAKUKAN UPDATE MANUAL
                        // console.warn("RPC gagal, fallback ke update manual:", err);
                        await supabase
                            .from('articles')
                            .update({ view_count: (data.view_count || 0) + 1 })
                            .eq('id', articleId);
                    }
                };
                incrementView();

                // 3. Fetch Related Articles
                const { data: relatedData } = await supabase
                    .from('articles')
                    .select('id, title, excerpt, category, author, published_at, visual_type, visual_value, cover_image, status, view_count, badge')
                    .eq('category', data.category)
                    .neq('id', articleId)
                    .eq('status', 'Published')
                    .limit(3)
                    .order('published_at', { ascending: false });

                if (relatedData) {
                    const formattedRelated = relatedData.map(item => ({
                        ...item,
                        content: "", // Tidak butuh content untuk preview card
                        badge: item.badge || getBadge(item.category)
                    }));
                    setRelatedArticles(formattedRelated as Article[]);
                }

            } catch (err) {
                console.error("Error loading article:", err);
                setArticle(null); // Trigger Not Found State
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticleData();
    }, [params]);

    // Hitung Estimasi Waktu Baca
    const readingTime = useMemo(() => {
        if (!article?.content) return 1;
        const words = article.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
        return Math.ceil(words / 200);
    }, [article]);

    // Format Tanggal
    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        } catch { return ""; }
    };

    // Share Functions
    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch {
            alert("Gagal menyalin link");
        }
    };

    const handleWhatsAppShare = () => {
        if (!article) return;
        const text = `*${article.title}*\n\nBaca selengkapnya di sini:\n${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    // --- RENDER: LOADING ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white pt-32 px-4 flex justify-center">
                <div className="w-full max-w-4xl space-y-8 animate-pulse">
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                    <div className="h-12 w-3/4 bg-slate-200 rounded"></div>
                    <div className="flex gap-4 items-center">
                        <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                        <div className="space-y-2">
                            <div className="h-3 w-24 bg-slate-200 rounded"></div>
                            <div className="h-3 w-16 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                    <div className="h-96 w-full bg-slate-200 rounded-2xl"></div>
                    <div className="space-y-4">
                        <div className="h-4 w-full bg-slate-200 rounded"></div>
                        <div className="h-4 w-full bg-slate-200 rounded"></div>
                        <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER: NOT FOUND ---
    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
                <AlertCircle size={64} className="text-slate-300 mb-6" />
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Artikel Tidak Ditemukan</h1>
                <p className="text-slate-500 mb-8">Artikel mungkin telah dihapus atau URL salah.</p>
                <Link href="/artikel" className="px-6 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition">
                    Kembali ke Daftar Artikel
                </Link>
            </div>
        );
    }

    // --- RENDER: MAIN CONTENT ---
    return (
        <main className="pt-24 md:pt-28 pb-16 bg-white min-h-screen">

            {/* Progress Bar */}
            <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-indigo-600 origin-left z-[100]" style={{ scaleX }} />

            <div className="container mx-auto px-4 max-w-4xl">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
                    <Link href="/" className="hover:text-indigo-600"><Home size={16} /></Link>
                    <ChevronRight size={16} />
                    <Link href="/artikel" className="hover:text-indigo-600">Artikel</Link>
                    <ChevronRight size={16} />
                    <span className="text-slate-900 font-medium truncate max-w-[200px]">{article.title}</span>
                </nav>

                {/* Header Artikel */}
                <header className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        <Sparkles size={14} /> {article.badge || article.category}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-8">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg uppercase">
                                {article.author.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">{article.author}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Calendar size={12} /> {formatDate(article.published_at)}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                            <span className="flex items-center gap-1"><Clock size={14} /> {readingTime} min baca</span>
                            <span className="flex items-center gap-1"><Eye size={14} /> {article.view_count.toLocaleString()} views</span>
                        </div>
                    </div>
                </header>

                {/* Visual Utama */}
                {article.visual_value && (
                    <div className="mb-12 rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
                        {article.visual_type === 'video' ? (
                            <div className="aspect-video relative bg-black">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${article.visual_value}?rel=0`}
                                    title={article.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <img
                                src={article.visual_type === 'image' ? article.visual_value : (article.cover_image || article.visual_value)}
                                alt={article.title}
                                className="w-full h-auto object-cover max-h-[500px]"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/800x450/f1f5f9/94a3b8?text=No+Image';
                                }}
                            />
                        )}
                    </div>
                )}

                {/* Isi Artikel */}
                <article className="prose prose-lg prose-slate max-w-none 
                    prose-headings:font-black prose-headings:text-slate-900 
                    prose-a:text-indigo-600 prose-img:rounded-xl prose-img:shadow-lg
                    mb-16">
                    {contentError ? (
                        <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 italic">
                            Konten artikel ini sedang dalam proses penyuntingan oleh tim redaksi kami. Silakan kembali lagi nanti.
                        </div>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    )}
                </article>

                {/* Share & Like Action */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-slate-200">
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${isLiked ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                    >
                        <ThumbsUp size={18} className={isLiked ? "fill-rose-600" : ""} />
                        {isLiked ? "Terima Kasih!" : "Artikel ini membantu?"}
                    </button>

                    <div className="flex gap-3">
                        <button onClick={handleWhatsAppShare} className="flex items-center gap-2 px-5 py-3 bg-[#25D366] text-white rounded-full font-bold hover:opacity-90 transition shadow-lg shadow-green-100">
                            <MessageCircle size={18} /> Share WA
                        </button>
                        <button onClick={handleShare} className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition shadow-lg">
                            {isCopied ? <Check size={18} /> : <Share2 size={18} />}
                            {isCopied ? "Tersalin!" : "Salin Link"}
                        </button>
                    </div>
                </div>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <section className="mt-20 pt-10 border-t border-slate-200">
                        <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2">
                            <BookOpen className="text-indigo-600" /> Baca Juga
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map((rel) => (
                                <Link key={rel.id} href={`/artikel/${rel.id}`} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all h-full flex flex-col">
                                    <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                        <img
                                            src={rel.visual_type === 'video' ? `https://img.youtube.com/vi/${rel.visual_value}/hqdefault.jpg` : (rel.cover_image || rel.visual_value || 'https://placehold.co/600x400/f1f5f9/94a3b8?text=EduAssist')}
                                            alt={rel.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                                            {rel.badge}
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-3">
                                            {rel.title}
                                        </h4>
                                        <div className="mt-auto flex items-center justify-between text-xs text-slate-500 font-medium pt-3 border-t border-slate-50">
                                            <span>{formatDate(rel.published_at)}</span>
                                            <span className="flex items-center gap-1"><Eye size={12} /> {rel.view_count}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Bottom CTA */}
                <div className="mt-16 p-8 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl text-white text-center shadow-2xl shadow-indigo-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-black mb-4">Butuh Bantuan Olah Data?</h3>
                        <p className="text-indigo-100 mb-8 max-w-xl mx-auto text-sm md:text-base">
                            Tim EduAssist siap membantu riset skripsi, tesis, atau bisnis Anda dengan data valid dan garansi revisi sampai tuntas.
                        </p>
                        <Link href="https://wa.me/6285236110219" target="_blank" className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition shadow-lg transform hover:-translate-y-1">
                            <MessageSquare size={20} /> Konsultasi Gratis Sekarang
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}