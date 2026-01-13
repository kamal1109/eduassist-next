"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";
import {
    FileText, LogOut, Image as ImageIcon, Globe,
    CheckCircle2, AlertCircle, Smartphone, Monitor, Clock, Sparkles, MessageCircle, ArrowLeft, Layers, Search, X, Video, Plus, Target, Zap, ShieldCheck, PenTool, Users, GraduationCap, BookOpen,
    PlayCircle, ArrowRight, Menu, Home, ChevronRight, Save, Eye
} from "lucide-react";
import Link from "next/link";
import { supabase } from "../../../../../lib/supabase";

const ICON_LIST = ["GraduationCap", "BookOpen", "Search", "MessageCircle", "Target", "Zap", "ShieldCheck", "PenTool", "Users"];
type ArticleStatus = "Draft" | "Review" | "Published" | "Archived";

export default function EditArtikel() {
    const params = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
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
    const [publishedAt, setPublishedAt] = useState("");
    const [visualType, setVisualType] = useState<"icon" | "image" | "video">("icon");
    const [selectedIcon, setSelectedIcon] = useState("GraduationCap");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [youtubeLink, setYoutubeLink] = useState("");
    const [isPreviewMobile, setIsPreviewMobile] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- AMBIL DATA DARI DB ---
    useEffect(() => {
        async function fetchInitialData() {
            try {
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (data) {
                    setTitle(data.title || "");
                    setSlug(data.slug || "");
                    setExcerpt(data.excerpt || "");
                    setContent(data.content || "");
                    setStatus(data.status as ArticleStatus);
                    setFocusKeyword(data.focus_keyword || "");
                    setSeoTitle(data.seo_title || "");
                    setSeoDesc(data.seo_desc || "");

                    const dateObj = new Date(data.published_at);
                    setPublishedAt(dateObj.toISOString().slice(0, 16));

                    setVisualType(data.visual_type as any || "icon");
                    if (data.visual_type === 'icon') setSelectedIcon(data.visual_value);
                    if (data.visual_type === 'image') setSelectedImage(data.visual_value);
                    if (data.visual_type === 'video') setYoutubeLink(`https://www.youtube.com/watch?v=${data.visual_value}`);
                }
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchInitialData();
    }, [params.id]);

    // --- LOGIKA SEO & TIME ---
    const wordCount = useMemo(() => content.trim().split(/\s+/).filter(word => word.length > 0).length, [content]);
    const readingTime = useMemo(() => Math.ceil(wordCount / 200) || 1, [wordCount]);

    const seoChecklist = useMemo(() => {
        if (!focusKeyword) return [];
        const kw = focusKeyword.toLowerCase();
        return [
            { label: "Keyword di Judul", pass: title.toLowerCase().includes(kw) },
            { label: "Keyword di Deskripsi", pass: seoDesc.toLowerCase().includes(kw) },
            { label: "Keyword di Paragraf Pertama", pass: content.toLowerCase().substring(0, 300).includes(kw) },
            { label: "Panjang Konten Cukup", pass: wordCount >= 100 }
        ];
    }, [focusKeyword, title, seoDesc, content, wordCount]);

    const getYouTubeID = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

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

    const handleUpdate = async () => {
        if (!title) return alert("Judul wajib diisi!");
        setIsSaving(true);

        const visualValue = visualType === "icon" ? selectedIcon :
            visualType === "image" ? selectedImage :
                getYouTubeID(youtubeLink);

        const { error } = await supabase
            .from('articles')
            .update({
                title, excerpt, content, status,
                visual_type: visualType,
                visual_value: visualValue,
                focus_keyword: focusKeyword,
                seo_title: seoTitle,
                seo_desc: seoDesc,
                published_at: new Date(publishedAt).toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', params.id);

        if (error) {
            alert("Gagal update: " + error.message);
        } else {
            alert("Artikel berhasil diperbarui!");
            router.push("/admin/dashboard/list");
        }
        setIsSaving(false);
    };

    const DynamicIcon = ({ name }: { name: string }) => {
        const IconComponent = (LucideIcons as any)[name];
        return IconComponent ? <IconComponent className="w-4 h-4 md:w-5 md:h-5" /> : null;
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                <p className="font-bold text-indigo-600">MEMUAT DATA...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Header */}
            <header className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg bg-indigo-50 text-indigo-600"
                >
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <h1 className="font-bold text-indigo-600">Edit Artikel</h1>
                <div className="w-10"></div>
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
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl font-bold text-slate-600 hover:bg-indigo-50 transition"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Home className="w-4 h-4 md:w-5 md:h-5" /> Dashboard
                        </Link>
                        <Link
                            href="/admin/dashboard/list"
                            className="flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl font-bold bg-indigo-600 text-white shadow-lg"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Layers className="w-4 h-4 md:w-5 md:h-5" /> Kembali ke List
                        </Link>
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl font-bold text-slate-600 hover:bg-indigo-50 transition"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Plus className="w-4 h-4 md:w-5 md:h-5" /> Tulis Baru
                        </Link>
                    </div>

                    <div className="mt-auto space-y-2">
                        <Link
                            href="/artikel"
                            target="_blank"
                            className="flex items-center gap-3 p-3 md:p-4 text-slate-600 font-bold hover:bg-indigo-50 rounded-xl md:rounded-2xl transition"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Eye className="w-4 h-4 md:w-5 md:h-5" /> Lihat Website
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

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-12 overflow-y-auto">
                    {/* Breadcrumb */}
                    <div className="mb-6 md:mb-8">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-indigo-600 font-bold">
                                <ArrowLeft className="w-4 h-4" /> Dashboard
                            </Link>
                            <ChevronRight className="w-3 h-3" />
                            <Link href="/admin/dashboard/list" className="text-indigo-600 font-bold">List Artikel</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-slate-400">Edit Artikel</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-6 md:gap-10">
                        {/* --- LEFT: EDITOR --- */}
                        <section className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
                            {/* Form Container */}
                            <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl md:rounded-[2.5rem] border shadow-sm border-slate-100">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-10">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2">Edit Konten</h3>
                                        <p className="text-slate-500 text-sm">Perbarui artikel Anda di sini</p>
                                    </div>
                                    <div className="flex bg-slate-100 p-1 rounded-lg md:rounded-xl w-full md:w-auto">
                                        {(["Draft", "Review", "Published", "Archived"] as ArticleStatus[]).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setStatus(s)}
                                                className={`flex-1 md:flex-none px-3 md:px-4 py-2 text-xs font-bold md:font-black rounded-md md:rounded-lg transition-all ${status === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {s.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Judul */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 block">Judul Konten</label>
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full p-4 md:p-5 bg-slate-50 border-none rounded-xl md:rounded-2xl outline-none font-bold text-lg md:text-xl text-slate-900 focus:ring-2 focus:ring-indigo-100"
                                            placeholder="Masukkan judul artikel..."
                                        />
                                    </div>

                                    {/* Keyword & Slug */}
                                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 block">Focus Keyword</label>
                                            <input
                                                value={focusKeyword}
                                                onChange={(e) => setFocusKeyword(e.target.value)}
                                                placeholder="Contoh: Olah Data SPSS"
                                                className="w-full p-3 md:p-4 bg-slate-50 border-none rounded-xl md:rounded-2xl outline-none text-sm font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 block">Slug URL</label>
                                            <input
                                                value={slug}
                                                readOnly
                                                className="w-full p-3 md:p-4 bg-slate-50/50 border-none rounded-xl md:rounded-2xl text-xs md:text-sm font-medium text-slate-400 italic cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    {/* Excerpt */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 block">Ringkasan (Excerpt)</label>
                                        <textarea
                                            value={excerpt}
                                            onChange={(e) => setExcerpt(e.target.value)}
                                            placeholder="Ringkasan yang akan ditampilkan di halaman depan..."
                                            className="w-full p-3 md:p-4 bg-slate-50 border-none rounded-xl md:rounded-2xl outline-none text-sm h-24 resize-none leading-relaxed"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Isi Artikel</label>
                                            <span className="text-xs text-slate-500 font-bold">⏱️ {readingTime} Menit Baca • {wordCount} kata</span>
                                        </div>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Tulis isi artikel lengkap di sini..."
                                            className="w-full p-4 md:p-6 lg:p-8 bg-slate-50 border-none rounded-xl md:rounded-[2rem] outline-none text-slate-600 min-h-[300px] md:min-h-[400px] leading-relaxed text-sm md:text-base"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SEO Preview */}
                            <div className="bg-slate-900 p-4 md:p-6 lg:p-10 rounded-xl md:rounded-[2.5rem] text-white shadow-lg">
                                <h3 className="text-lg md:text-xl font-black mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                                    <Globe className="text-indigo-400 w-5 h-5 md:w-6 md:h-6" /> SEO Snippet Preview
                                </h3>
                                <div className="space-y-4 md:space-y-6">
                                    <div className="p-4 md:p-6 bg-white/5 rounded-xl md:rounded-2xl border border-white/10">
                                        <div className="text-indigo-400 text-xs mb-1 truncate">eduassist.id › artikel › {slug}</div>
                                        <div className="text-blue-400 text-base md:text-xl font-bold md:font-black mb-2 truncate">{seoTitle || title || 'Judul SEO'}</div>
                                        <div className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{seoDesc || excerpt || 'Deskripsi meta...'}</div>
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
                                            className="w-full p-3 md:p-4 bg-white/10 border border-white/10 rounded-xl md:rounded-2xl outline-none h-20 md:h-24 resize-none text-white text-sm md:text-base"
                                            placeholder="Meta Description..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* --- RIGHT: TOOLS & PREVIEW --- */}
                        <section className="lg:col-span-4 flex flex-col gap-6">
                            <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-[2.5rem] border border-slate-100 shadow-sm md:sticky md:top-6">
                                {/* Preview Header */}
                                <div className="flex justify-between items-center mb-4 md:mb-6">
                                    <h3 className="text-xs md:text-sm font-bold md:font-black text-slate-600 uppercase tracking-wide">Preview</h3>
                                    <div className="flex bg-slate-100 p-1 rounded-lg md:rounded-xl">
                                        <button
                                            onClick={() => setIsPreviewMobile(false)}
                                            className={`p-1.5 md:p-2 rounded-md md:rounded-lg transition-all ${!isPreviewMobile ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                                        >
                                            <Monitor className="w-3 h-3 md:w-4 md:h-4" />
                                        </button>
                                        <button
                                            onClick={() => setIsPreviewMobile(true)}
                                            className={`p-1.5 md:p-2 rounded-md md:rounded-lg transition-all ${isPreviewMobile ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                                        >
                                            <Smartphone className="w-3 h-3 md:w-4 md:h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Preview Card */}
                                <div className={`mx-auto bg-[#F8FAFC] border border-slate-100 rounded-xl md:rounded-2xl overflow-hidden transition-all duration-500 mb-6 ${isPreviewMobile ? 'w-[220px] md:w-[260px]' : 'w-full'}`}>
                                    <div className="p-3 md:p-4">
                                        <div className="aspect-video bg-indigo-50 rounded-lg md:rounded-xl mb-3 md:mb-4 overflow-hidden flex items-center justify-center text-indigo-200 group relative">
                                            {visualType === 'image' && selectedImage ? (
                                                <img src={selectedImage} className="w-full h-full object-cover" alt="Preview" />
                                            ) : visualType === 'video' && youtubeLink ? (
                                                <>
                                                    <img
                                                        src={`https://img.youtube.com/vi/${getYouTubeID(youtubeLink)}/hqdefault.jpg`}
                                                        className="w-full h-full object-cover brightness-75"
                                                        alt="YT Preview"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <PlayCircle className="text-white drop-shadow-lg w-8 h-8 md:w-10 md:h-10" />
                                                    </div>
                                                </>
                                            ) : (
                                                <DynamicIcon name={selectedIcon} />
                                            )}
                                        </div>
                                        <div className="font-bold md:font-black text-slate-900 text-sm leading-tight mb-1 md:mb-2 line-clamp-2">
                                            {title || 'Judul Artikel'}
                                        </div>
                                        <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-medium">
                                            "{excerpt || 'Ringkasan artikel...'}"
                                        </div>
                                        <div className="pt-2 md:pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-bold md:font-black text-slate-300">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-2 h-2 md:w-3 md:h-3" /> {readingTime} MENIT BACA
                                            </span>
                                            <div className="w-2 h-2 md:w-3 md:h-3 bg-indigo-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Schedule */}
                                <div className="mb-6 md:mb-8 pt-4 md:pt-6 border-t border-slate-100">
                                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2 md:mb-3 block flex items-center gap-1 md:gap-2">
                                        <Clock className="text-indigo-600 w-3 h-3 md:w-4 md:h-4" /> Jadwal Publikasi
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={publishedAt}
                                        onChange={(e) => setPublishedAt(e.target.value)}
                                        className="w-full p-3 md:p-4 bg-slate-50 border-none rounded-xl md:rounded-2xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>

                                {/* SEO Assistant */}
                                <div className="mb-6 md:mb-8 pt-4 md:pt-6 border-t border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 md:mb-4 flex items-center gap-1 md:gap-2">
                                        <Sparkles className="text-indigo-600 w-3 h-3 md:w-4 md:h-4" /> SEO Assistant
                                    </h4>
                                    <ul className="space-y-2 md:space-y-3">
                                        {seoChecklist.map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-2 md:gap-3">
                                                <div className={`p-1 rounded-full ${item.pass ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-200'}`}>
                                                    {item.pass ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                </div>
                                                <span className={`text-xs font-medium ${item.pass ? 'text-slate-700' : 'text-slate-300'}`}>
                                                    {item.label}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Media Selector */}
                                <div className="mb-6 md:mb-8 pt-4 md:pt-6 border-t border-slate-100">
                                    <div className="flex bg-slate-100 p-1 rounded-lg md:rounded-xl mb-4">
                                        {(['icon', 'image', 'video'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setVisualType(t)}
                                                className={`flex-1 py-1.5 md:py-2 text-xs font-bold md:font-black rounded-md md:rounded-lg uppercase transition-all ${visualType === t ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>

                                    {visualType === "icon" && (
                                        <div className="grid grid-cols-3 gap-2">
                                            {ICON_LIST.map(ic => (
                                                <button
                                                    key={ic}
                                                    onClick={() => setSelectedIcon(ic)}
                                                    className={`p-2 md:p-3 border-2 rounded-lg md:rounded-xl flex justify-center transition-all ${selectedIcon === ic ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-50 text-slate-300 hover:border-slate-200'}`}
                                                >
                                                    <DynamicIcon name={ic} />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {visualType === "image" && (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl md:rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden text-slate-400 hover:bg-indigo-50/30 transition-all mb-4"
                                        >
                                            {selectedImage ? (
                                                <img src={selectedImage} className="w-full h-full object-cover" alt="Thumbnail" />
                                            ) : (
                                                <>
                                                    <ImageIcon className="w-6 h-6 md:w-8 md:h-8" />
                                                    <span className="text-xs font-bold mt-2">Ganti Gambar</span>
                                                </>
                                            )}
                                            <input type="file" hidden ref={fileInputRef} onChange={processImage} accept="image/*" />
                                        </div>
                                    )}

                                    {visualType === "video" && (
                                        <input
                                            value={youtubeLink}
                                            onChange={(e) => setYoutubeLink(e.target.value)}
                                            placeholder="https://youtube.com/..."
                                            className="w-full p-3 md:p-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none text-sm text-slate-600 font-bold"
                                        />
                                    )}
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={handleUpdate}
                                    disabled={isSaving}
                                    className="w-full bg-indigo-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold md:font-black shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            MEMPROSES...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 md:w-5 md:h-5" />
                                            UPDATE ARTIKEL
                                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}