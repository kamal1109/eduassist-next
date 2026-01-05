"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
    Calendar, ArrowLeft, UserCircle, Clock, Share2, MessageCircle,
    PlayCircle, Sparkles, ChevronRight, Check, ThumbsUp,
    Bookmark, MessageSquare, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function DetailArtikel() {
    const params = useParams();
    const [article, setArticle] = useState<any>(null);
    const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    // 1. FITUR: Reading Progress Bar (Sticky di paling atas)
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const getData = async () => {
            if (!params.id) return;

            // Fetch Artikel Utama
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('id', params.id)
                .single();

            if (data) {
                setArticle(data);
                document.title = `${data.title} | EduAssist Knowledge Hub`;

                // 2. FITUR: Fetch Artikel Terkait (Berdasarkan Kategori yang sama)
                const { data: related } = await supabase
                    .from('articles')
                    .select('id, title, category, visual_value, visual_type')
                    .eq('category', data.category)
                    .neq('id', data.id) // Jangan tampilkan artikel yang sedang dibaca
                    .limit(3);

                if (related) setRelatedArticles(related);
            }
            setIsLoading(false);
        };
        getData();
    }, [params.id]);

    const readingTime = useMemo(() => {
        if (!article?.content) return 1;
        const words = article.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
        return Math.ceil(words / 200) || 1;
    }, [article]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "Baru saja";
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
    );

    if (!article) return <div className="min-h-screen flex items-center justify-center bg-white text-slate-900 font-bold">Artikel tidak ditemukan</div>;

    return (
        <main className="pt-32 pb-20 bg-white min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
            {/* PROGRESS BAR */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-indigo-600 origin-left z-[100]"
                style={{ scaleX }}
            />

            <div className="container mx-auto px-6 max-w-4xl">
                {/* BREADCRUMB */}
                <nav className="flex items-center gap-2 text-slate-400 font-bold mb-10 text-[10px] uppercase tracking-widest">
                    <Link href="/artikel" className="hover:text-indigo-600 transition-colors">Artikel</Link>
                    <ChevronRight size={12} />
                    <span className="text-slate-900 truncate">{article.category}</span>
                </nav>

                {/* HERO SECTION */}
                <header className="mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-10 tracking-tighter"
                    >
                        {article.title}
                    </motion.h1>

                    <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                                <UserCircle size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ditulis oleh</p>
                                <p className="text-sm font-bold text-slate-900">{article.author || "Tim EduAssist"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Calendar size={14} /> {formatDate(article.published_at)}</span>
                            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Clock size={14} /> {readingTime} Menit Baca</span>
                        </div>
                    </div>
                </header>

                {/* 3. FITUR: RINGKASAN CEPAT (Summary Box) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="bg-indigo-50/50 border border-indigo-100 p-8 md:p-10 rounded-[2.5rem] mb-16 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 text-indigo-100 group-hover:text-indigo-200 transition-colors">
                        <Bookmark size={60} strokeWidth={3} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-indigo-900 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                            <Sparkles size={16} /> Insight Utama Artikel
                        </h3>
                        <p className="text-indigo-800/80 font-bold leading-relaxed text-xl italic md:text-2xl">
                            "{article.excerpt}"
                        </p>
                    </div>
                </motion.div>

                {/* MEDIA UTAMA */}
                <div className="mb-16">
                    {article.visual_type === 'video' && (
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <PlayCircle size={14} className="text-red-500" /> Tonton Video Penjelasan
                        </p>
                    )}
                    <div className="aspect-video rounded-[3rem] overflow-hidden bg-slate-50 shadow-2xl border border-slate-100 group">
                        {article.visual_type === 'video' ? (
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${article.visual_value}`}
                                frameBorder="0"
                                allowFullScreen
                            />
                        ) : (
                            <img
                                src={article.visual_value}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt={article.title}
                            />
                        )}
                    </div>
                </div>

                {/* 4. FITUR: KONTEN ARTIKEL (Optimized Typography) */}
                <article
                    className="prose prose-indigo prose-lg max-w-none text-slate-600 font-medium leading-[1.8] 
                    prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tighter
                    prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8
                    prose-p:mb-8 prose-li:mb-2 prose-img:rounded-[2.5rem] prose-blockquote:border-l-4 prose-blockquote:border-indigo-600 prose-blockquote:bg-slate-50 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:font-bold prose-blockquote:italic"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* 5. FITUR: INTERAKSI & SHARE */}
                <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Artikel ini membantu?</p>
                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all border font-bold text-xs uppercase ${isLiked ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                        >
                            <ThumbsUp size={18} className={isLiked ? "fill-white" : ""} /> {isLiked ? 'Terima Kasih!' : 'Bermanfaat'}
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={`https://wa.me/?text=Info menarik nih: ${article.title} - ${typeof window !== 'undefined' ? window.location.href : ''}`}
                            target="_blank"
                            className="p-4 bg-[#25D366] text-white rounded-2xl shadow-xl shadow-green-100 hover:scale-110 transition-all"
                        >
                            <MessageCircle size={20} />
                        </Link>
                        <button
                            onClick={() => { navigator.clipboard.writeText(window.location.href); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }}
                            className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl hover:scale-110 transition-all flex items-center gap-2 group"
                        >
                            {isCopied ? <Check size={20} className="text-green-400" /> : <Share2 size={20} />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{isCopied ? 'Link Tersalin' : 'Bagikan'}</span>
                        </button>
                    </div>
                </div>

                {/* CTA BOX (Keluaran Pro) */}
                <section className="mt-24 p-10 md:p-16 bg-indigo-600 rounded-[4rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 mb-6 bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                <Sparkles size={14} /> Solusi Skripsi & Riset
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tight">Mau Lolos Sidang Tanpa Revisi?</h3>
                            <p className="text-indigo-100 mb-0 max-w-xl font-medium text-lg leading-relaxed">Dapatkan bantuan responden valid dan olah data profesional bersama EduAssist.</p>
                        </div>
                        <Link href="https://wa.me/628123456789" className="bg-white text-indigo-600 px-10 py-6 rounded-3xl font-black flex items-center gap-3 hover:bg-slate-950 hover:text-white transition-all text-lg shadow-2xl active:scale-95 whitespace-nowrap">
                            <MessageSquare size={24} /> Konsultasi Gratis
                        </Link>
                    </div>
                </section>

                {/* 6. FITUR: RELATED ARTICLES (Mencegah Bounce Rate) */}
                {relatedArticles.length > 0 && (
                    <section className="mt-32">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Artikel <span className="text-indigo-600">Terkait</span></h2>
                            <Link href="/artikel" className="text-xs font-black text-indigo-600 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 hover:text-slate-900 hover:border-slate-900 transition-all">Lihat Semua</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {relatedArticles.map((rel) => (
                                <Link key={rel.id} href={`/artikel/${rel.id}`} className="group">
                                    <div className="aspect-video rounded-[2rem] overflow-hidden mb-5 bg-slate-50 border border-slate-100 shadow-sm transition-all group-hover:shadow-2xl group-hover:-translate-y-2">
                                        <img
                                            src={rel.visual_type === 'video' ? `https://img.youtube.com/vi/${rel.visual_value}/hqdefault.jpg` : rel.visual_value}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            alt={rel.title}
                                        />
                                    </div>
                                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-2 px-1">{rel.category}</p>
                                    <h4 className="font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 px-1 text-lg">{rel.title}</h4>
                                    <div className="mt-4 flex items-center gap-2 text-indigo-200 group-hover:text-indigo-600 transition-colors px-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Baca Sekarang</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}