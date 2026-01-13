"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import {
    Plus, ShoppingBag, FileText, LogOut, Trash2,
    Image as ImageIcon, Video, X, Globe, Eye,
    CheckCircle2, AlertCircle, Edit3, Settings,
    Smartphone, Monitor, Clock, Sparkles, Layers,
    Search, MessageCircle, ArrowRight, ShieldCheck,
    Menu, X as XIcon, Home, Database, User
} from "lucide-react";
import Link from "next/link";
// IMPORT KONEKSI SUPABASE
import { supabase } from "../../../lib/supabase";

const ICON_LIST = ["GraduationCap", "BookOpen", "Search", "MessageCircle", "Target", "Zap", "ShieldCheck", "PenTool", "Users"];

type ArticleStatus = "Draft" | "Review" | "Published" | "Archived";

export default function AdminDashboard() {
    const [visualType, setVisualType] = useState<"icon" | "image" | "video">("icon");
    const [selectedIcon, setSelectedIcon] = useState("GraduationCap");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [youtubeLink, setYoutubeLink] = useState("");
    const [isPreviewMobile, setIsPreviewMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // --- STATE ARTIKEL ---
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState<ArticleStatus>("Draft");
    const [focusKeyword, setFocusKeyword] = useState("");
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDesc, setSeoDesc] = useState("");

    // Fitur Penjadwalan (Scheduling) - Default waktu sekarang
    const [publishedAt, setPublishedAt] = useState(new Date().toISOString().slice(0, 16));

    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- AUTO LOGIC (SEO & READING TIME) ---
    const readingTime = useMemo(() => {
        const words = content.trim().split(/\s+/).length;
        return Math.ceil(words / 200) || 1;
    }, [content]);

    const seoChecklist = useMemo(() => {
        if (!focusKeyword) return [];
        const kw = focusKeyword.toLowerCase();
        return [
            { label: "Keyword di Judul Utama", pass: title.toLowerCase().includes(kw) },
            { label: "Keyword di Meta Deskripsi", pass: seoDesc.toLowerCase().includes(kw) },
            { label: "Keyword di Paragraf Pertama", pass: content.toLowerCase().includes(kw) },
            { label: "Panjang Konten Cukup (Min 100 kata)", pass: content.trim().split(/\s+/).length >= 100 }
        ];
    }, [focusKeyword, title, seoDesc, content]);

    useEffect(() => {
        const generatedSlug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        setSlug(generatedSlug);
        if (!seoTitle) setSeoTitle(title);
    }, [title, seoTitle]);

    const getYouTubeID = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // MEMBERSIHKAN KUNING: Menggunakan tipe data yang benar
    const processImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const MAX_W = 800;
                let w = img.width, h = img.height;
                if (w > MAX_W) { h *= MAX_W / w; w = MAX_W; }
                canvas.width = w; canvas.height = h;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0, w, h);
                setSelectedImage(canvas.toDataURL("image/jpeg", 0.7));
            };
            img.src = ev.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    // --- FUNGSI SIMPAN KE SUPABASE ---
    const save = async () => {
        if (!title) {
            alert("Judul tidak boleh kosong!");
            return;
        }

        setIsLoading(true);

        // Tentukan nilai visual berdasarkan tipe yang dipilih
        let visualValue = visualType === "icon" ? selectedIcon :
            visualType === "image" ? selectedImage :
                getYouTubeID(youtubeLink);

        const { error } = await supabase
            .from('articles')
            .insert([
                {
                    title,
                    slug,
                    excerpt,
                    content,
                    status,
                    visual_type: visualType,
                    visual_value: visualValue,
                    focus_keyword: focusKeyword,
                    seo_title: seoTitle,
                    seo_desc: seoDesc,
                    category: "Responden", // Default kategori
                    author: "Tim EduAssist",
                    badge: "Terbaru",
                    published_at: new Date(publishedAt).toISOString() // FITUR JADWAL
                }
            ]);

        if (error) {
            alert("Gagal menyimpan ke database: " + error.message);
        } else {
            alert(`Artikel berhasil disimpan sebagai ${status}! Jadwal: ${publishedAt}`);
            // Reset Form setelah berhasil
            setTitle(""); setExcerpt(""); setContent(""); setFocusKeyword("");
            setSeoTitle(""); setSeoDesc(""); setSelectedImage(null); setYoutubeLink("");
        }
        setIsLoading(false);
    };

    const DynamicIcon = ({ name }: { name: string }) => {
        const IconComponent = (LucideIcons as any)[name];
        return IconComponent ? <IconComponent className="w-4 h-4 md:w-5 md:h-5" /> : null;
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Header */}
            <header className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg bg-indigo-50 text-indigo-600"
                >
                    {sidebarOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <h1 className="font-black text-indigo-600 text-lg">Admin Panel</h1>
                <div className="w-10"></div> {/* Spacer untuk alignment */}
            </header>

            <div className="flex flex-col md:flex-row">
                {/* Sidebar - Mobile Drawer */}
                <aside className={`
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    md:translate-x-0 md:relative fixed inset-y-0 left-0 z-40
                    w-64 bg-white border-r p-6 md:p-8 flex flex-col gap-4 
                    transition-transform duration-300 md:transition-none
                    md:w-64 md:h-screen md:sticky md:top-0
                `}>
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                        <h2 className="text-xl md:text-2xl font-black text-indigo-600 tracking-tighter">ADMIN PANEL</h2>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden p-2 rounded-lg bg-slate-100"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl font-bold bg-indigo-600 text-white shadow-lg"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Home className="w-4 h-4 md:w-5 md:h-5" /> Dashboard
                        </Link>
                        <Link
                            href="/admin/dashboard/list"
                            className="flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl font-bold text-slate-600 hover:bg-indigo-50 transition"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Layers className="w-4 h-4 md:w-5 md:h-5" /> Daftar Artikel
                        </Link>
                        <Link
                            href="/admin/dashboard/input"
                            className="flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl font-bold text-slate-600 hover:bg-indigo-50 transition"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <FileText className="w-4 h-4 md:w-5 md:h-5" /> Input Artikel
                        </Link>
                        <Link
                            href="/admin/dashboard/users"
                            className="flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl font-bold text-slate-600 hover:bg-indigo-50 transition"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <User className="w-4 h-4 md:w-5 md:h-5" /> Manajemen User
                        </Link>
                        <Link
                            href="/admin/dashboard/analytics"
                            className="flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl font-bold text-slate-600 hover:bg-indigo-50 transition"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Database className="w-4 h-4 md:w-5 md:h-5" /> Analytics
                        </Link>
                    </div>

                    <div className="mt-auto space-y-2">
                        <Link
                            href="/artikel"
                            className="flex items-center gap-3 p-3 md:p-4 text-slate-600 font-bold hover:bg-indigo-50 rounded-xl md:rounded-2xl transition"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Globe className="w-4 h-4 md:w-5 md:h-5" /> Lihat Website
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-3 p-3 md:p-4 text-red-500 font-bold hover:bg-red-50 rounded-xl md:rounded-2xl transition"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <LogOut className="w-4 h-4 md:w-5 md:h-5" /> Keluar
                        </Link>
                    </div>
                </aside>

                {/* Overlay untuk mobile sidebar */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content Area */}
                <main className="flex-1 p-4 md:p-8 lg:p-12">
                    <div className="grid lg:grid-cols-12 gap-6 md:gap-10">
                        {/* --- LEFT: EDITOR --- */}
                        <section className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
                            {/* Header */}
                            <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[3.5rem] border shadow-sm border-slate-100">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-10">
                                    <div>
                                        <h1 className="font-black text-xl md:text-2xl text-slate-900 tracking-tight">Input Artikel Baru</h1>
                                        <p className="text-slate-500 text-sm mt-1">Buat konten edukasi untuk website EduAssist</p>
                                    </div>
                                    <div className="flex bg-slate-100 p-1 rounded-xl md:rounded-2xl w-full md:w-auto">
                                        {(["Draft", "Review", "Published", "Archived"] as ArticleStatus[]).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setStatus(s)}
                                                className={`flex-1 md:flex-none px-3 md:px-4 py-2 text-xs font-bold md:font-black rounded-lg md:rounded-xl transition-all ${status === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                                            >
                                                {s.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Form Input */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Judul Konten</label>
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Strategi Lolos Sidang Skripsi..."
                                            className="w-full p-4 md:p-5 bg-slate-50 border-none rounded-xl md:rounded-3xl outline-none focus:ring-2 focus:ring-indigo-600/10 font-bold text-lg md:text-xl"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Focus Keyword (SEO)</label>
                                            <input
                                                value={focusKeyword}
                                                onChange={(e) => setFocusKeyword(e.target.value)}
                                                placeholder="Contoh: Olah Data SPSS"
                                                className="w-full p-3 md:p-4 bg-slate-50 border-none rounded-xl md:rounded-2xl outline-none text-sm font-bold text-indigo-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Auto Slug</label>
                                            <input
                                                value={slug}
                                                readOnly
                                                className="w-full p-3 md:p-4 bg-slate-50/50 border-none rounded-xl md:rounded-2xl text-xs font-medium text-slate-400 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Ringkasan (Excerpt)</label>
                                        <textarea
                                            value={excerpt}
                                            onChange={(e) => setExcerpt(e.target.value)}
                                            placeholder="Tampilkan ringkasan di halaman depan..."
                                            className="w-full p-3 md:p-4 bg-slate-50 border-none rounded-xl md:rounded-2xl outline-none text-sm h-[80px] resize-none"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Isi Artikel Panjang</label>
                                            <span className="text-xs text-slate-500 font-bold">⏱️ {readingTime} Menit Baca</span>
                                        </div>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Tulis konten edukasi mendalam di sini..."
                                            className="w-full p-4 md:p-8 bg-slate-50 border-none rounded-xl md:rounded-[2.5rem] outline-none text-slate-600 min-h-[200px] md:min-h-[350px] leading-relaxed text-sm md:text-base"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SEO Preview Box */}
                            <div className="bg-slate-900 p-6 md:p-10 rounded-2xl md:rounded-[3.5rem] text-white shadow-xl">
                                <h3 className="font-black text-lg md:text-xl mb-6 flex items-center gap-3">
                                    <Globe className="text-indigo-400 w-5 h-5" /> SEO Preview
                                </h3>
                                <div className="space-y-4 md:space-y-6">
                                    <div className="p-4 md:p-6 bg-white/5 rounded-xl md:rounded-3xl border border-white/10">
                                        <div className="text-indigo-400 text-xs md:text-sm mb-1 truncate">eduassist.id › artikel › {slug}</div>
                                        <div className="text-blue-400 text-base md:text-xl font-medium mb-2 truncate">{seoTitle || 'Judul SEO'}</div>
                                        <div className="text-slate-400 text-xs md:text-sm line-clamp-2">{seoDesc || 'Deskripsi meta...'}</div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                        <input
                                            value={seoTitle}
                                            onChange={(e) => setSeoTitle(e.target.value)}
                                            className="w-full p-3 md:p-4 bg-white/10 border border-white/10 rounded-xl md:rounded-2xl outline-none text-white text-sm md:text-base"
                                            placeholder="Meta Title..."
                                        />
                                        <textarea
                                            value={seoDesc}
                                            onChange={(e) => setSeoDesc(e.target.value)}
                                            className="w-full p-3 md:p-4 bg-white/10 border border-white/10 rounded-xl md:rounded-2xl outline-none h-20 resize-none text-white text-sm md:text-base"
                                            placeholder="Meta Description..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* --- RIGHT: PREVIEW & TOOLS --- */}
                        <section className="lg:col-span-4 flex flex-col gap-6">
                            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[3rem] border border-slate-100 shadow-sm md:sticky md:top-6">
                                {/* Preview Toggle */}
                                <div className="flex justify-between items-center mb-4 md:mb-6">
                                    <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider text-slate-600">Live Preview</h3>
                                    <div className="flex bg-slate-100 p-1 rounded-lg md:rounded-xl">
                                        <button
                                            onClick={() => setIsPreviewMobile(false)}
                                            className={`p-1.5 md:p-2 rounded-md md:rounded-lg transition ${!isPreviewMobile ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                                        >
                                            <Monitor className="w-3 h-3 md:w-4 md:h-4" />
                                        </button>
                                        <button
                                            onClick={() => setIsPreviewMobile(true)}
                                            className={`p-1.5 md:p-2 rounded-md md:rounded-lg transition ${isPreviewMobile ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                                        >
                                            <Smartphone className="w-3 h-3 md:w-4 md:h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Preview Container */}
                                <div className={`mx-auto transition-all duration-500 overflow-hidden border border-slate-50 bg-[#F8FAFC] rounded-xl md:rounded-[2rem] ${isPreviewMobile ? 'w-[220px] md:w-[260px]' : 'w-full'}`}>
                                    <div className="p-3 md:p-4 flex flex-col">
                                        <div className="aspect-video bg-indigo-100 rounded-lg md:rounded-2xl mb-3 md:mb-4 flex items-center justify-center text-indigo-300 overflow-hidden">
                                            {visualType === "icon" ? <DynamicIcon name={selectedIcon} /> : (selectedImage ? <img src={selectedImage} className="w-full h-full object-cover" alt="Preview" /> : <ImageIcon className="w-6 h-6 md:w-8 md:h-8" />)}
                                        </div>
                                        <div className="font-bold md:font-black text-slate-900 leading-tight mb-1 md:mb-2 text-sm">{title || 'Judul Artikel'}</div>
                                        <div className="text-xs md:text-[10px] text-slate-400 line-clamp-2 mb-3 md:mb-4">{excerpt}</div>
                                        <div className="mt-auto pt-2 md:pt-3 border-t flex justify-between items-center text-[8px] md:text-[9px] font-bold md:font-black text-slate-300">
                                            <span>{readingTime} MIN READ</span>
                                            <div className="w-3 h-3 md:w-4 md:h-4 bg-indigo-600 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Schedule Feature */}
                                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-100">
                                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 md:mb-3 block flex items-center gap-1 md:gap-2">
                                        <Clock className="text-indigo-600 w-3 h-3 md:w-4 md:h-4" /> Jadwal Publikasi
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={publishedAt}
                                        onChange={(e) => setPublishedAt(e.target.value)}
                                        className="w-full p-3 md:p-4 bg-slate-50 border-none rounded-xl md:rounded-2xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-600/10"
                                    />
                                    <p className="text-xs text-slate-400 mt-1 md:mt-2 italic">*Hanya berlaku untuk status Published.</p>
                                </div>

                                {/* SEO Assistant */}
                                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 md:mb-4 flex items-center gap-1 md:gap-2">
                                        <Sparkles className="text-indigo-600 w-3 h-3 md:w-4 md:h-4" /> SEO Assistant
                                    </h4>
                                    <ul className="space-y-2 md:space-y-3">
                                        {seoChecklist.map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-2 md:gap-3">
                                                {item.pass ? <CheckCircle2 className="text-green-500 w-4 h-4" /> : <AlertCircle className="text-slate-200 w-4 h-4" />}
                                                <span className={`text-xs font-medium ${item.pass ? 'text-slate-700' : 'text-slate-300'}`}>{item.label}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Media Visual Selector */}
                                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t">
                                    <div className="flex bg-slate-100 p-1 rounded-lg md:rounded-2xl mb-3 md:mb-4">
                                        {(['icon', 'image', 'video'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setVisualType(t)}
                                                className={`flex-1 py-1.5 md:py-2 text-[10px] md:text-[9px] font-bold md:font-black rounded-md md:rounded-xl uppercase ${visualType === t ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>

                                    {visualType === "icon" && (
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            {ICON_LIST.map(ic => (
                                                <button
                                                    key={ic}
                                                    onClick={() => setSelectedIcon(ic)}
                                                    className={`p-2 md:p-3 border-2 rounded-lg md:rounded-xl flex justify-center transition ${selectedIcon === ic ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-50 text-slate-300'}`}
                                                >
                                                    <DynamicIcon name={ic} />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {visualType === "image" && (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="aspect-video bg-slate-50 border-2 border-dashed rounded-xl md:rounded-2xl mb-4 flex flex-col items-center justify-center cursor-pointer overflow-hidden text-slate-400"
                                        >
                                            {selectedImage ? (
                                                <img src={selectedImage} className="w-full h-full object-cover" alt="Upload" />
                                            ) : (
                                                <>
                                                    <ImageIcon className="w-6 h-6 md:w-8 md:h-8" />
                                                    <span className="text-xs font-bold mt-1">Upload Gambar</span>
                                                </>
                                            )}
                                            <input type="file" hidden ref={fileInputRef} onChange={processImage} accept="image/*" />
                                        </div>
                                    )}

                                    {visualType === "video" && (
                                        <input
                                            value={youtubeLink}
                                            onChange={(e) => setYoutubeLink(e.target.value)}
                                            placeholder="YouTube Link"
                                            className="w-full p-3 md:p-4 bg-slate-50 border rounded-xl md:rounded-2xl outline-none text-sm mb-4"
                                        />
                                    )}
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={save}
                                    disabled={isLoading}
                                    className="w-full mt-6 md:mt-8 bg-indigo-600 text-white py-3 md:py-5 rounded-xl md:rounded-[2rem] font-bold md:font-black shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? "MEMPROSES..." : "SIMPAN ARTIKEL"}
                                </button>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}