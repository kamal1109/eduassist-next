"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";
import {
    Image as ImageIcon, Globe,
    Clock, UploadCloud, Layers, Tag, PlayCircle,
    ChevronRight, Loader2
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

        setIsSaving(true);

        try {
            let finalVisualValue = "";

            // Upload Image
            if (visualType === "image" && imageFile) {
                const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`;
                const { error: uploadError } = await supabase.storage.from('article-images').upload(fileName, imageFile);
                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage.from('article-images').getPublicUrl(fileName);
                finalVisualValue = publicUrlData.publicUrl;
            } else if (visualType === "icon") {
                finalVisualValue = selectedIcon;
            } else if (visualType === "video") {
                finalVisualValue = getYouTubeID(youtubeLink) || "";
            }

            // Insert Database
            const { error: insertError } = await supabase
                .from('articles')
                .insert([{
                    title, slug, excerpt: excerpt || content.substring(0, 150).replace(/<[^>]*>?/gm, '') + "...",
                    content, status, category, badge: badge || category,
                    visual_type: visualType, visual_value: finalVisualValue,
                    cover_image: visualType === 'image' ? finalVisualValue : null,
                    focus_keyword: focusKeyword, seo_title: seoTitle || title, seo_description: seoDesc || excerpt,
                    published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
                    author: "Admin EduAssist", view_count: 0
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

    return (
        <div className="w-full min-h-full bg-[#F8FAFC]">

            {/* Header Sticky */}
            <div className="sticky top-0 z-20 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200 px-4 py-4 sm:px-8 sm:py-6">
                <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/admin/dashboard" className="hover:text-indigo-600 font-bold">Dashboard</Link>
                    <ChevronRight size={14} />
                    <span className="text-indigo-600 font-black">Input Artikel</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-4 sm:p-8 max-w-7xl mx-auto pb-24">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tulis Konten Baru</h1>
                        <p className="text-slate-500 text-sm mt-1">Bagikan wawasan baru untuk pembaca EduAssist</p>
                    </div>
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                        {(["Draft", "Review", "Published", "Archived"] as ArticleStatus[]).map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatus(s)}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${status === s ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {s.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: EDITOR */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">

                            {/* Title */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Judul Konten</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Strategi Lolos Sidang Skripsi..."
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-xl text-slate-900 focus:ring-2 focus:ring-indigo-100 transition"
                                />
                            </div>

                            {/* Kategori & Badge */}
                            <div className="grid md:grid-cols-2 gap-6 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                                <div>
                                    <label className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-2 block flex items-center gap-2">
                                        <Layers className="w-3 h-3" /> Kategori Strategis
                                    </label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 bg-white border border-indigo-200 rounded-xl outline-none text-sm font-bold text-slate-700 cursor-pointer hover:border-indigo-400 transition">
                                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-2 block flex items-center gap-2">
                                        <Tag className="w-3 h-3" /> Badge Tampilan
                                    </label>
                                    <input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Contoh: Tips" className="w-full p-3 bg-white border border-indigo-200 rounded-xl outline-none text-sm font-bold text-slate-700 placeholder:font-normal" />
                                </div>
                            </div>

                            {/* SEO Inputs */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Focus Keyword (SEO)</label>
                                    <input value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} placeholder="Contoh: Olah Data SPSS" className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-100" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Auto Slug</label>
                                    <input value={slug} readOnly className="w-full p-4 bg-slate-50/50 border-none rounded-2xl text-sm font-medium text-slate-400 italic cursor-not-allowed" />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Ringkasan (Excerpt)</label>
                                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Tampilkan ringkasan di halaman depan..." className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm h-24 resize-none leading-relaxed focus:ring-2 focus:ring-indigo-100 transition-all" />
                            </div>

                            {/* Content */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Isi Artikel Panjang</label>
                                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> {readingTime} Menit Baca</span>
                                </div>
                                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tulis konten edukasi mendalam di sini... (Support HTML dasar)" className="w-full p-6 bg-slate-50 border-none rounded-[2rem] text-slate-700 min-h-[400px] leading-relaxed focus:ring-2 focus:ring-indigo-100 resize-y" />
                            </div>
                        </div>

                        {/* SEO Preview Box */}
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-lg font-black mb-6 flex items-center gap-2"><Globe className="text-indigo-400" /> Google Search Preview</h3>
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 mb-6 backdrop-blur-sm">
                                    <div className="text-indigo-400 text-xs mb-1">eduassist.id › artikel › {slug || 'judul-artikel'}</div>
                                    <div className="text-blue-400 text-xl font-medium mb-1 truncate cursor-pointer hover:underline">{seoTitle || title || 'Judul Artikel Anda Muncul Disini'}</div>
                                    <div className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{seoDesc || excerpt || 'Deskripsi meta description yang akan muncul di hasil pencarian Google...'}</div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full p-3 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Custom Meta Title" />
                                    <input value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} className="w-full p-3 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Custom Meta Description" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: TOOLS */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-24">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Media & Publish</h3>

                            {/* Schedule */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block flex items-center gap-2"><Clock className="w-3 h-3" /> Jadwal Publikasi</label>
                                <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full p-3 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100" />
                            </div>

                            <div className="my-6 border-t border-slate-100"></div>

                            {/* Visual Selector */}
                            <div className="flex bg-slate-50 p-1 rounded-xl mb-4 border border-slate-100">
                                {(['icon', 'image', 'video'] as const).map((t) => (
                                    <button key={t} onClick={() => setVisualType(t)} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${visualType === t ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
                                ))}
                            </div>

                            {/* Visual Preview Area */}
                            <div className="mb-6">
                                {visualType === "icon" && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {ICON_LIST.map(ic => (
                                            <button key={ic} onClick={() => setSelectedIcon(ic)} className={`p-3 border rounded-xl flex justify-center items-center transition-all aspect-square ${selectedIcon === ic ? 'border-indigo-600 bg-indigo-50 text-indigo-600 ring-2 ring-indigo-100' : 'border-slate-100 text-slate-300 hover:bg-slate-50'}`}>
                                                <DynamicIcon name={ic} />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {visualType === "image" && (
                                    <div onClick={() => fileInputRef.current?.click()} className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 text-slate-400 overflow-hidden relative group transition-all">
                                        {imagePreview ? (
                                            <>
                                                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-white text-xs font-bold">Ganti Gambar</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <ImageIcon className="w-8 h-8 opacity-50" />
                                                <span className="text-[10px] font-bold uppercase">Upload Gambar</span>
                                            </div>
                                        )}
                                        <input type="file" hidden ref={fileInputRef} onChange={handleImageSelect} accept="image/*" />
                                    </div>
                                )}

                                {visualType === "video" && (
                                    <>
                                        {youtubeLink && getYouTubeID(youtubeLink) ? (
                                            <div className="aspect-video rounded-xl overflow-hidden mb-4 relative group">
                                                <img src={`https://img.youtube.com/vi/${getYouTubeID(youtubeLink)}/hqdefault.jpg`} className="w-full h-full object-cover opacity-80" alt="YT" />
                                                <div className="absolute inset-0 flex items-center justify-center"><PlayCircle className="w-10 h-10 text-white drop-shadow-md" /></div>
                                            </div>
                                        ) : null}
                                        <input value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="Paste Link YouTube..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                                    </>
                                )}
                            </div>

                            {/* Publish Button */}
                            <button onClick={handlePublish} disabled={isSaving} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-slate-900 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                                {isSaving ? <><Loader2 className="animate-spin w-5 h-5" /> MEMPROSES...</> : <><UploadCloud className="w-5 h-5" /> TERBITKAN ARTIKEL</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}