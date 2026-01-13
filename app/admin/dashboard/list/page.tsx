"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../../lib/supabase";
import {
    FileText, Calendar, Clock, Edit3, Trash2,
    CheckCircle, AlertCircle, Archive, ArrowLeft, Plus,
    Search, Filter, Eye, BarChart2, X, AlertTriangle, User, Tag,
    Menu, ChevronRight, Grid3x3, List, MoreVertical
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ListArtikel() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("Semua");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

    // State untuk Modal Delete
    const [deleteModal, setDeleteModal] = useState({ show: false, id: "", title: "" });

    useEffect(() => {
        fetchArticles();
    }, []);

    async function fetchArticles() {
        setLoading(true);
        const { data } = await supabase
            .from('articles')
            .select('*')
            .order('published_at', { ascending: false });

        if (data) setArticles(data);
        setLoading(false);
    }

    // --- LOGIKA SEARCH & FILTER ---
    const filteredArticles = useMemo(() => {
        return articles.filter(art => {
            const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                art.slug.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = statusFilter === "Semua" || art.status === statusFilter;
            return matchesSearch && matchesFilter;
        });
    }, [articles, searchQuery, statusFilter]);

    // --- STATS DATA ---
    const stats = {
        total: articles.length,
        draft: articles.filter(a => a.status === 'Draft').length,
        published: articles.filter(a => a.status === 'Published').length
    };

    // --- ACTION: DELETE ---
    async function confirmDelete() {
        const { error } = await supabase.from('articles').delete().eq('id', deleteModal.id);
        if (!error) {
            setArticles(articles.filter(a => a.id !== deleteModal.id));
            setDeleteModal({ show: false, id: "", title: "" });
        }
    }

    const getStatusStyle = (status: string, date: string) => {
        const isScheduled = new Date(date) > new Date();
        if (status === 'Published' && isScheduled) return "bg-amber-50 text-amber-600 border-amber-100";
        if (status === 'Published') return "bg-emerald-50 text-emerald-600 border-emerald-100";
        if (status === 'Draft') return "bg-slate-50 text-slate-500 border-slate-100";
        return "bg-rose-50 text-rose-600 border-rose-100"; // Archived
    };

    const truncateText = (text: string, length: number) => {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6 lg:p-12">
            <div className="max-w-7xl mx-auto">

                {/* HEADER SECTION */}
                <div className="mb-8 md:mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:translate-x-1 transition-transform">
                                    <ArrowLeft className="w-4 h-4" /> Dashboard
                                </Link>
                                <ChevronRight className="w-3 h-3" />
                                <span>Konten Hub</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight">Konten <span className="text-indigo-600">Hub</span></h1>
                                <div className="md:hidden flex items-center gap-2 bg-white p-2 rounded-xl">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-indigo-50 text-indigo-600" : "text-slate-400"}`}
                                    >
                                        <Grid3x3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-2 rounded-lg ${viewMode === "list" ? "bg-indigo-50 text-indigo-600" : "text-slate-400"}`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <Link
                            href="/admin/dashboard"
                            className="w-full md:w-auto bg-indigo-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-[1.5rem] font-bold md:font-black flex items-center justify-center gap-2 shadow-lg md:shadow-xl shadow-indigo-100 hover:bg-slate-950 transition-all hover:-translate-y-1 active:scale-95"
                        >
                            <Plus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
                            <span className="text-sm md:text-base">TULIS ARTIKEL</span>
                        </Link>
                    </div>

                    {/* 📊 SUMMARY CARDS - Grid untuk mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10">
                        {[
                            { label: 'Total Konten', val: stats.total, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { label: 'Masih Draft', val: stats.draft, icon: Edit3, color: 'text-amber-600', bg: 'bg-amber-50' },
                            { label: 'Live di Web', val: stats.published, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                        ].map((s, i) => (
                            <div key={i} className="bg-white p-4 md:p-6 rounded-xl md:rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className={`w-10 h-10 md:w-14 md:h-14 ${s.bg} ${s.color} rounded-lg md:rounded-2xl flex items-center justify-center`}>
                                    <s.icon className="w-5 h-5 md:w-7 md:h-7" />
                                </div>
                                <div>
                                    <p className="text-xs md:text-[10px] font-bold md:font-black uppercase tracking-wide md:tracking-widest text-slate-400">{s.label}</p>
                                    <p className="text-xl md:text-3xl font-black text-slate-900">{s.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 🔍 SEARCH & FILTER BAR */}
                    <div className="bg-white p-4 rounded-xl md:rounded-[2rem] border border-slate-100 shadow-sm mb-4 md:mb-6">
                        <div className="relative mb-4 md:mb-0 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors w-4 h-4 md:w-5 md:h-5" />
                            <input
                                type="text"
                                placeholder="Cari judul artikel..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl md:rounded-2xl py-3 md:py-4 pl-10 md:pl-14 pr-4 outline-none focus:ring-2 focus:ring-indigo-600/10 font-bold text-sm md:text-base text-slate-600"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                            <div className="flex bg-slate-50 p-1 rounded-lg md:rounded-2xl flex-wrap md:flex-nowrap">
                                {['Semua', 'Published', 'Draft', 'Archived'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setStatusFilter(f)}
                                        className={`px-3 md:px-6 py-2 rounded-lg md:rounded-xl text-xs font-bold md:font-black uppercase tracking-wide md:tracking-widest transition-all flex-1 text-center ${statusFilter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 📁 CONTENT AREA */}
                {loading ? (
                    <div className="bg-white rounded-xl md:rounded-[3rem] border border-slate-100 shadow-sm p-8 md:p-20 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="font-bold text-slate-300 text-sm md:text-base tracking-wider">Memuat Data...</p>
                    </div>
                ) : filteredArticles.length > 0 ? (
                    viewMode === "list" ? (
                        /* LIST VIEW */
                        <div className="bg-white rounded-xl md:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="hidden md:table-header-group">
                                        <tr className="bg-slate-50/50 border-b border-slate-100 text-xs md:text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <th className="p-4 md:p-8">Informasi Artikel</th>
                                            <th className="p-4 md:p-8">Status</th>
                                            <th className="p-4 md:p-8">Performa</th>
                                            <th className="p-4 md:p-8 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredArticles.map((art) => (
                                            <tr key={art.id} className="hover:bg-indigo-50/20 transition-colors group">
                                                <td className="p-4 md:p-8">
                                                    <div className="flex items-start gap-3 md:gap-4">
                                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-lg md:rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                                                            {art.visual_type === 'image' && art.visual_value ? (
                                                                <img src={art.visual_value} className="w-full h-full object-cover" alt={art.title} />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                    <FileText className="w-4 h-4 md:w-5 md:h-5" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold md:font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors text-sm md:text-base">
                                                                {truncateText(art.title, window.innerWidth < 768 ? 50 : 100)}
                                                            </p>
                                                            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                                <span className="flex items-center gap-1">
                                                                    <Tag className="w-2 h-2 md:w-3 md:h-3" /> {art.category || 'Umum'}
                                                                </span>
                                                                <span className="text-slate-200 hidden md:inline">|</span>
                                                                <span className="flex items-center gap-1">
                                                                    <User className="w-2 h-2 md:w-3 md:h-3" /> {art.author || 'Admin'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 md:p-8">
                                                    <div className={`inline-flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full border text-xs font-bold md:font-black uppercase tracking-wide ${getStatusStyle(art.status, art.published_at)}`}>
                                                        {new Date(art.published_at) > new Date() && art.status === 'Published' ? (
                                                            <>
                                                                <Clock className="w-2 h-2 md:w-3 md:h-3" /> Terjadwal
                                                            </>
                                                        ) : art.status}
                                                    </div>
                                                    <p className="text-xs text-slate-400 mt-1 md:mt-2 font-bold flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                                        {new Date(art.published_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: window.innerWidth < 768 ? undefined : 'numeric'
                                                        })}
                                                    </p>
                                                </td>
                                                <td className="p-4 md:p-8 hidden md:table-cell">
                                                    <div className="flex items-center gap-2 md:gap-4">
                                                        <div>
                                                            <p className="text-sm md:text-xs font-black text-slate-900">{art.views_count || 0}</p>
                                                            <p className="text-xs md:text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Views</p>
                                                        </div>
                                                        <BarChart2 className="w-4 h-4 md:w-5 md:h-5 text-slate-200" />
                                                    </div>
                                                </td>
                                                <td className="p-4 md:p-8">
                                                    <div className="flex justify-start md:justify-center gap-2">
                                                        <Link
                                                            href={`/artikel/${art.id}`}
                                                            target="_blank"
                                                            className="p-2 md:p-3 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-lg md:rounded-xl transition-all shadow-sm"
                                                            title="Lihat"
                                                        >
                                                            <Eye className="w-4 h-4 md:w-5 md:h-5" />
                                                        </Link>
                                                        <Link
                                                            href={`/admin/dashboard/edit/${art.id}`}
                                                            className="p-2 md:p-3 bg-slate-50 text-slate-400 hover:bg-amber-500 hover:text-white rounded-lg md:rounded-xl transition-all shadow-sm"
                                                            title="Edit"
                                                        >
                                                            <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => setDeleteModal({ show: true, id: art.id, title: art.title })}
                                                            className="p-2 md:p-3 bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white rounded-lg md:rounded-xl transition-all shadow-sm"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        /* GRID VIEW untuk mobile */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {filteredArticles.map((art) => (
                                <div key={art.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                        {art.visual_type === 'image' && art.visual_value ? (
                                            <img
                                                src={art.visual_value}
                                                className="w-full h-full object-cover"
                                                alt={art.title}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(art.status, art.published_at)}`}>
                                                {art.status}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-slate-900 mb-2 text-sm line-clamp-2">
                                            {truncateText(art.title, 60)}
                                        </h3>
                                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(art.published_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short'
                                                })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {art.views_count || 0} views
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t pt-3">
                                            <Link
                                                href={`/artikel/${art.id}`}
                                                target="_blank"
                                                className="text-xs text-indigo-600 font-bold hover:text-indigo-700"
                                            >
                                                Lihat Artikel
                                            </Link>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/admin/dashboard/edit/${art.id}`}
                                                    className="p-1.5 bg-slate-100 rounded-lg text-slate-600 hover:bg-amber-500 hover:text-white transition-colors"
                                                >
                                                    <Edit3 className="w-3 h-3" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteModal({ show: true, id: art.id, title: art.title })}
                                                    className="p-1.5 bg-slate-100 rounded-lg text-slate-600 hover:bg-rose-500 hover:text-white transition-colors"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="bg-white rounded-xl md:rounded-[3rem] border border-slate-100 shadow-sm p-8 md:p-20 text-center">
                        <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 text-slate-300">
                            <FileText className="w-full h-full" />
                        </div>
                        <p className="text-slate-400 font-bold text-sm md:text-base mb-2">Belum ada artikel yang ditemukan</p>
                        <p className="text-xs md:text-sm text-slate-500 mb-6 max-w-md mx-auto">
                            {searchQuery ? `Tidak ditemukan artikel dengan kata kunci "${searchQuery}"` : 'Mulai dengan menulis artikel pertama Anda'}
                        </p>
                        <Link
                            href="/admin/dashboard"
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-900 transition-all"
                        >
                            <Plus className="w-4 h-4" /> Tulis Artikel Baru
                        </Link>
                    </div>
                )}
            </div>

            {/* ⚠️ MODAL DELETE CUSTOM (Human Friendly) */}
            <AnimatePresence>
                {deleteModal.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteModal({ show: false, id: "", title: "" })}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white w-full max-w-md rounded-xl md:rounded-[3rem] p-6 md:p-10 shadow-2xl border border-slate-100"
                        >
                            <button
                                onClick={() => setDeleteModal({ show: false, id: "", title: "" })}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-50 text-rose-500 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner">
                                <AlertTriangle className="w-8 h-8 md:w-10 md:h-10" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 text-center mb-3 md:mb-4 tracking-tight leading-tight">
                                Hapus Artikel?
                            </h2>
                            <p className="text-sm md:text-base text-slate-600 text-center mb-2">
                                "{truncateText(deleteModal.title, 60)}"
                            </p>
                            <p className="text-slate-500 text-center text-xs md:text-sm font-medium mb-6 md:mb-10 leading-relaxed px-2">
                                Tindakan ini permanen. Artikel yang dihapus tidak dapat dipulihkan kembali ke database.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmDelete}
                                    className="w-full bg-rose-500 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold md:font-black shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all active:scale-95"
                                >
                                    IYA, HAPUS SEKARANG
                                </button>
                                <button
                                    onClick={() => setDeleteModal({ show: false, id: "", title: "" })}
                                    className="w-full bg-slate-50 text-slate-400 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold md:font-black hover:bg-slate-100 transition-all active:scale-95"
                                >
                                    BATALKAN
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}