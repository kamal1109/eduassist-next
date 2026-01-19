"use client";

import { useState, useEffect } from "react";
import {
    Inbox, Mail, Phone, Trash2, CheckCircle,
    Search, RefreshCw, ChevronDown, CheckCircle2,
    AlertCircle,
    MessageCircle,
    Loader2
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// INISIALISASI CLIENT DENGAN VARIABEL YANG SUDAH NEXT_PUBLIC
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export default function InboxPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            // Menarik data menggunakan client admin (bypass RLS)
            const { data, error } = await supabaseAdmin
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Yakin ingin menghapus pesan ini?")) return;

        try {
            const { error } = await supabaseAdmin.from('contacts').delete().eq('id', id);
            if (error) throw error;
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selectedMsgId === id) setSelectedMsgId(null);
        } catch (err) {
            alert("Gagal menghapus pesan.");
        }
    };

    const toggleRead = async (id: string, currentStatus: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const { error } = await supabaseAdmin
                .from('contacts')
                .update({ is_read: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            setMessages(msgs => msgs.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m));
        } catch (err) {
            alert("Gagal memperbarui status pesan.");
        }
    };

    const openWhatsApp = (phoneNumber: string, name: string) => {
        let cleanNumber = phoneNumber.replace(/\D/g, "");
        if (cleanNumber.startsWith("0")) cleanNumber = "62" + cleanNumber.substring(1);
        const message = `Halo ${name}, saya admin EduAssist. Terkait pesanan Anda:`;
        window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, "_blank");
    };

    const filteredMessages = messages.filter(msg => {
        const matchFilter = filter === 'all' ? true : !msg.is_read;
        const searchLower = search.toLowerCase();
        const matchSearch =
            msg.name?.toLowerCase().includes(searchLower) ||
            msg.email?.toLowerCase().includes(searchLower) ||
            msg.message?.toLowerCase().includes(searchLower);
        return matchFilter && matchSearch;
    });

    const unreadCount = messages.filter(m => !m.is_read).length;

    return (
        <div className="flex flex-col h-full bg-[#F8FAFC]">
            {/* --- HEADER --- */}
            <div className="bg-white border-b border-slate-200 p-4 sm:p-6 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Inbox Leads
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full animate-pulse">
                                {unreadCount} BARU
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-500 text-xs font-medium">Manajemen pesanan masuk dari klien.</p>
                </div>
                <button
                    onClick={fetchMessages}
                    className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all active:scale-95"
                >
                    <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} /> Update Data
                </button>
            </div>

            {/* --- TOOLBAR --- */}
            <div className="bg-white border-b border-slate-200 p-4 shrink-0 flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari pembeli..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-50 outline-none transition"
                    />
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
                    <button
                        onClick={() => setFilter("all")}
                        className={`flex-1 sm:flex-none px-6 py-2 text-xs font-black rounded-xl transition-all ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        SEMUA
                    </button>
                    <button
                        onClick={() => setFilter("unread")}
                        className={`flex-1 sm:flex-none px-6 py-2 text-xs font-black rounded-xl transition-all ${filter === 'unread' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        BELUM BACA
                    </button>
                </div>
            </div>

            {/* --- MESSAGE LIST --- */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
                        <Loader2 className="animate-spin text-indigo-600 w-10 h-10" />
                        <p className="text-xs font-bold tracking-widest">SINKRONISASI DATABASE...</p>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 mx-auto max-w-2xl">
                        <Inbox size={48} className="text-slate-200" />
                        <p className="font-bold text-sm">Tidak ada pesan yang masuk.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 max-w-5xl mx-auto">
                        {filteredMessages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => setSelectedMsgId(selectedMsgId === msg.id ? null : msg.id)}
                                className={`
                                    group relative bg-white border rounded-[2rem] transition-all duration-300 cursor-pointer overflow-hidden
                                    ${selectedMsgId === msg.id ? 'ring-4 ring-indigo-50 border-indigo-200 shadow-xl' : 'hover:shadow-lg border-slate-100'}
                                    ${!msg.is_read ? 'bg-indigo-50/20' : ''}
                                `}
                            >
                                <div className="p-5 sm:p-6 flex items-start gap-4">
                                    <div className={`
                                        shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg border-2
                                        ${!msg.is_read ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400 border-slate-100'}
                                    `}>
                                        {msg.name ? msg.name.charAt(0).toUpperCase() : "?"}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
                                            <h3 className={`text-base font-black truncate ${!msg.is_read ? 'text-slate-900' : 'text-slate-500'}`}>
                                                {msg.name}
                                            </h3>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-1 rounded-md">
                                                {new Date(msg.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-indigo-500 font-bold mb-2">{msg.email}</p>
                                        <p className={`text-sm line-clamp-1 ${!msg.is_read ? 'text-slate-700 font-bold' : 'text-slate-400 font-medium'}`}>
                                            {msg.message}
                                        </p>
                                    </div>
                                    <ChevronDown size={20} className={`text-slate-300 transition-transform ${selectedMsgId === msg.id ? 'rotate-180' : ''}`} />
                                </div>

                                {selectedMsgId === msg.id && (
                                    <div className="px-6 pb-8 pl-[4.5rem] animate-in slide-in-from-top-4 duration-300">
                                        <div className="bg-slate-50 p-6 rounded-[2rem] rounded-tl-none text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-100 mb-6 shadow-inner">
                                            {msg.message}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openWhatsApp(msg.phone, msg.name); }}
                                                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl text-xs font-black hover:bg-emerald-600 transition shadow-lg shadow-emerald-100 active:scale-95"
                                            >
                                                <MessageCircle size={18} /> HUBUNGI VIA WHATSAPP
                                            </button>

                                            <div className="flex-1"></div>

                                            <button
                                                onClick={(e) => toggleRead(msg.id, msg.is_read, e)}
                                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all ${msg.is_read
                                                        ? 'bg-slate-100 text-slate-500'
                                                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100'
                                                    }`}
                                            >
                                                {msg.is_read ? "TANDAI BELUM BACA" : "SELESAIKAN PESANAN"}
                                            </button>

                                            <button
                                                onClick={(e) => handleDelete(msg.id, e)}
                                                className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}