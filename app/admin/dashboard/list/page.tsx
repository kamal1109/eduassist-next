"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase"; // Import aman pakai alias
import {
    FileText, Calendar, Edit3, Trash2,
    Plus, Search, Eye, AlertTriangle, User, Tag,
    ChevronRight, Grid3x3, List, Layers, Loader2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
    "Semua", "Edukasi Umum", "Mahasiswa", "Dosen & Peneliti",
    "Bisnis & UMKM", "Studi Kasus", "Teknis & Metode", "Info Jasa"
];

export default function ListArtikel() {
    // --- STATE DATA ---
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("Semua");
    const [categoryFilter, setCategoryFilter] = useState("Semua");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");

    const [deleteModal, setDeleteModal] = useState({ show: false, id: "", title: "" });

    useEffect(() => {
        fetchArticles();
    }, []);

    async function fetchArticles() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

            if (error) throw error;
            if (data) setArticles(data);

        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoading(false);
        }
    }

    // Hitung Statistik Real-time dari data lokal
    const stats = useMemo(() => ({
        total: articles.length,
        draft: articles.filter(a => a.status === 'Draft').length,
        published: articles.filter(a => a.status === 'Published').length
    }), [articles]);

    // Filter Logic
    const filteredArticles = useMemo(() => {
        return articles.filter(art => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                (art.title?.toLowerCase() || "").includes(searchLower) ||
                (art.category?.toLowerCase() || "").includes(searchLower);
            const matchesStatus = statusFilter === "Semua" || art.status === statusFilter;
            const matchesCategory = categoryFilter === "Semua" || art.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [articles, searchQuery, statusFilter, categoryFilter]);

    async function confirmDelete() {
        if (!deleteModal.id) return;

        const { error } = await supabase.from('articles').delete().eq('id', deleteModal.id);

        if (!error) {
            setArticles(prev => prev.filter(a => a.id !== deleteModal.id));
            setDeleteModal({ show: false, id: "", title: "" });
        } else {
            alert("Gagal menghapus artikel.");
        }
    }

    const getStatusBadge = (status: string) => {
        if (status === 'Published') return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase border border-emerald-200">Published</span>;
        if (status === 'Draft') return <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase border border-slate-200">Draft</span>;
        return <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-[10px] font-bold uppercase border border-rose-200">{status}</span>;
    };

    return (
        <div className="w-full min-h-full bg-[#F8FAFC]">

            {/* --- HEADER STICKY --- */}
            <div className="sticky top-0 z-20 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200 px-4 py-4 sm:px-8 sm:py-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <Link href="/admin/dashboard" className="font-bold hover:text-indigo-600">Dashboard</Link>
                            <ChevronRight size={14} />
                            <span className="text-indigo-600 font-bold">List Artikel</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Database Konten</h1>
                    </div>
                    <Link href="/admin/dashboard/input" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-900 transition shadow-lg shadow-indigo-100 text-sm">
                        <Plus size={18} strokeWidth={3} /> Tulis Baru
                    </Link>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="p-4 sm:p-8 max-w-7xl mx-auto pb-24">

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center sm:text-left">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Total</p>
                        <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.total}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center sm:text-left">
                        <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest">Live</p>
                        <p className="text-xl sm:text-2xl font-black text-emerald-600">{stats.published}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center sm:text-left">
                        <p className="text-[10px] uppercase font-bold text-amber-500 tracking-widest">Draft</p>
                        <p className="text-xl sm:text-2xl font-black text-amber-600">{stats.draft}</p>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center mb-8 sticky top-32 z-10">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari judul..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border-none outline-none cursor-pointer min-w-[120px]"
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border-none outline-none cursor-pointer min-w-[100px]"
                        >
                            <option value="Semua">Semua Status</option>
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                        </select>
                        <div className="flex bg-slate-50 p-1 rounded-xl shrink-0">
                            <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-white shadow text-indigo-600" : "text-slate-400"}`}><List size={16} /></button>
                            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-white shadow text-indigo-600" : "text-slate-400"}`}><Grid3x3 size={16} /></button>
                        </div>
                    </div>
                </div>

                {/* --- DATA CONTENT --- */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-600" />
                        <p className="font-bold text-sm">Mengambil data...</p>
                    </div>
                ) : filteredArticles.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 border-dashed">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <Layers size={32} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-1">Data Tidak Ditemukan</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                            {articles.length === 0
                                ? "Database artikel Anda masih kosong. Silakan buat artikel pertama."
                                : "Tidak ada artikel yang cocok dengan filter pencarian Anda."}
                        </p>
                        {articles.length === 0 && (
                            <Link href="/admin/dashboard/input" className="text-indigo-600 font-bold hover:underline">
                                + Buat Artikel Sekarang
                            </Link>
                        )}
                    </div>
                ) : (
                    // TAMPILKAN DATA (LIST / GRID)
                    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                        {filteredArticles.map((item) => (
                            <div key={item.id} className={`bg-white border border-slate-100 rounded-2xl p-4 md:p-6 hover:border-indigo-200 hover:shadow-md transition group ${viewMode === "list" ? "flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6" : ""}`}>

                                {/* Gambar/Icon */}
                                <div className={`flex-shrink-0 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 ${viewMode === "list" ? "w-full md:w-20 h-32 md:h-20" : "w-full h-40 mb-4"}`}>
                                    {item.visual_type === 'image' && item.visual_value ? (
                                        <img src={item.visual_value} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <FileText className="text-slate-300 w-8 h-8" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getStatusBadge(item.status)}
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1 truncate">
                                            <Tag size={10} /> {item.category}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 truncate group-hover:text-indigo-600 transition">
                                        {item.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><Eye size={12} /> {item.view_count || 0}</span>
                                        <span className="flex items-center gap-1"><User size={12} /> {item.author || "Admin"}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className={`flex gap-2 ${viewMode === "grid" ? "mt-4 border-t pt-4 w-full justify-end" : "w-full md:w-auto justify-end"}`}>
                                    <Link href={`/admin/dashboard/edit/${item.id}`} className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition border border-transparent hover:border-amber-100">
                                        <Edit3 size={18} />
                                    </Link>
                                    <button
                                        onClick={() => setDeleteModal({ show: true, id: item.id, title: item.title })}
                                        className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition border border-transparent hover:border-rose-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL HAPUS (Z-Index Tinggi) */}
            <AnimatePresence>
                {deleteModal.show && (
                    <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-2xl">
                            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-center font-black text-lg text-slate-900 mb-2">Hapus Artikel Ini?</h3>
                            <p className="text-center text-sm text-slate-500 mb-6 line-clamp-2">"{deleteModal.title}" akan dihapus permanen dari database.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteModal({ show: false, id: "", title: "" })} className="flex-1 py-3 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition">Batal</button>
                                <button onClick={confirmDelete} className="flex-1 py-3 font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition shadow-lg shadow-rose-200">Hapus</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}