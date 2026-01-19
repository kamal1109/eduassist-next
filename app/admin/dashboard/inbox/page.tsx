"use client";

import { useState, useEffect } from "react";
import {
    Inbox, Mail, Phone, Trash2, CheckCircle,
    Search, RefreshCw, ChevronDown, CheckCircle2,
    MessageSquare,
    AlertCircle,
    MessageCircle // Icon WhatsApp
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function InboxPage() {
    // --- STATE ---
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // 'all' | 'unread'
    const [search, setSearch] = useState("");
    const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);

    // --- EFFECT ---
    useEffect(() => {
        fetchMessages();
    }, []);

    // --- LOGIC ---
    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Yakin ingin menghapus pesan ini secara permanen?")) return;

        setMessages(prev => prev.filter(m => m.id !== id));
        if (selectedMsgId === id) setSelectedMsgId(null);

        await supabase.from('contacts').delete().eq('id', id);
    };

    const toggleRead = async (id: string, currentStatus: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        setMessages(msgs => msgs.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m));
        await supabase.from('contacts').update({ is_read: !currentStatus }).eq('id', id);
    };

    // --- HELPER FORMAT WHATSAPP ---
    const openWhatsApp = (phoneNumber: string, name: string) => {
        // Bersihkan karakter non-angka
        let cleanNumber = phoneNumber.replace(/\D/g, "");
        // Ubah 08... jadi 628...
        if (cleanNumber.startsWith("0")) {
            cleanNumber = "62" + cleanNumber.substring(1);
        }

        const message = `Halo ${name}, saya admin EduAssist. Terkait pesan Anda di website kami:`;
        const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, "_blank");
    };

    // Filter Logic
    const filteredMessages = messages.filter(msg => {
        const matchFilter = filter === 'all' ? true : !msg.is_read;
        const matchSearch =
            msg.name?.toLowerCase().includes(search.toLowerCase()) ||
            msg.email?.toLowerCase().includes(search.toLowerCase()) ||
            msg.message?.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const unreadCount = messages.filter(m => !m.is_read).length;

    // --- RENDER ---
    return (
        <div className="flex flex-col h-full bg-[#F8FAFC]">

            {/* 1. HEADER */}
            <div className="bg-white border-b border-slate-200 p-4 sm:p-6 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Inbox Leads
                        {unreadCount > 0 && (
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full border border-red-200">
                                {unreadCount} Baru
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">Kelola pesan masuk dari calon klien.</p>
                </div>
                <button
                    onClick={fetchMessages}
                    className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
                >
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            {/* 2. TOOLBAR */}
            <div className="bg-white border-b border-slate-200 p-4 shrink-0 flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari nama, email, atau isi pesan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                    <button
                        onClick={() => setFilter("all")}
                        className={`flex-1 sm:flex-none px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Semua Pesan
                    </button>
                    <button
                        onClick={() => setFilter("unread")}
                        className={`flex-1 sm:flex-none px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${filter === 'unread' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Belum Dibaca
                    </button>
                </div>
            </div>

            {/* 3. MESSAGE LIST */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                        <p className="text-sm font-medium">Memuat inbox...</p>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 mx-auto max-w-2xl">
                        <div className="p-4 bg-white rounded-full shadow-sm">
                            <Inbox size={32} className="text-slate-300" />
                        </div>
                        <p className="font-medium">Tidak ada pesan ditemukan</p>
                    </div>
                ) : (
                    <div className="grid gap-3 max-w-5xl mx-auto">
                        {filteredMessages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => setSelectedMsgId(selectedMsgId === msg.id ? null : msg.id)}
                                className={`
                                    group relative bg-white border rounded-xl transition-all duration-200 cursor-pointer overflow-hidden
                                    ${selectedMsgId === msg.id ? 'ring-2 ring-indigo-500 shadow-md border-transparent' : 'hover:shadow-md hover:border-indigo-200 border-slate-200'}
                                    ${!msg.is_read ? 'bg-indigo-50/10' : ''}
                                `}
                            >
                                {!msg.is_read && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                                )}

                                <div className="p-4 sm:p-5 flex items-start gap-4">
                                    <div className={`
                                        shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center font-black text-sm sm:text-lg border-2
                                        ${!msg.is_read ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-500 border-slate-200'}
                                    `}>
                                        {msg.name ? msg.name.charAt(0).toUpperCase() : "?"}
                                    </div>

                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
                                            <h3 className={`text-sm sm:text-base font-bold truncate pr-2 ${!msg.is_read ? 'text-slate-900' : 'text-slate-600'}`}>
                                                {msg.name}
                                            </h3>
                                            <span className="text-[10px] sm:text-xs font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
                                                {new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                <span className="hidden sm:inline">•</span>
                                                {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-500 font-medium truncate mb-2">{msg.email}</p>

                                        {selectedMsgId !== msg.id && (
                                            <p className={`text-xs sm:text-sm line-clamp-1 ${!msg.is_read ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                                                {msg.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-slate-300">
                                        <ChevronDown size={20} className={`transition-transform duration-300 ${selectedMsgId === msg.id ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {selectedMsgId === msg.id && (
                                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 pl-[4rem] sm:pl-[5rem] animate-in slide-in-from-top-2 duration-200">

                                        <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-200 mb-4 shadow-sm">
                                            {msg.message}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                            {/* TOMBOL CHAT WHATSAPP */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openWhatsApp(msg.phone, msg.name);
                                                }}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-emerald-600 transition shadow-sm"
                                            >
                                                <MessageCircle size={16} /> Chat WhatsApp
                                            </button>

                                            <a
                                                href={`mailto:${msg.email}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition"
                                            >
                                                <Mail size={16} /> <span className="hidden sm:inline">Balas Email</span>
                                            </a>

                                            <div className="flex-1"></div>

                                            <button
                                                onClick={(e) => toggleRead(msg.id, msg.is_read, e)}
                                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition border ${msg.is_read
                                                    ? 'bg-slate-100 text-slate-500 border-transparent hover:bg-slate-200'
                                                    : 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100'
                                                    }`}
                                            >
                                                {msg.is_read ? (
                                                    <><AlertCircle size={16} /> Tandai Belum Baca</>
                                                ) : (
                                                    <><CheckCircle2 size={16} /> Tandai Selesai</>
                                                )}
                                            </button>

                                            <button
                                                onClick={(e) => handleDelete(msg.id, e)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100"
                                                title="Hapus Pesan"
                                            >
                                                <Trash2 size={18} />
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