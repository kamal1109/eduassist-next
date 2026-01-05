"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../../lib/supabase";
import {
    FileText, Calendar, Clock, Edit3, Trash2,
    CheckCircle, AlertCircle, Archive, ArrowLeft, Plus,
    Search, Filter, Eye, BarChart2, X, AlertTriangle, User, Tag
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ListArtikel() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("Semua");

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

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12">
            <div className="max-w-7xl mx-auto">

                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-indigo-600 font-bold mb-4 text-sm hover:translate-x-1 transition-transform">
                            <ArrowLeft size={16} /> Dashboard
                        </Link>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Konten <span className="text-indigo-600">Hub.</span></h1>
                    </div>
                    <Link href="/admin/dashboard" className="bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-2 shadow-xl shadow-indigo-100 hover:bg-slate-950 transition-all hover:-translate-y-1">
                        <Plus size={20} strokeWidth={3} /> TULIS ARTIKEL
                    </Link>
                </div>

                {/* 📊 SUMMARY CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {[
                        { label: 'Total Konten', val: stats.total, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Masih Draft', val: stats.draft, icon: Edit3, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Live di Web', val: stats.published, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                    ].map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
                            <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center`}><s.icon size={28} /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                                <p className="text-3xl font-black text-slate-900">{s.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 🔍 SEARCH & FILTER BAR */}
                <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Cari judul atau slug artikel..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-indigo-600/10 font-bold text-slate-600"
                        />
                    </div>
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl">
                        {['Semua', 'Published', 'Draft', 'Archived'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 📁 TABLE CONTENT */}
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <th className="p-8">Informasi Artikel</th>
                                    <th className="p-8">Status</th>
                                    <th className="p-8">Performa</th>
                                    <th className="p-8 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={4} className="p-20 text-center font-black text-slate-300 tracking-widest uppercase">Memuat Data...</td></tr>
                                ) : filteredArticles.length > 0 ? (
                                    filteredArticles.map((art) => (
                                        <tr key={art.id} className="hover:bg-indigo-50/20 transition-colors group">
                                            <td className="p-8">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                                                        {art.visual_type === 'image' ? <img src={art.visual_value} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><FileText size={20} /></div>}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{art.title}</p>
                                                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                            <span className="flex items-center gap-1"><Tag size={12} /> {art.category || 'Umum'}</span>
                                                            <span className="text-slate-200">|</span>
                                                            <span className="flex items-center gap-1"><User size={12} /> {art.author || 'Admin'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(art.status, art.published_at)}`}>
                                                    {new Date(art.published_at) > new Date() && art.status === 'Published' ? <><Clock size={12} /> Terjadwal</> : art.status}
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-2 font-bold flex items-center gap-1"><Calendar size={10} /> {new Date(art.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="text-xs font-black text-slate-900">{art.views_count || 0}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Views</p>
                                                    </div>
                                                    <BarChart2 size={20} className="text-slate-200" />
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex justify-center gap-2">
                                                    <Link href={`/artikel/${art.id}`} target="_blank" className="p-3 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm"><Eye size={18} /></Link>
                                                    <Link href={`/admin/dashboard/edit/${art.id}`} className="p-3 bg-slate-50 text-slate-400 hover:bg-amber-500 hover:text-white rounded-xl transition-all shadow-sm"><Edit3 size={18} /></Link>
                                                    <button onClick={() => setDeleteModal({ show: true, id: art.id, title: art.title })} className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={4} className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs italic">Belum ada artikel. <Link href="/admin/dashboard" className="text-indigo-600 underline">Tulis sekarang ✍️</Link></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ⚠️ MODAL DELETE CUSTOM (Human Friendly) */}
            <AnimatePresence>
                {deleteModal.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModal({ show: false, id: "", title: "" })} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-slate-100">
                            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"><AlertTriangle size={40} /></div>
                            <h2 className="text-2xl font-black text-slate-900 text-center mb-4 tracking-tight leading-tight">Hapus Artikel <br />"<span className="text-rose-600">{deleteModal.title}</span>"?</h2>
                            <p className="text-slate-500 text-center text-sm font-medium mb-10 leading-relaxed px-4">Tindakan ini permanen. Artikel yang dihapus tidak dapat dipulihkan kembali ke database.</p>
                            <div className="flex flex-col gap-3">
                                <button onClick={confirmDelete} className="w-full bg-rose-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all active:scale-95">IYA, HAPUS SEKARANG</button>
                                <button onClick={() => setDeleteModal({ show: false, id: "", title: "" })} className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-black hover:bg-slate-100 transition-all active:scale-95 tracking-widest text-[10px]">BATALKAN</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}