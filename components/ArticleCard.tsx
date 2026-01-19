"use client";

import Link from "next/link";
import { PlayCircle, BookOpen, Users, Calendar, Eye } from "lucide-react";

interface ArticleCardProps {
    article: {
        id: string;
        title: string;
        excerpt: string;
        category: string;
        author: string;
        badge: string;
        visual_type: 'icon' | 'image' | 'video';
        visual_value: string;
        cover_image: string | null;
        published_at: string;
        view_count: number;
    };
}

export default function ArticleCard({ article }: ArticleCardProps) {
    // Logic visual fallback
    let visualContent;
    if (article.visual_type === 'video') {
        visualContent = (
            <>
                <img
                    src={article.cover_image || `https://img.youtube.com/vi/${article.visual_value}/hqdefault.jpg`}
                    alt={article.title}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
                    <PlayCircle className="text-white w-12 h-12 drop-shadow-lg" />
                </div>
            </>
        );
    } else if (article.visual_type === 'image' && article.cover_image) {
        visualContent = (
            <img
                src={article.cover_image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
        );
    } else {
        visualContent = (
            <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                <BookOpen size={48} />
            </div>
        );
    }

    return (
        <article className="group bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
            {/* Header Visual */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
                {visualContent}
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
                    <span className="text-slate-400 flex items-center gap-1">
                        <Users size={12} /> {article.author}
                    </span>
                    <div className="flex items-center gap-3">
                        <span className="text-slate-400 flex items-center gap-1">
                            <Eye size={12} /> {article.view_count || 0}
                        </span>
                        <Link href={`/artikel/${article.id}`} className="text-blue-600 hover:underline uppercase tracking-wider">
                            Baca &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}