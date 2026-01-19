"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";
import {
    Image as ImageIcon, Globe,
    Clock, UploadCloud, Layers, Tag, PlayCircle,
    ChevronRight, Loader2, Lock
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const ICON_LIST = ["GraduationCap", "BookOpen", "Search", "MessageCircle", "Target", "Zap", "ShieldCheck", "PenTool", "Users"];
const CATEGORIES = [
    "Edukasi Umum", "Mahasiswa", "Dosen & Peneliti",
    "Bisnis & UMKM", "Studi Kasus", "Teknis & Metode", "Info Jasa"
];

type ArticleStatus = "Draft" | "Review" | "Published" | "Archived";

export default function InputArtikel() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // --- STATE FORM ---
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Edukasi Umum");
    const [badge, setBadge] = useState("");
    const [status, setStatus] = useState<ArticleStatus>("Draft");

    // --- STATE SEO ---
    const [focusKeyword, setFocusKeyword] = useState("");
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDesc, setSeoDesc] = useState("");
    const [publishedAt, setPublishedAt] = useState("");

    // --- STATE VISUAL ---
    const [visualType, setVisualType] = useState<"icon" | "image" | "video">("icon");
    const [selectedIcon, setSelectedIcon] = useState("GraduationCap");

    // Image Handling
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [youtubeLink, setYoutubeLink] = useState("");

    // 1. AUTH GUARD: Pastikan hanya admin yang bisa buka halaman ini
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/admin/login");
            } else {
                setIsCheckingAuth(false);
            }
        };
        checkAuth();
    }, [router]);

    // Auto-Generate Slug
    useEffect(() => {
        const generateSlug = (text: string) => {
            return text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
        };
        if (title) setSlug(generateSlug(title));
    }, [title]);

    // --- LOGIKA HELPER ---
    const wordCount = useMemo(() => content.trim().split(/\s+/).filter(word => word.length > 0).length, [content]);
    const readingTime = useMemo(() => Math.ceil(wordCount / 200) || 1, [wordCount]);

    const getYouTubeID = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const DynamicIcon = ({ name }: { name: string }) => {
        const IconComponent = (LucideIcons as any)[name];
        return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
    };

    // --- SUBMIT ---
    const handlePublish = async () => {
        if (!title) return alert("Judul wajib diisi!");
        if (!content) return alert("Isi artikel wajib diisi!");
        if (visualType === 'image' && !imageFile) return alert("Silakan pilih gambar terlebih dahulu!");

        setIsSaving(true);

        try {
            let finalVisualValue = "";

            // 1. Proses Visual (Image/Icon/Video)
            if (visualType === "image" && imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('article-images').upload(fileName, imageFile);
                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage.from('article-images').getPublicUrl(fileName);
                finalVisualValue = publicUrlData.publicUrl;
            } else if (visualType === "icon") {
                finalVisualValue = selectedIcon;
            } else if (visualType === "video") {
                finalVisualValue = getYouTubeID(youtubeLink) || "";
            }

            // 2. Insert ke Database
            const { error: insertError } = await supabase
                .from('articles')
                .insert([{
                    title,
                    slug,
                    excerpt: excerpt || content.substring(0, 150).replace(/<[^>]*>?/gm, '') + "...",
                    content,
                    status,
                    category,
                    badge: badge || category,
                    visual_type: visualType,
                    visual_value: finalVisualValue,
                    cover_image: visualType === 'image' ? finalVisualValue : null,
                    focus_keyword: focusKeyword,
                    seo_title: seoTitle || title,
                    seo_description: seoDesc || excerpt,
                    published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
                    author: "Admin EduAssist",
                    view_count: 0
                }]);

            if (insertError) throw insertError;

            alert("Artikel berhasil diterbitkan! 🚀");
            router.push('/admin/dashboard/list');

        } catch (error: any) {
            console.error("Error saving:", error);
            alert("Gagal menyimpan: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
                <Loader2 className="animate-spin text-indigo-600 w-10 h-10 mb-4" />
                <p className="text-slate-400 font-bold text-xs tracking-widest">VALIDASI OTORITAS...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-full bg-[#F8FAFC]">
            {/* Header Sticky */}
            <div className="sticky top-0 z-20 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200 px-4 py-4 sm:px-8 sm:py-6">
                <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/admin/dashboard" className="hover:text-indigo-600 font-bold transition-colors">Dashboard</Link>
                    <ChevronRight size={14} />
                    <span className="text-indigo-600 font-black">Tulis Artikel</span>
                </div>
            </div>

            <div className="p-4 sm:p-8 max-w-7xl mx-auto pb-24">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Konten Strategis</h1>
                        <p className="text-slate-500 text-sm mt-1">Publikasikan materi edukasi terbaru untuk audiens Anda.</p>
                    </div>
                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                        {(["Draft", "Review", "Published"] as ArticleStatus[]).map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatus(s)}
                                className={`px-5 py-2 text-xs font-black rounded-xl transition-all ${status === s ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {s.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                            {/* Judul */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Judul Konten Utama</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Masukkan judul artikel yang memikat..."
                                    className="w-full p-5 bg-slate-50 border-none rounded-2xl font-black text-2xl text-slate-900 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-300"
                                />
                            </div>

                            {/* Kategori */}
                            <div className="grid md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                <div>
                                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3 block flex items-center gap-2">
                                        <Layers className="w-3 h-3" /> Target Kategori
                                    </label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-bold text-slate-700 cursor-pointer focus:ring-4 focus:ring-indigo-50 transition-all">
                                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3 block flex items-center gap-2">
                                        <Tag className="w-3 h-3" /> Label Badge
                                    </label>
                                    <input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Contoh: Populer" className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-50 transition-all" />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Deskripsi Singkat (Preview)</label>
                                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Ringkasan isi artikel untuk ditampilkan di kartu blog..." className="w-full p-5 bg-slate-50 border-none rounded-2xl text-sm h-28 resize-none leading-relaxed focus:ring-4 focus:ring-indigo-50 transition-all" />
                            </div>

                            {/* Content Editor */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Badan Artikel (Full Content)</label>
                                    <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-md text-slate-500 font-bold flex items-center gap-1"><Clock size={12} /> {readingTime} MIN READ</span>
                                </div>
                                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tulis pengetahuan mendalam Anda di sini..." className="w-full p-8 bg-slate-50 border-none rounded-[2.5rem] text-slate-700 min-h-[500px] leading-loose focus:ring-4 focus:ring-indigo-50 resize-y" />
                            </div>
                        </div>

                        {/* SEO Box */}
                        <div className="bg-slate-900 p-8 md:p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                <Globe size={150} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Lock className="text-indigo-400" size={24} /> SEO Optimization</h3>
                                <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 mb-8 backdrop-blur-md">
                                    <div className="text-indigo-400 text-xs font-bold mb-2 uppercase tracking-widest">eduassist.id › artikel › {slug || '...'}</div>
                                    <div className="text-blue-400 text-2xl font-bold mb-2 truncate">{seoTitle || title || 'Judul Meta Google'}</div>
                                    <div className="text-slate-400 text-sm line-clamp-2 leading-relaxed opacity-80">{seoDesc || excerpt || 'Meta description akan otomatis diambil dari ringkasan jika kosong...'}</div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Custom Meta Title</label>
                                        <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl text-sm text-white focus:border-indigo-500 outline-none transition-all" placeholder="Judul khusus hasil pencarian" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Focus Keyword</label>
                                        <input value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl text-sm text-indigo-400 font-bold focus:border-indigo-500 outline-none transition-all" placeholder="Kata kunci utama" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-24 space-y-8">
                            <div>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Media & Publikasi</h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block flex items-center gap-2"><Clock size={14} /> Atur Jadwal</label>
                                        <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-600 focus:ring-4 focus:ring-indigo-50 outline-none" />
                                    </div>

                                    <div className="border-t border-slate-50 pt-6">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Visualisasi Utama</label>
                                        <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-6 border border-slate-100">
                                            {(['icon', 'image', 'video'] as const).map((t) => (
                                                <button key={t} onClick={() => setVisualType(t)} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${visualType === t ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
                                            ))}
                                        </div>

                                        {/* Dynamic Preview Area */}
                                        <div className="min-h-[150px]">
                                            {visualType === "icon" && (
                                                <div className="grid grid-cols-3 gap-3">
                                                    {ICON_LIST.map(ic => (
                                                        <button key={ic} onClick={() => setSelectedIcon(ic)} className={`p-4 border rounded-2xl flex justify-center items-center transition-all aspect-square ${selectedIcon === ic ? 'border-indigo-600 bg-indigo-50 text-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100 text-slate-300 hover:bg-slate-50'}`}>
                                                            <DynamicIcon name={ic} />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {visualType === "image" && (
                                                <div onClick={() => fileInputRef.current?.click()} className="aspect-square bg-slate-50 border-4 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 text-slate-300 overflow-hidden relative group transition-all">
                                                    {imagePreview ? (
                                                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-3">
                                                            <UploadCloud size={40} strokeWidth={1} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Pilih Gambar</span>
                                                        </div>
                                                    )}
                                                    <input type="file" hidden ref={fileInputRef} onChange={handleImageSelect} accept="image/*" />
                                                </div>
                                            )}

                                            {visualType === "video" && (
                                                <div className="space-y-4">
                                                    {youtubeLink && getYouTubeID(youtubeLink) && (
                                                        <div className="aspect-video rounded-2xl overflow-hidden relative shadow-lg">
                                                            <img src={`https://img.youtube.com/vi/${getYouTubeID(youtubeLink)}/hqdefault.jpg`} className="w-full h-full object-cover" alt="YT" />
                                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><PlayCircle className="text-white" size={48} /></div>
                                                        </div>
                                                    )}
                                                    <input value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-50 transition-all" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handlePublish} disabled={isSaving} className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black shadow-2xl shadow-indigo-100 hover:bg-slate-900 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                                {isSaving ? <Loader2 className="animate-spin" size={24} /> : <><UploadCloud size={20} /> PUBLISH CONTENT</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}