"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    BarChart3, FileText, Eye,
    Plus, TrendingUp, Edit3, ArrowUpRight, Calendar, Loader2, MessageSquare
} from "lucide-react"; // SUDAH DIPERBAIKI
import { supabase } from "@/lib/supabase";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export default function DashboardHome() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalViews: 0,
        totalArticles: 0,
        publishedCount: 0,
        draftCount: 0,
        inboxCount: 0
    });
    const [recentArticles, setRecentArticles] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/admin/login');
                return;
            }
            fetchDashboardData();
        };
        checkAuth();
    }, [router]);

    async function fetchDashboardData() {
        setLoading(true);
        try {
            const { data: articles } = await supabase
                .from('articles')
                .select('id, title, status, view_count, published_at, category')
                .order('published_at', { ascending: false });

            const { count: inboxCount } = await supabase
                .from('contacts')
                .select('*', { count: 'exact', head: true });

            if (articles) {
                const totalViews = articles.reduce((sum, item) => sum + (item.view_count || 0), 0);
                const totalArticles = articles.length;
                const publishedCount = articles.filter(a => a.status === 'Published').length;
                const draftCount = articles.filter(a => a.status === 'Draft').length;

                setStats({
                    totalViews,
                    totalArticles,
                    publishedCount,
                    draftCount,
                    inboxCount: inboxCount || 0
                });

                setRecentArticles(articles.slice(0, 5));

                const topArticles = [...articles]
                    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                    .slice(0, 5)
                    .map(art => ({
                        name: art.title.length > 12 ? art.title.substring(0, 12) + '..' : art.title,
                        views: art.view_count || 0,
                        fullTitle: art.title
                    }));

                setChartData(topArticles);
            }
        } catch (error) {
            console.error("Dashboard error:", error);
        } finally {
            setLoading(false);
        }
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 text-white p-3 shadow-xl rounded-xl border border-slate-700">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Top Content</p>
                    <p className="text-xs font-bold mb-1">{payload[0].payload.fullTitle}</p>
                    <p className="text-sm text-indigo-400 font-black">
                        {payload[0].value.toLocaleString()} Views
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full min-h-full bg-[#F8FAFC]">
            <div className="p-4 sm:p-8 max-w-7xl mx-auto pb-24 pt-8 sm:pt-12">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Dashboard <span className="text-indigo-600">Overview</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            Ringkasan performa website EduAssist Anda hari ini.
                        </p>
                    </div>

                    <Link
                        href="/admin/dashboard/input"
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <Plus size={20} strokeWidth={3} />
                        <span>Tulis Artikel</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="animate-spin text-indigo-600 w-12 h-12 mb-4" />
                        <p className="text-slate-400 font-bold text-xs tracking-[0.2em] uppercase">Sinkronisasi Data...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Eye size={20} /></div>
                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">TOTAL</span>
                                </div>
                                <div className="text-3xl font-black text-slate-900">{stats.totalViews.toLocaleString()}</div>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Pembaca Artikel</p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><MessageSquare size={20} /></div>
                                    <Link href="/admin/dashboard/inbox" className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg hover:bg-emerald-100 transition">CEK INBOX</Link>
                                </div>
                                <div className="text-3xl font-black text-slate-900">{stats.inboxCount}</div>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Total Leads Masuk</p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><FileText size={20} /></div>
                                </div>
                                <div className="text-3xl font-black text-slate-900">{stats.publishedCount}</div>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Artikel Live</p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Edit3 size={20} /></div>
                                </div>
                                <div className="text-3xl font-black text-slate-900">{stats.draftCount}</div>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Draft Konten</p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="font-black text-slate-900 text-lg">Performa Konten</h3>
                                        <p className="text-slate-400 text-xs font-medium">Visualisasi 5 artikel dengan pembaca terbanyak</p>
                                    </div>
                                    <BarChart3 className="text-slate-300" size={24} />
                                </div>

                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                            <Bar dataKey="views" radius={[8, 8, 0, 0]} barSize={40}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#c7d2fe'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-bold text-lg">Update Terbaru</h3>
                                    <Link href="/admin/dashboard/list" className="text-[10px] font-black bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition">SEMUA</Link>
                                </div>

                                <div className="space-y-5">
                                    {recentArticles.map((art) => (
                                        <div key={art.id} className="flex items-center justify-between group">
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold truncate pr-4 group-hover:text-indigo-400 transition cursor-default">{art.title}</h4>
                                                <p className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-tighter">
                                                    {new Date(art.published_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} • {art.category}
                                                </p>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <span className="block text-xs font-black text-indigo-400">{art.view_count}</span>
                                                <span className="text-[8px] font-bold text-slate-600 uppercase">Views</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 pt-6 border-t border-white/5">
                                    <Link href="/admin/dashboard/analytics" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-indigo-600 transition-all group">
                                        <span className="text-xs font-bold">Buka Full Analytics</span>
                                        <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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