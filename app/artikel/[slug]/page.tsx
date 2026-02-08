"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Calendar, Clock, Share2, MessageCircle,
    PlayCircle, Sparkles, ChevronRight, Check, ThumbsUp,
    MessageSquare, Eye, Home, AlertCircle, BookOpen
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from '@/lib/supabase';

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
    // Params sekarang akan menangkap [slug], bukan [id]
    const params = useParams();

    // State
    const [article, setArticle] = useState<Article | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [contentError, setContentError] = useState(false);

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
            // Ubah params.id menjadi params.slug
            if (!params?.slug) return;
            const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

            setIsLoading(true);
            setContentError(false);

            try {
                // 1. Fetch Main Article berdasarkan SLUG
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('slug', slug) // PENTING: Cari berdasarkan kolom 'slug'
                    .single();

                if (error) throw error;
                if (!data) throw new Error("Artikel tidak ditemukan");

                const formattedArticle: Article = {
                    ...data,
                    badge: data.badge || getBadge(data.category || "Umum"),
                    visual_type: data.visual_type || 'icon',
                    visual_value: data.visual_value || data.cover_image || '',
                    cover_image: data.cover_image
                };

                setArticle(formattedArticle);
                document.title = `${formattedArticle.title} | EduAssist`;

                if (!formattedArticle.content || formattedArticle.content.trim() === '') {
                    setContentError(true);
                }

                // 2. Increment View Count (Tetap pakai ID untuk efisiensi, ambil dari data yang sudah didapat)
                const incrementView = async () => {
                    try {
                        const { error: rpcError } = await supabase.rpc('increment_view_count', { row_id: data.id });
                        if (rpcError) throw rpcError;
                    } catch (err) {
                        await supabase
                            .from('articles')
                            .update({ view_count: (data.view_count || 0) + 1 })
                            .eq('id', data.id);
                    }
                };
                incrementView();

                // 3. Fetch Related Articles
                const { data: relatedData } = await supabase
                    .from('articles')
                    .select('id, title, slug, excerpt, category, author, published_at, visual_type, visual_value, cover_image, status, view_count, badge')
                    .eq('category', data.category)
                    .neq('id', data.id)
                    .eq('status', 'Published')
                    .limit(3)
                    .order('published_at', { ascending: false });

                if (relatedData) {
                    const formattedRelated = relatedData.map(item => ({
                        ...item,
                        content: "",
                        badge: item.badge || getBadge(item.category)
                    }));
                    setRelatedArticles(formattedRelated as Article[]);
                }

            } catch (err) {
                console.error("Error loading article:", err);
                setArticle(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticleData();
    }, [params]);

    const readingTime = useMemo(() => {
        if (!article?.content) return 1;
        const words = article.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
        return Math.ceil(words / 200);
    }, [article]);

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        } catch { return ""; }
    };

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

    return (
        <main className="pt-24 md:pt-28 pb-16 bg-white min-h-screen">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* BREADCRUMB */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
                    <Link href="/" className="hover:text-indigo-600"><Home size={16} /></Link>
                    <ChevronRight size={16} />
                    <Link href="/artikel" className="hover:text-indigo-600">Artikel</Link>
                    <ChevronRight size={16} />
                    <span className="text-slate-900 font-medium truncate max-w-[200px]">{article.title}</span>
                </nav>

                {/* HEADER ARTIKEL */}
                <header className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-100">
                        <Sparkles size={14} /> {article.badge || article.category}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-8 tracking-tight">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg uppercase shadow-sm">
                                {article.author.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">{article.author}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                    <Calendar size={12} /> {formatDate(article.published_at)}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-lg">
                            <span className="flex items-center gap-1"><Clock size={14} /> {readingTime} min baca</span>
                            <div className="w-px h-3 bg-slate-300"></div>
                            <span className="flex items-center gap-1"><Eye size={14} /> {article.view_count.toLocaleString()} views</span>
                        </div>
                    </div>
                </header>

                {/* VISUAL UTAMA (GAMBAR/VIDEO) */}
                {article.visual_value && (
                    <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 bg-slate-100">
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

                {/* KONTEN ARTIKEL */}
                <article className="prose prose-lg prose-slate max-w-none 
                    prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
                    prose-p:text-slate-600 prose-p:leading-relaxed
                    prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-2xl prose-img:shadow-lg
                    prose-strong:text-slate-900 prose-strong:font-bold
                    prose-ul:list-disc prose-ol:list-decimal
                    prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:italic
                    mb-16">

                    {contentError ? (
                        <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-500 italic">
                            Konten artikel ini sedang dalam proses penyuntingan oleh tim redaksi kami. Silakan kembali lagi nanti.
                        </div>
                    ) : (
                        <div
                            className="tiptap-content"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    )}

                    <style jsx global>{`
                        .tiptap-content h1 { font-size: 2.25rem; margin-bottom: 1.5rem; }
                        .tiptap-content h2 { font-size: 1.875rem; margin-top: 2.5rem; margin-bottom: 1.25rem; }
                        .tiptap-content h3 { font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; }
                        .tiptap-content p { margin-bottom: 1.5rem; }
                        .tiptap-content ul, .tiptap-content ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
                        .tiptap-content li { margin-bottom: 0.5rem; }
                    `}</style>
                </article>

                {/* INTERAKSI & SHARE */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-slate-200">
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all active:scale-95 ${isLiked ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-white text-slate-600 border-2 border-slate-100 hover:border-slate-300'}`}
                    >
                        <ThumbsUp size={20} className={isLiked ? "fill-rose-600" : ""} />
                        {isLiked ? "Terima Kasih!" : "Artikel ini membantu?"}
                    </button>

                    <div className="flex gap-3 w-full md:w-auto">
                        <button onClick={handleWhatsAppShare} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-bold hover:opacity-90 transition shadow-lg shadow-green-100 active:scale-95">
                            <MessageCircle size={20} /> Share WA
                        </button>
                        <button onClick={handleShare} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition shadow-lg active:scale-95">
                            {isCopied ? <Check size={20} /> : <Share2 size={20} />}
                            {isCopied ? "Tersalin!" : "Salin Link"}
                        </button>
                    </div>
                </div>

                {/* RELATED ARTICLES (Menggunakan Slug di Link) */}
                {relatedArticles.length > 0 && (
                    <section className="mt-20 pt-10 border-t border-slate-200">
                        <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2">
                            <BookOpen className="text-indigo-600" /> Baca Juga
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map((rel) => (
                                <Link key={rel.id} href={`/artikel/${rel.slug || rel.id}`} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all h-full flex flex-col hover:-translate-y-1 duration-300">
                                    <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                        <img
                                            src={rel.visual_type === 'video' ? `https://img.youtube.com/vi/${rel.visual_value}/hqdefault.jpg` : (rel.cover_image || rel.visual_value || 'https://placehold.co/600x400/f1f5f9/94a3b8?text=EduAssist')}
                                            alt={rel.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-600 shadow-sm">
                                            {rel.badge}
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-3 leading-snug">
                                            {rel.title}
                                        </h4>
                                        <div className="mt-auto flex items-center justify-between text-[10px] text-slate-400 font-bold pt-3 border-t border-slate-50 uppercase tracking-wider">
                                            <span>{formatDate(rel.published_at)}</span>
                                            <span className="flex items-center gap-1"><Eye size={12} /> {rel.view_count}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* CTA BOX */}
                <div className="mt-16 p-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] text-white text-center shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-4xl font-black mb-4 tracking-tight">Butuh Bantuan Olah Data?</h3>
                        <p className="text-indigo-100 mb-8 max-w-xl mx-auto text-base md:text-lg font-medium leading-relaxed">
                            Tim EduAssist siap membantu riset skripsi, tesis, atau bisnis Anda dengan data valid dan garansi revisi sampai tuntas.
                        </p>
                        <Link href="https://wa.me/6285236110219" target="_blank" className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-2xl font-black text-lg hover:bg-indigo-50 transition shadow-lg transform hover:-translate-y-1 active:scale-95">
                            <MessageSquare size={22} /> Konsultasi Gratis Sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}