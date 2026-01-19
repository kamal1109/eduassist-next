"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";
import {
    Save,
    Image as ImageIcon,
    ChevronRight,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const ICON_LIST = ["GraduationCap", "BookOpen", "Search", "MessageCircle", "Target", "Zap", "ShieldCheck", "PenTool", "Users"];
const CATEGORIES = [
    "Edukasi Umum", "Mahasiswa", "Dosen & Peneliti",
    "Bisnis & UMKM", "Studi Kasus", "Teknis & Metode", "Info Jasa"
];

type ArticleStatus = "Draft" | "Review" | "Published" | "Archived";

export default function EditArtikel() {
    const params = useParams();
    const router = useRouter();
    const articleId = params.id as string; // Pastikan ID string

    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // --- STATE DATA ---
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
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [youtubeLink, setYoutubeLink] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. FETCH DATA SAAT LOAD
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                if (!articleId) return;

                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('id', articleId)
                    .single();

                if (error) throw error;

                if (data) {
                    setTitle(data.title || "");
                    setSlug(data.slug || "");
                    setExcerpt(data.excerpt || "");
                    setContent(data.content || "");
                    setCategory(data.category || "Edukasi Umum");
                    setBadge(data.badge || "");
                    setStatus(data.status as ArticleStatus);
                    setFocusKeyword(data.focus_keyword || "");
                    setSeoTitle(data.seo_title || "");
                    setSeoDesc(data.seo_desc || "");

                    if (data.published_at) {
                        // Format datetime-local input (YYYY-MM-DDTHH:mm)
                        const date = new Date(data.published_at);
                        const formatted = date.toISOString().slice(0, 16);
                        setPublishedAt(formatted);
                    }

                    setVisualType(data.visual_type as any || "icon");
                    if (data.visual_type === 'icon') setSelectedIcon(data.visual_value);
                    if (data.visual_type === 'image') setSelectedImage(data.visual_value);
                    if (data.visual_type === 'video') setYoutubeLink(`https://www.youtube.com/watch?v=${data.visual_value}`);
                }
            } catch (err: any) {
                console.error("Gagal load artikel:", err.message);
                alert("Artikel tidak ditemukan!");
                router.push('/admin/dashboard/list');
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
    }, [articleId, router]);

    // --- LOGIKA HELPER ---
    const getYouTubeID = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const DynamicIcon = ({ name }: { name: string }) => {
        const IconComponent = (LucideIcons as any)[name];
        return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
    };

    // 2. FUNGSI UPDATE
    const handleUpdate = async () => {
        if (!title) return alert("Judul wajib diisi!");
        setIsSaving(true);

        try {
            let finalVisualValue = "";

            if (visualType === "image") {
                if (imageFile) {
                    const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`;
                    const { error: uploadError } = await supabase.storage.from('article-images').upload(fileName, imageFile);
                    if (uploadError) throw uploadError;

                    const { data: publicUrlData } = supabase.storage.from('article-images').getPublicUrl(fileName);
                    finalVisualValue = publicUrlData.publicUrl;
                } else {
                    finalVisualValue = selectedImage || "";
                }
            } else if (visualType === "icon") {
                finalVisualValue = selectedIcon;
            } else if (visualType === "video") {
                finalVisualValue = getYouTubeID(youtubeLink) || "";
            }

            const { error: updateError } = await supabase
                .from('articles')
                .update({
                    title, slug, excerpt, content, status, category, badge,
                    visual_type: visualType, visual_value: finalVisualValue,
                    cover_image: visualType === 'image' ? finalVisualValue : null,
                    focus_keyword: focusKeyword, seo_title: seoTitle, seo_desc: seoDesc,
                    published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', articleId);

            if (updateError) throw updateError;

            alert("Artikel berhasil diperbarui! 🎉");
            router.push('/admin/dashboard/list');

        } catch (error: any) {
            console.error("Error saving:", error);
            alert("Gagal update: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600 w-10 h-10" />
        </div>
    );

    return (
        <div className="w-full min-h-full bg-[#F8FAFC]">

            {/* Header Sticky */}
            <div className="sticky top-0 z-20 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200 px-4 py-4 sm:px-8 sm:py-6">
                <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/admin/dashboard" className="hover:text-indigo-600 font-bold">Dashboard</Link>
                    <ChevronRight size={14} />
                    <Link href="/admin/dashboard/list" className="hover:text-indigo-600 font-bold">List</Link>
                    <ChevronRight size={14} />
                    <span className="text-indigo-600 font-black">Edit Artikel</span>
                </div>
            </div>

            {/* Main Form */}
            <div className="p-4 sm:p-8 max-w-7xl mx-auto pb-24">
                <div className="grid lg:grid-cols-12 gap-8">

                    {/* KOLOM KIRI (Content Utama) */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">

                            {/* Judul */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Judul Konten</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Masukkan judul artikel..."
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-xl text-slate-900 focus:ring-2 focus:ring-indigo-100 transition"
                                />
                            </div>

                            {/* Kategori & Badge */}
                            <div className="grid md:grid-cols-2 gap-6 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                                <div>
                                    <label className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-2 block">Kategori</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 bg-white border border-indigo-200 rounded-xl outline-none text-sm font-bold text-slate-700 cursor-pointer hover:border-indigo-400 transition">
                                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-2 block">Badge (Opsional)</label>
                                    <input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Contoh: Trending" className="w-full p-3 bg-white border border-indigo-200 rounded-xl outline-none text-sm font-bold text-slate-700 placeholder:font-normal" />
                                </div>
                            </div>

                            {/* Isi Konten */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Isi Artikel</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Tulis konten artikel di sini..."
                                    className="w-full p-6 bg-slate-50 border-none rounded-[2rem] text-slate-700 min-h-[400px] leading-relaxed focus:ring-2 focus:ring-indigo-100 resize-y"
                                />
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN (Sidebar Settings) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-24">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Media & Publish</h3>

                            {/* Status */}
                            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                                {(["Draft", "Review", "Published", "Archived"] as ArticleStatus[]).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStatus(s)}
                                        className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${status === s ? 'bg-white shadow-sm text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {s === 'Published' ? 'PUB' : s}
                                    </button>
                                ))}
                            </div>

                            {/* Visual Type Selector */}
                            <div className="flex bg-slate-50 p-1 rounded-xl mb-4 border border-slate-100">
                                {(['icon', 'image', 'video'] as const).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setVisualType(t)}
                                        className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${visualType === t ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            {/* Visual Input Area */}
                            <div className="mb-6">
                                {visualType === "icon" && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {ICON_LIST.map(ic => (
                                            <button
                                                key={ic}
                                                onClick={() => setSelectedIcon(ic)}
                                                className={`p-3 border rounded-xl flex justify-center items-center transition-all aspect-square ${selectedIcon === ic ? 'border-indigo-600 bg-indigo-50 text-indigo-600 ring-2 ring-indigo-100' : 'border-slate-100 text-slate-300 hover:bg-slate-50'}`}
                                            >
                                                <DynamicIcon name={ic} />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {visualType === "image" && (
                                    <>
                                        <div onClick={() => fileInputRef.current?.click()} className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 text-slate-400 overflow-hidden relative group transition-all">
                                            {selectedImage ? (
                                                <>
                                                    <img src={selectedImage} className="w-full h-full object-cover" alt="Preview" />
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
                                        </div>
                                        <input type="file" hidden ref={fileInputRef} onChange={handleImageSelect} accept="image/*" />
                                    </>
                                )}

                                {visualType === "video" && (
                                    <input
                                        value={youtubeLink}
                                        onChange={(e) => setYoutubeLink(e.target.value)}
                                        placeholder="Paste Link YouTube..."
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                    />
                                )}
                            </div>

                            {/* Tombol Simpan */}
                            <button
                                onClick={handleUpdate}
                                disabled={isSaving}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-slate-900 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <><Loader2 className="animate-spin w-5 h-5" /> MENYIMPAN...</>
                                ) : (
                                    <><Save className="w-5 h-5" /> SIMPAN PERUBAHAN</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}