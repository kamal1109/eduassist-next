"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    BarChart3, TrendingUp, Eye, FileText,
    PieChart, ArrowUpRight, Calendar, Loader2
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);

    // --- STATE DATA ---
    const [stats, setStats] = useState({
        totalViews: 0,
        totalArticles: 0,
        publishedCount: 0,
        draftCount: 0
    });
    const [topArticles, setTopArticles] = useState<any[]>([]);
    const [categoryData, setCategoryData] = useState<any[]>([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    async function fetchAnalytics() {
        try {
            setLoading(true);

            // 1. Ambil data artikel dari Supabase
            const { data: articles, error } = await supabase
                .from('articles')
                .select('id, title, view_count, status, category, created_at');

            if (error) throw error;
            if (!articles) return;

            // --- HITUNG STATISTIK ---
            const totalViews = articles.reduce((acc, curr) => acc + (curr.view_count || 0), 0);
            const totalArticles = articles.length;
            const publishedCount = articles.filter(a => a.status === 'Published').length;
            const draftCount = articles.filter(a => a.status === 'Draft' || a.status === 'Review').length;

            setStats({ totalViews, totalArticles, publishedCount, draftCount });

            // Top 5 Artikel
            const sortedByViews = [...articles]
                .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                .slice(0, 5);
            setTopArticles(sortedByViews);

            // Kategori Chart Data Processing
            const catMap: Record<string, number> = {};
            articles.forEach(a => {
                const cat = a.category || "Uncategorized";
                catMap[cat] = (catMap[cat] || 0) + 1;
            });

            const catArray = Object.keys(catMap).map(key => ({
                name: key,
                count: catMap[key],
                percentage: Math.round((catMap[key] / totalArticles) * 100)
            })).sort((a, b) => b.count - a.count);

            setCategoryData(catArray);

        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full min-h-full bg-[#F8FAFC]">

            {/* --- HEADER STICKY --- */}
            <div className="sticky top-0 z-20 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200 px-4 py-4 sm:px-8 sm:py-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            Analytics <span className="hidden sm:inline text-slate-300 font-light">|</span> <span className="text-sm font-medium text-slate-500 hidden sm:inline">Performa Konten</span>
                        </h1>
                        <p className="text-slate-500 text-xs sm:hidden mt-1">Statistik performa artikel Anda.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            Live Data Supabase
                        </span>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-20">

                {loading ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-indigo-600" size={40} />
                        <p className="text-slate-400 text-sm font-medium">Mengambil data...</p>
                    </div>
                ) : (
                    <>
                        {/* 1. STATS CARDS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

                            {/* Total Views */}
                            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:scale-110 transition-transform">
                                        <Eye size={24} />
                                    </div>
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                                        <TrendingUp size={12} /> +12%
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">{stats.totalViews.toLocaleString()}</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Pembaca</p>
                                </div>
                                <div className="absolute -right-6 -bottom-6 text-slate-50 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <Eye size={100} />
                                </div>
                            </div>

                            {/* Total Articles */}
                            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform">
                                        <FileText size={24} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">{stats.totalArticles}</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Artikel</p>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <span className="text-[10px] px-2 py-1 bg-emerald-100 text-emerald-700 rounded font-bold">{stats.publishedCount} Live</span>
                                    <span className="text-[10px] px-2 py-1 bg-amber-100 text-amber-700 rounded font-bold">{stats.draftCount} Draft</span>
                                </div>
                            </div>

                            {/* Avg Views (Gradient) */}
                            <div className="sm:col-span-2 lg:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 p-5 sm:p-6 rounded-2xl text-white shadow-lg shadow-indigo-200 relative overflow-hidden flex flex-col justify-between">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4 opacity-80">
                                        <BarChart3 size={20} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Rata-rata Performa</span>
                                    </div>
                                    <h3 className="text-3xl sm:text-4xl font-black mb-1">
                                        {stats.totalArticles > 0 ? Math.round(stats.totalViews / stats.totalArticles).toLocaleString() : 0}
                                    </h3>
                                    <p className="text-xs font-medium opacity-70">Views per artikel</p>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                            </div>
                        </div>

                        {/* 2. GRID CONTENT ANALYSIS */}
                        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">

                            {/* Artikel Terpopuler Table */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <TrendingUp className="text-red-500" size={20} />
                                        Artikel Terpopuler
                                    </h3>
                                    <Link href="/admin/dashboard/list" className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                                        Lihat Semua <ArrowUpRight size={14} />
                                    </Link>
                                </div>

                                <div className="space-y-3 flex-1">
                                    {topArticles.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-48 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                                            <FileText size={32} className="mb-2 opacity-50" />
                                            <p className="text-sm">Belum ada data artikel.</p>
                                        </div>
                                    ) : (
                                        topArticles.map((article, idx) => (
                                            <div key={article.id} className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl hover:bg-slate-50 transition group border border-transparent hover:border-slate-100">
                                                <div className={`
                                                    w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-black text-xs sm:text-sm shrink-0
                                                    ${idx === 0 ? 'bg-amber-100 text-amber-700' :
                                                        idx === 1 ? 'bg-slate-200 text-slate-700' :
                                                            idx === 2 ? 'bg-orange-100 text-orange-700' :
                                                                'bg-slate-100 text-slate-500'}
                                                `}>
                                                    #{idx + 1}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm text-slate-800 truncate group-hover:text-indigo-600 transition">
                                                        {article.title}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium truncate max-w-[100px]">
                                                            {article.category || "Uncategorized"}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                            <Calendar size={10} /> {new Date(article.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="text-right pl-2">
                                                    <span className="block font-black text-indigo-600 text-sm">{article.view_count}</span>
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase">Views</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Distribusi Kategori Chart */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
                                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <PieChart className="text-indigo-500" size={20} />
                                    Distribusi Kategori
                                </h3>

                                <div className="space-y-5">
                                    {categoryData.length === 0 ? (
                                        <p className="text-slate-400 text-sm text-center py-10">Belum ada data kategori.</p>
                                    ) : (
                                        categoryData.slice(0, 5).map((cat, idx) => (
                                            <div key={idx}>
                                                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                                                    <span className="truncate pr-2">{cat.name}</span>
                                                    <span className="shrink-0">{cat.percentage}%</span>
                                                </div>
                                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${cat.percentage}%` }}
                                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                                        className={`h-full rounded-full ${idx % 3 === 0 ? 'bg-indigo-500' :
                                                            idx % 3 === 1 ? 'bg-purple-500' :
                                                                'bg-emerald-500'
                                                            }`}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-1 text-right">{cat.count} Artikel</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </div>
        </div>
    );
}