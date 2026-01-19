"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    BarChart3, FileText, Eye,
    Plus, TrendingUp, Edit3, ArrowUpRight, Calendar, Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase"; // Pastikan path ini benar (lib/supabase.ts)
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export default function DashboardHome() {
    const [loading, setLoading] = useState(true);

    // State Data Real
    const [stats, setStats] = useState({
        totalViews: 0,
        totalArticles: 0,
        publishedCount: 0,
        draftCount: 0
    });
    const [recentArticles, setRecentArticles] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        setLoading(true);

        const { data: articles, error } = await supabase
            .from('articles')
            .select('id, title, status, view_count, published_at, category')
            .order('published_at', { ascending: false });

        if (articles) {
            const totalViews = articles.reduce((sum, item) => sum + (item.view_count || 0), 0);
            const totalArticles = articles.length;
            const publishedCount = articles.filter(a => a.status === 'Published').length;
            const draftCount = articles.filter(a => a.status === 'Draft').length;

            setStats({ totalViews, totalArticles, publishedCount, draftCount });
            setRecentArticles(articles.slice(0, 5));

            // Data untuk Grafik (Top 5 Artikel by Views)
            const topArticles = [...articles]
                .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                .slice(0, 5)
                .map(art => ({
                    name: art.title.length > 15 ? art.title.substring(0, 15) + '...' : art.title,
                    views: art.view_count || 0,
                    fullTitle: art.title
                }));

            setChartData(topArticles);
        }
        setLoading(false);
    }

    // Custom Tooltip Chart
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
                    <p className="text-xs font-bold text-slate-900 mb-1">{payload[0].payload.fullTitle}</p>
                    <p className="text-sm text-indigo-600 font-black">
                        {payload[0].value} Views
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full min-h-full bg-[#F8FAFC]">

            {/* --- MAIN CONTENT --- */}
            {/* Padding disesuaikan agar tidak mepet header di mobile/desktop */}
            <div className="p-4 sm:p-8 max-w-7xl mx-auto pb-24 pt-8 sm:pt-12">

                {/* HEADER DASHBOARD */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 md:mb-12">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-2 leading-tight">
                            Analisa Website
                        </h1>
                        <p className="text-sm md:text-base text-slate-500 font-medium">
                            Pantau performa konten dan kunjungan pembaca secara real-time.
                        </p>
                    </div>

                    <Link
                        href="/admin/dashboard/input"
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-slate-900 transition active:scale-95"
                    >
                        <Plus size={18} strokeWidth={3} />
                        <span>Buat Artikel</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                        <Loader2 className="animate-spin text-indigo-600 w-10 h-10 mb-4" />
                        <p className="text-slate-400 font-bold text-sm tracking-wider">MENGAMBIL DATA...</p>
                    </div>
                ) : (
                    <div className="space-y-6 md:space-y-8">

                        {/* 1. STATS CARDS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

                            {/* Total Views */}
                            <div className="bg-white p-6 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                        <Eye size={20} />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Total Pembaca</span>
                                </div>
                                <div className="text-3xl md:text-4xl font-black text-slate-900">{stats.totalViews.toLocaleString()}</div>
                                <div className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">
                                    <TrendingUp size={14} /> Real-time
                                </div>
                            </div>

                            {/* Total Live */}
                            <div className="bg-white p-6 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                                        <FileText size={20} />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Konten Live</span>
                                </div>
                                <div className="text-3xl md:text-4xl font-black text-slate-900">{stats.publishedCount}</div>
                                <div className="text-xs text-slate-400 font-bold mt-2">
                                    Artikel Aktif
                                </div>
                            </div>

                            {/* Draft */}
                            <div className="bg-white p-6 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                                        <Edit3 size={20} />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Draft</span>
                                </div>
                                <div className="text-3xl md:text-4xl font-black text-slate-900">{stats.draftCount}</div>
                                <div className="text-xs text-amber-500 font-bold mt-2">
                                    Perlu Review
                                </div>
                            </div>

                            {/* Average */}
                            <div className="bg-white p-6 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                                        <BarChart3 size={20} />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Rata-Rata</span>
                                </div>
                                <div className="text-3xl md:text-4xl font-black text-slate-900">
                                    {stats.totalArticles > 0 ? Math.round(stats.totalViews / stats.totalArticles) : 0}
                                </div>
                                <div className="text-xs text-slate-400 font-bold mt-2">
                                    Views per Artikel
                                </div>
                            </div>
                        </div>

                        {/* 2. GRAPH & LIST SECTION */}
                        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">

                            {/* GRAFIK KUNJUNGAN */}
                            <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                    <div>
                                        <h3 className="font-black text-slate-900 text-lg">Top Artikel</h3>
                                        <p className="text-slate-400 text-xs md:text-sm mt-1">5 konten dengan performa terbaik minggu ini</p>
                                    </div>
                                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 self-start sm:self-center">
                                        <BarChart3 size={20} />
                                    </div>
                                </div>

                                <div className="h-[250px] md:h-[300px] w-full flex-1 min-h-0">
                                    {chartData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                                                    dy={10}
                                                    interval={0}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                                                />
                                                <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                                                <Bar dataKey="views" radius={[6, 6, 0, 0]}>
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#818cf8'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                                            <BarChart3 size={40} className="mb-2 opacity-20" />
                                            <p className="text-sm font-bold">Belum ada data visual</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* LIST ARTIKEL TERBARU */}
                            <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-slate-900 text-lg">Baru Rilis</h3>
                                    <Link href="/admin/dashboard/list" className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition">
                                        LIHAT SEMUA
                                    </Link>
                                </div>

                                <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] pr-1 custom-scrollbar">
                                    {recentArticles.length === 0 ? (
                                        <div className="text-center py-10">
                                            <p className="text-slate-400 text-sm">Belum ada artikel.</p>
                                        </div>
                                    ) : (
                                        recentArticles.map((article) => (
                                            <div key={article.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 cursor-default">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition shadow-sm">
                                                        <FileText size={16} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-slate-800 text-xs md:text-sm truncate group-hover:text-indigo-600 transition">
                                                            {article.title}
                                                        </h4>
                                                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                            <Calendar size={10} />
                                                            {new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right pl-2">
                                                    <span className={`text-[9px] px-2 py-1 rounded-full font-bold uppercase ${article.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                        {article.status === 'Published' ? 'LIVE' : 'DRAFT'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <Link href="/admin/dashboard/users" className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl shadow-lg hover:bg-indigo-600 transition group">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Quick Action</p>
                                            <p className="font-bold text-sm">Kelola Data User</p>
                                        </div>
                                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-indigo-600 transition">
                                            <ArrowUpRight size={16} />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}