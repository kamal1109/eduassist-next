"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";
import {
    FileText, LogOut, Image as ImageIcon, Globe,
    CheckCircle2, AlertCircle, Smartphone, Monitor, Clock, Sparkles, MessageCircle, ArrowLeft, Layers, Search, X, Video, Plus, Target, Zap, ShieldCheck, PenTool, Users, GraduationCap, BookOpen, 
    PlayCircle, ArrowRight // Tambahkan PlayCircle dan ArrowRight di sini
} from "lucide-react";
import Link from "next/link";
// Pastikan jalur ini benar mengarah ke lib/supabase.ts Anda
import { supabase } from "../../../../../lib/supabase";

const ICON_LIST = ["GraduationCap", "BookOpen", "Search", "MessageCircle", "Target", "Zap", "ShieldCheck", "PenTool", "Users"];
type ArticleStatus = "Draft" | "Review" | "Published" | "Archived";

export default function EditArtikel() {
    const params = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

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
            { label: "Keyword di Judul Utama", pass: title.toLowerCase().includes(kw) },
            { label: "Keyword di Meta Deskripsi", pass: seoDesc.toLowerCase().includes(kw) },
            { label: "Keyword di Paragraf Pertama", pass: content.toLowerCase().substring(0, 300).includes(kw) },
            { label: "Panjang Konten Cukup (Min 100 kata)", pass: wordCount >= 100 }
        ];
    }, [focusKeyword, title, seoDesc, content, wordCount]);

    const getYouTubeID = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const processImage = (e: any) => {
        const file = e.target.files[0];
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
        return IconComponent ? <IconComponent size={24} /> : null;
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-black text-indigo-600">MEMUAT DATA...</div>;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-white border-r p-8 flex flex-col gap-4">
                <h2 className="text-2xl font-black text-indigo-600 mb-8 tracking-tighter uppercase">Admin Panel</h2>
                <Link href="/admin/dashboard/list" className="flex items-center gap-3 p-4 rounded-2xl font-bold bg-indigo-600 text-white shadow-lg">
                    <Layers size={20} /> Kembali ke List
                </Link>
                <Link href="/admin/dashboard" className="flex items-center gap-3 p-4 rounded-2xl font-bold text-slate-400 hover:bg-indigo-50 transition">
                    <Plus size={20} /> Tulis Baru
                </Link>
            </aside>

            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <div className="grid lg:grid-cols-12 gap-10">
                    <section className="lg:col-span-8 flex flex-col gap-8">
                        <div className="bg-white p-8 rounded-[3.5rem] border shadow-sm border-slate-100">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
                                <h3 className="font-black text-2xl text-slate-900 tracking-tight uppercase text-center">Edit Konten</h3>
                                <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
                                    {(["Draft", "Review", "Published", "Archived"] as ArticleStatus[]).map((s) => (
                                        <button key={s} onClick={() => setStatus(s)} className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all ${status === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{s.toUpperCase()}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-8">
                                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-5 bg-slate-50 border-none rounded-3xl outline-none font-bold text-2xl text-slate-900 shadow-inner focus:ring-2 focus:ring-indigo-100" />
                                <div className="grid md:grid-cols-2 gap-6">
                                    <input value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} placeholder="Focus Keyword" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none text-sm font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-100" />
                                    <input value={slug} readOnly className="w-full p-4 bg-slate-50/50 border-none rounded-2xl text-xs font-medium text-slate-400 italic" />
                                </div>
                                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Ringkasan..." className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none text-sm h-24 resize-none leading-relaxed" />
                                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Isi Artikel..." className="w-full p-8 bg-slate-50 border-none rounded-[2.5rem] outline-none text-slate-600 min-h-[500px] leading-relaxed" />
                            </div>
                        </div>

                        {/* SEO PREVIEW */}
                        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                            <h3 className="font-black text-xl mb-8 flex items-center gap-3 uppercase tracking-tight"><Globe className="text-indigo-400" size={24} /> SEO Snippet</h3>
                            <div className="space-y-6">
                                <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 shadow-inner">
                                    <div className="text-indigo-400 text-xs mb-1">eduassist.id › artikel › {slug}</div>
                                    <div className="text-blue-400 text-xl font-black mb-2 truncate">{seoTitle || title || 'Judul SEO'}</div>
                                    <div className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{seoDesc || excerpt || 'Deskripsi meta...'}</div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl outline-none text-white text-sm" placeholder="Meta Title..." />
                                    <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl outline-none h-20 resize-none text-white text-sm" placeholder="Meta Description..." />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* RIGHT: TOOLS */}
                    <section className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-sm sticky top-12">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preview</h3>
                                <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
                                    <button onClick={() => setIsPreviewMobile(false)} className={`p-2 rounded-lg transition-all ${!isPreviewMobile ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><Monitor size={16} /></button>
                                    <button onClick={() => setIsPreviewMobile(true)} className={`p-2 rounded-lg transition-all ${isPreviewMobile ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><Smartphone size={16} /></button>
                                </div>
                            </div>

                            {/* PREVIEW CARD */}
                            <div className={`mx-auto bg-[#F8FAFC] border border-slate-100 rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-inner ${isPreviewMobile ? 'w-[260px]' : 'w-full'}`}>
                                <div className="p-4">
                                    <div className="aspect-video bg-indigo-50 rounded-[1.8rem] mb-4 overflow-hidden flex items-center justify-center text-indigo-200 group relative">
                                        {visualType === 'image' && selectedImage ? (
                                            <img src={selectedImage} className="w-full h-full object-cover" alt="Preview" />
                                        ) : visualType === 'video' && youtubeLink ? (
                                            <>
                                                <img src={`https://img.youtube.com/vi/${getYouTubeID(youtubeLink)}/hqdefault.jpg`} className="w-full h-full object-cover brightness-75" alt="YT Preview" />
                                                <div className="absolute inset-0 flex items-center justify-center"><PlayCircle className="text-white drop-shadow-xl" size={40} /></div>
                                            </>
                                        ) : (
                                            <DynamicIcon name={selectedIcon} />
                                        )}
                                    </div>
                                    <div className="font-black text-slate-900 text-sm leading-tight mb-2 line-clamp-2">{title || 'Judul'}</div>
                                    <div className="text-[10px] text-slate-400 line-clamp-3 leading-relaxed font-medium italic">"{excerpt || 'Ringkasan...'}"</div>
                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[8px] font-black text-slate-300">
                                        <span><Clock size={10} className="inline mr-1"/> {readingTime} MIN READ</span>
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            {/* JADWAL */}
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3 block flex items-center gap-2"><Clock size={14} className="text-indigo-600" /> Jadwal</label>
                                <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-600 outline-none" />
                            </div>

                            {/* SEO ASSISTANT */}
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2"><Sparkles size={14} className="text-indigo-600" /> SEO Assistant</h4>
                                <ul className="space-y-3">
                                    {seoChecklist.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <div className={`p-1 rounded-full ${item.pass ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-200'}`}>
                                                {item.pass ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                            </div>
                                            <span className={`text-[10px] font-bold ${item.pass ? 'text-slate-700' : 'text-slate-300'}`}>{item.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* MEDIA SELECTOR */}
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 shadow-inner">
                                    {(['icon', 'image', 'video'] as const).map((t) => (
                                        <button key={t} onClick={() => setVisualType(t)} className={`flex-1 py-2 text-[9px] font-black rounded-xl uppercase transition-all ${visualType === t ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
                                    ))}
                                </div>
                                {visualType === "icon" && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {ICON_LIST.map(ic => (
                                            <button key={ic} onClick={() => setSelectedIcon(ic)} className={`p-3 border-2 rounded-xl flex justify-center transition-all ${selectedIcon === ic ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-50 text-slate-300'}`}><DynamicIcon name={ic} /></button>
                                        ))}
                                    </div>
                                )}
                                {visualType === "image" && (
                                    <div onClick={() => fileInputRef.current?.click()} className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer overflow-hidden text-slate-400 hover:bg-indigo-50/30 transition-all">
                                        {selectedImage ? <img src={selectedImage} className="w-full h-full object-cover" /> : <><ImageIcon size={32} /><span className="text-[10px] font-black mt-2">Ganti Cover</span></>}
                                        <input type="file" hidden ref={fileInputRef} onChange={processImage} accept="image/*" />
                                    </div>
                                )}
                                {visualType === "video" && (
                                    <input value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="YouTube URL..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-xs text-slate-600 font-bold" />
                                )}
                            </div>

                            <button 
                                onClick={handleUpdate} 
                                disabled={isSaving} 
                                className="w-full mt-10 bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black shadow-xl shadow-indigo-100 hover:bg-slate-950 transition-all active:scale-95 disabled:opacity-50"
                            >
                                <span className="flex items-center justify-center gap-2 tracking-widest text-xs">
                                    {isSaving ? (
                                        <>MEMPROSES <div className="w-2 h-2 bg-white rounded-full animate-ping"></div></>
                                    ) : (
                                        <>UPDATE ARTIKEL <ArrowRight size={16} /></>
                                    )}
                                </span>
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}