"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import {
    Users, MessageCircle, ShoppingBag, Check, Clock,
    Calculator, FileText, ShieldCheck, ArrowRight, AlertCircle,
    Banknote, Wallet, Link as LinkIcon, AlertTriangle,
    Loader2, User, Copy, Edit3, Lightbulb, Sparkles
} from "lucide-react";
import { submitContact } from "@/app/actions/contact";

// --- DATA MASTER HARGA ---
const HARGA_PILGAN = [
    { hari: 4, maxPertanyaan: 30, harga: 400 },
    { hari: 4, maxPertanyaan: 60, harga: 800 },
    { hari: 4, maxPertanyaan: 90, harga: 1200 },
    { hari: 4, maxPertanyaan: 150, harga: 1800 },
    { hari: 4, maxPertanyaan: 500, harga: 2500 },
    { hari: 2, maxPertanyaan: 30, harga: 800 },
    { hari: 2, maxPertanyaan: 60, harga: 1200 },
    { hari: 2, maxPertanyaan: 90, harga: 1600 },
    { hari: 2, maxPertanyaan: 150, harga: 2200 },
    { hari: 2, maxPertanyaan: 500, harga: 3200 },
    { hari: 1, maxPertanyaan: 30, harga: 1200 },
    { hari: 1, maxPertanyaan: 60, harga: 1600 },
    { hari: 1, maxPertanyaan: 90, harga: 2000 },
    { hari: 1, maxPertanyaan: 150, harga: 2800 },
    { hari: 1, maxPertanyaan: 500, harga: 4000 }
];

export default function Layanan() {
    // --- STATE DATA ---
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [showFloatingTotal, setShowFloatingTotal] = useState(false);

    // --- STATE KALKULATOR ---
    const [respondenCount, setRespondenCount] = useState(30);
    const [manualResponden, setManualResponden] = useState("30");
    const [showManualResponden, setShowManualResponden] = useState(false);
    const [pertanyaanCount, setPertanyaanCount] = useState(30);
    const [manualPertanyaan, setManualPertanyaan] = useState("30");
    const [showManualPertanyaan, setShowManualPertanyaan] = useState(false);
    const [hariPengerjaan, setHariPengerjaan] = useState(4);
    const [tipePertanyaan, setTipePertanyaan] = useState<"pilgan" | "campuran" | "esai">("pilgan");
    const [pilganCount, setPilganCount] = useState(30);
    const [manualPilgan, setManualPilgan] = useState("30");
    const [showManualPilgan, setShowManualPilgan] = useState(false);
    const [esaiCount, setEsaiCount] = useState(0);
    const [manualEsai, setManualEsai] = useState("0");
    const [showManualEsai, setShowManualEsai] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("bca");
    const [specialRequest, setSpecialRequest] = useState("");
    const [questionnaireLink, setQuestionnaireLink] = useState("");
    const [chatTemplate, setChatTemplate] = useState("");

    const kalkulatorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowFloatingTotal(!entry.isIntersecting);
            },
            { threshold: 0.1 }
        );
        const currentRef = kalkulatorRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, []);

    useEffect(() => {
        let hargaPerResponden = 0;
        let detailSoal = "";
        const curResponden = showManualResponden ? parseInt(manualResponden) || 0 : respondenCount;
        const curPilgan = showManualPilgan ? parseInt(manualPilgan) || 0 : pilganCount;
        const curEsai = showManualEsai ? parseInt(manualEsai) || 0 : esaiCount;
        const curSingle = showManualPertanyaan ? parseInt(manualPertanyaan) || 0 : pertanyaanCount;

        if (tipePertanyaan === "campuran") {
            const hargaItem = HARGA_PILGAN.filter(item => item.hari === hariPengerjaan).sort((a, b) => a.maxPertanyaan - b.maxPertanyaan).find(item => curPilgan <= item.maxPertanyaan);
            hargaPerResponden = (curPilgan === 0 ? 0 : (hargaItem?.harga || 0)) + (curEsai * 400);
            detailSoal = `${curPilgan} Pilgan + ${curEsai} Esai`;
        } else if (tipePertanyaan === "pilgan") {
            const hargaItem = HARGA_PILGAN.filter(item => item.hari === hariPengerjaan).sort((a, b) => a.maxPertanyaan - b.maxPertanyaan).find(item => curSingle <= item.maxPertanyaan);
            hargaPerResponden = hargaItem?.harga || 0;
            detailSoal = `${curSingle} Pilihan Ganda`;
        } else {
            hargaPerResponden = curSingle * 400;
            detailSoal = `${curSingle} Esai`;
        }

        const total = curResponden * hargaPerResponden;
        setTotalPrice(total);

        const rek = paymentMethod === "bca" ? "BCA: 8614021834" : paymentMethod === "bni" ? "BNI: 0842143940" : paymentMethod === "dana" ? "DANA: 085236110219" : "SHOPEE PAY";

        setChatTemplate(`Halo EduAssist, saya ingin order responden:
Nama: ${customerName || "-"}
Email: ${customerEmail || "-"}
WhatsApp: ${customerPhone || "-"}
Responden: ${curResponden} orang
Waktu: ${hariPengerjaan} Hari (${detailSoal})
Total Biaya: Rp ${total.toLocaleString('id-ID')}
Metode: ${rek} (a.n Salsabella Ajeng Syahtry)
Link: ${questionnaireLink || "Dikirim via chat"}
Request: ${specialRequest || "Tidak ada"}`);
    }, [respondenCount, manualResponden, showManualResponden, pertanyaanCount, manualPertanyaan, showManualPertanyaan, hariPengerjaan, tipePertanyaan, pilganCount, esaiCount, manualPilgan, showManualPilgan, manualEsai, showManualEsai, paymentMethod, questionnaireLink, customerName, customerPhone, customerEmail, specialRequest]);

    const scrollToKalkulator = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById("kalkulator");
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
        }
    };

    const handleCopyTemplate = () => {
        navigator.clipboard.writeText(chatTemplate);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const processOrder = async (destination: 'whatsapp' | 'shopee') => {
        setIsSubmitting(true);
        try {
            if (customerName && customerPhone) {
                const formData = new FormData();
                formData.append("name", customerName);
                formData.append("email", customerEmail || "customer@eduassist.id");
                formData.append("phone", customerPhone);
                formData.append("message", `[ORDER LAYANAN]\n${chatTemplate}`);
                await submitContact(formData).catch(() => { });
            }
            const waUrl = `https://wa.me/6285236110219?text=${encodeURIComponent(chatTemplate)}`;
            if (destination === 'whatsapp') {
                if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) window.location.href = waUrl;
                else window.open(waUrl, '_blank');
            } else window.open("https://id.shp.ee/RoYtQCu", '_blank');
        } finally { setIsSubmitting(false); }
    };

    const renderSlider = (min: number, max: number, value: number, onChange: (v: number) => void, quick: number[], label: string, unit: string) => {
        const percentage = ((value - min) / (max - min)) * 100;
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <span className="font-bold text-slate-500 uppercase text-[10px] md:text-xs tracking-widest">{label}</span>
                    <span className="font-black text-indigo-600 text-lg md:text-xl">{value.toLocaleString('id-ID')} {unit}</span>
                </div>
                <div className="relative py-4 flex items-center h-10">
                    <div className="h-2 bg-slate-100 rounded-full w-full absolute"></div>
                    <div className="h-2 bg-indigo-600 rounded-full absolute transition-all duration-300" style={{ width: `${percentage}%` }}></div>
                    <input
                        type="range" min={min} max={max} value={value}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                        className="absolute w-full h-10 opacity-0 cursor-pointer z-50"
                        style={{ WebkitAppearance: 'none' }}
                    />
                    <div
                        className="absolute w-6 h-6 md:w-8 md:h-8 bg-white border-4 border-indigo-600 rounded-full shadow-xl pointer-events-none transition-all duration-300"
                        style={{ left: `calc(${percentage}% - 12px)` }}
                    ></div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {quick.map(v => <button key={v} onClick={() => onChange(v)} className={`px-2 md:px-3 py-1.5 text-[9px] md:text-[10px] font-bold rounded-lg border transition ${value === v ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200'}`}>≤ {v} {unit}</button>)}
                </div>
            </div>
        );
    };

    return (
        <main className="bg-[#F8FAFC] min-h-screen text-slate-900 pb-20 selection:bg-indigo-100 overflow-x-hidden">

            {/* --- FLOATING TOTAL MOBILE --- */}
            <AnimatePresence>
                {showFloatingTotal && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 z-[60] p-4 lg:hidden"
                    >
                        <div className="bg-slate-900/95 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-md">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">Total</span>
                                <span className="text-xl font-black">Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                            <button
                                onClick={scrollToKalkulator}
                                className="bg-indigo-600 px-5 py-2.5 rounded-xl font-black text-xs uppercase flex items-center gap-2"
                            >
                                Pesan Sekarang <ArrowRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-28 pb-16 md:pt-40 md:pb-28 px-4 sm:px-6 overflow-hidden bg-white border-b border-slate-100">
                <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/70 via-white to-transparent -z-10"></div>

                <div className="container mx-auto max-w-[1600px] flex flex-col items-center justify-center text-center px-4 lg:px-20">

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-indigo-700 font-bold text-xs md:text-sm uppercase tracking-[0.15em] mb-8 shadow-sm"
                    >
                        <Sparkles size={14} className="fill-indigo-500 text-indigo-500 animate-pulse" />
                        <span>Layanan Responden No. 1</span>
                    </motion.div>

                    {/* HEADLINE DISAMAKAN DENGAN HOME PAGE */}
                    <h1 className="text-4xl md:text-7xl xl:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
                        Pesan Responden<br className="hidden md:block" />
                        <span className="text-indigo-600 relative inline-block mx-2">
                            Tanpa Ribet & Terjamin.
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                            </svg>
                        </span>
                    </h1>

                    {/* DESKRIPSI DISAMAKAN DENGAN HOME PAGE */}
                    <p className="text-slate-500 text-base md:text-xl lg:text-2xl max-w-4xl mx-auto mb-12 font-medium leading-relaxed">
                        Pilihan paket kuesioner terlengkap dengan sistem harga paling transparan dan pengerjaan express untuk hasil riset maksimal.
                    </p>

                    <button onClick={scrollToKalkulator} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl flex items-center gap-2 mx-auto active:scale-95 transition-transform">
                        Mulai Hitung Biaya <Calculator size={22} />
                    </button>
                </div>
            </section>

            {/* --- DAFTAR HARGA --- */}
            <section className="container mx-auto px-4 py-12 md:py-20 max-w-[1400px]">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-2xl md:text-4xl font-black">Daftar Harga <span className="text-indigo-600">Transparan</span></h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 items-start">
                    <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-sm h-full">
                        <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2 text-base md:text-xl"><Lightbulb className="text-amber-500" /> Ketentuan Jasa:</h4>
                        <ul className="text-sm md:text-base text-slate-500 space-y-5">
                            <li className="flex gap-4"><div className="bg-green-100 p-1 rounded-full shrink-0 h-fit"><Check size={14} className="text-green-600" /></div> <span>Harga per responden mengikuti tier jumlah soal.</span></li>
                            <li className="flex gap-4"><div className="bg-blue-100 p-1 rounded-full shrink-0 h-fit"><Check size={14} className="text-blue-600" /></div> <span>Jasa input Esai: <b>Rp 400</b> /soal /responden.</span></li>
                            <li className="flex gap-4"><div className="bg-indigo-100 p-1 rounded-full shrink-0 h-fit"><Check size={14} className="text-indigo-600" /></div> <span>Minimal order layanan <b>30 responden</b>.</span></li>
                        </ul>
                    </div>
                    <div className="lg:col-span-2 bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
                                        <th className="p-6">Waktu Pengerjaan</th>
                                        <th className="p-6">≤ 30 Soal</th>
                                        <th className="p-6">≤ 60 Soal</th>
                                        <th className="p-6">≤ 150 Soal</th>
                                        <th className="p-6">≤ 500 Soal</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs md:text-sm font-bold">
                                    <tr className="border-t hover:bg-slate-50/50 transition-colors"><td className="p-6 text-emerald-600">4 Hari (Hemat)</td><td className="p-6">Rp 400</td><td className="p-6">Rp 800</td><td className="p-6">Rp 1.800</td><td className="p-6">Rp 2.500</td></tr>
                                    <tr className="border-t bg-slate-50/30 hover:bg-slate-50 transition-colors"><td className="p-6 text-amber-600">2 Hari (Cepat)</td><td className="p-6">Rp 800</td><td className="p-6">Rp 1.200</td><td className="p-6">Rp 2.200</td><td className="p-6">Rp 3.200</td></tr>
                                    <tr className="border-t hover:bg-slate-50/50 transition-colors"><td className="p-6 text-rose-600">1 Hari (Express)</td><td className="p-6">Rp 1.200</td><td className="p-6">Rp 1.600</td><td className="p-6">Rp 2.800</td><td className="p-6">Rp 4.000</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- KALKULATOR UTAMA --- */}
            <section id="kalkulator" className="container mx-auto max-w-[1400px] px-4">
                <div ref={kalkulatorRef} className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative">

                    {/* LEFT: INPUT SECTION */}
                    <div className="lg:col-span-7 p-6 md:p-12 xl:p-16 space-y-10 md:space-y-14 border-b lg:border-b-0 lg:border-r border-slate-100">
                        <div className="space-y-8">
                            <h2 className="text-xl md:text-2xl font-black flex items-center gap-3 tracking-tight"><User className="text-indigo-600" /> 1. Identitas Pemesan</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nama Lengkap</label><input type="text" placeholder="Masukkan nama..." value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold transition shadow-inner" /></div>
                                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">WhatsApp</label><input type="tel" placeholder="0812xxxx" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold transition shadow-inner" /></div>
                            </div>
                            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">Alamat Email</label><input type="email" placeholder="nama@email.com" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold transition shadow-inner" /></div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex justify-between items-center"><h3 className="font-black text-slate-800 flex items-center gap-2 text-base md:text-xl"><Users size={20} /> 2. Target Responden</h3><button onClick={() => setShowManualResponden(!showManualResponden)} className="text-[9px] md:text-[10px] font-black text-indigo-600 underline uppercase">Input Manual</button></div>
                            {showManualResponden ? <div className="flex gap-2"><input type="number" min="30" value={manualResponden} onChange={e => setManualResponden(e.target.value)} className="flex-1 p-4 bg-indigo-50 rounded-2xl font-black outline-none border-2 border-indigo-200" /><button onClick={() => { setRespondenCount(Math.max(30, parseInt(manualResponden) || 30)); setShowManualResponden(false) }} className="bg-indigo-600 text-white px-8 rounded-2xl font-black">OK</button></div> : renderSlider(30, 1000, respondenCount, setRespondenCount, [30, 100, 250, 500], "Jumlah", "Orang")}
                        </div>

                        <div className="space-y-8">
                            <h3 className="font-black text-slate-800 flex items-center gap-2 text-base md:text-xl"><FileText size={20} /> 3. Spesifikasi Pertanyaan</h3>
                            <div className="flex p-1.5 bg-slate-100 rounded-2xl overflow-hidden">
                                {['pilgan', 'campuran', 'esai'].map(t => (
                                    <button key={t} onClick={() => setTipePertanyaan(t as any)} className={`flex-1 py-3 md:py-4 rounded-xl font-black text-[9px] md:text-xs transition-all ${tipePertanyaan === t ? 'bg-white text-indigo-600 shadow-md scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}>{t.toUpperCase()}</button>
                                ))}
                            </div>
                            {tipePertanyaan === "campuran" ? (
                                <div className="space-y-10 pt-4">
                                    <div><div className="flex justify-between mb-2 uppercase text-[10px] font-black text-slate-400 px-1"><span>Pilihan Ganda</span><button onClick={() => setShowManualPilgan(!showManualPilgan)} className="underline">Manual</button></div>
                                        {showManualPilgan ? <div className="flex gap-2"><input type="number" value={manualPilgan} onChange={e => setManualPilgan(e.target.value)} className="flex-1 p-4 bg-indigo-50 rounded-2xl font-bold" /><button onClick={() => { setPilganCount(parseInt(manualPilgan) || 0); setShowManualPilgan(false) }} className="bg-indigo-600 text-white px-6 rounded-2xl font-black">OK</button></div> : renderSlider(0, 500, pilganCount, setPilganCount, [30, 60, 150], "Pilgan", "Soal")}</div>
                                    <div><div className="flex justify-between mb-2 uppercase text-[10px] font-black text-slate-400 px-1"><span>Esai</span><button onClick={() => setShowManualEsai(!showManualEsai)} className="underline">Manual</button></div>
                                        {showManualEsai ? <div className="flex gap-2"><input type="number" value={manualEsai} onChange={e => setManualEsai(e.target.value)} className="flex-1 p-4 bg-indigo-50 rounded-2xl font-bold" /><button onClick={() => { setEsaiCount(parseInt(manualEsai) || 0); setShowManualEsai(false) }} className="bg-indigo-600 text-white px-6 rounded-2xl font-black">OK</button></div> : renderSlider(0, 100, esaiCount, setEsaiCount, [5, 10, 20], "Esai", "Soal")}</div>
                                </div>
                            ) : (
                                <div className="pt-4">
                                    <div className="flex justify-between mb-2 uppercase text-[10px] font-black text-slate-400 px-1"><span>Jumlah {tipePertanyaan === 'pilgan' ? 'Pilihan Ganda' : 'Esai'}</span><button onClick={() => setShowManualPertanyaan(!showManualPertanyaan)} className="underline">Manual</button></div>
                                    {showManualPertanyaan ? <div className="flex gap-2"><input type="number" value={manualPertanyaan} onChange={e => setManualPertanyaan(e.target.value)} className="flex-1 p-4 bg-indigo-50 rounded-2xl font-bold" /><button onClick={() => { setPertanyaanCount(parseInt(manualPertanyaan) || 1); setShowManualPertanyaan(false) }} className="bg-indigo-600 text-white px-6 rounded-2xl font-black">OK</button></div> : renderSlider(1, 500, pertanyaanCount, setPertanyaanCount, [30, 60, 150, 500], "Total", "Soal")}
                                </div>
                            )}
                        </div>

                        <div className="space-y-8">
                            <h3 className="font-black text-slate-800 flex items-center gap-2 text-base md:text-xl"><Clock size={20} /> 4. Deadline Pengerjaan</h3>
                            <div className="grid grid-cols-3 gap-3 md:gap-5">
                                {[4, 2, 1].map(h => (
                                    <button key={h} onClick={() => setHariPengerjaan(h)} className={`p-4 md:p-6 rounded-3xl border-2 flex flex-col items-center justify-center transition-all ${hariPengerjaan === h ? 'bg-indigo-600 border-indigo-700 text-white shadow-xl scale-[1.03]' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:bg-slate-50'}`}>
                                        <span className="font-black text-base md:text-2xl whitespace-nowrap">{h} Hari</span>
                                        <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest mt-1 ${hariPengerjaan === h ? 'opacity-80' : 'opacity-40'}`}>{h === 4 ? "Hemat" : h === 2 ? "Cepat" : "Express"}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="space-y-4"><h3 className="font-black text-slate-800 flex items-center gap-2 text-base md:text-xl"><LinkIcon size={20} /> 5. Link Kuesioner</h3><input type="url" placeholder="https://forms.gle/..." value={questionnaireLink} onChange={e => setQuestionnaireLink(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition shadow-inner font-medium text-sm md:text-base" /></div>
                            <div className="space-y-4"><h3 className="font-black text-slate-800 flex items-center gap-2 text-base md:text-xl"><Edit3 size={20} /> 6. Request Khusus (Opsional)</h3><textarea placeholder="Misal: Kriteria responden spesifik (Umur, Pekerjaan, Lokasi)..." value={specialRequest} onChange={e => setSpecialRequest(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 min-h-[120px] transition shadow-inner font-medium text-sm md:text-base" /></div>
                        </div>

                        <div className="space-y-8 pt-4 border-t border-slate-100">
                            <h3 className="font-black text-slate-800 flex items-center gap-2 text-base md:text-xl"><Wallet size={20} /> 7. Metode Pembayaran</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[{ id: 'bca', name: 'BCA', no: '8614021834' }, { id: 'bni', name: 'BNI', no: '0842143940' }, { id: 'dana', name: 'DANA', no: '085236110219' }, { id: 'shopee', name: 'SHOPEE PAY', no: 'Checkout via App' }].map(m => (
                                    <button key={m.id} onClick={() => setPaymentMethod(m.id)} className={`p-4 md:p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${paymentMethod === m.id ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-600/10' : 'bg-white border-slate-100 hover:border-indigo-200'}`}>
                                        <div className={paymentMethod === m.id ? 'text-indigo-600' : 'text-slate-300'}><Banknote size={24} /></div>
                                        <div className="flex flex-col"><span className={`font-black text-xs md:text-sm uppercase ${paymentMethod === m.id ? 'text-indigo-700' : 'text-slate-400'}`}>{m.name}</span><span className="text-[10px] md:text-[11px] font-bold text-slate-400">{m.no}</span></div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: RESULTS SECTION */}
                    <div className="lg:col-span-5 bg-slate-900 text-white relative flex flex-col">
                        <div className="lg:sticky lg:top-24 p-6 md:p-12 xl:p-16 space-y-8 md:space-y-12 h-fit">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -z-10"></div>

                            <div className="bg-white/5 p-8 md:p-10 rounded-[2.5rem] border border-white/10 text-center lg:text-left backdrop-blur-sm shadow-2xl">
                                <p className="text-indigo-400 font-black uppercase text-[9px] md:text-[10px] mb-4 tracking-[0.2em]">Estimasi Total Biaya</p>
                                <div className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tighter mb-5">Rp {totalPrice.toLocaleString('id-ID')}</div>
                                <div className="inline-flex items-center gap-2 bg-indigo-600/20 px-4 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase border border-indigo-500/30 whitespace-nowrap"><ShieldCheck size={14} className="text-indigo-300" /> Jaminan 100% Data Valid</div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                                    <span>Format Pesanan</span>
                                    <button onClick={handleCopyTemplate} className="text-indigo-400 hover:text-white transition flex items-center gap-1.5 font-black active:scale-90">
                                        {isCopied ? <Check size={14} /> : <Copy size={14} />} {isCopied ? 'Tersalin' : 'Copy Text'}
                                    </button>
                                </div>
                                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 shadow-inner group">
                                    <textarea readOnly value={chatTemplate} className="bg-transparent border-none text-[11px] md:text-[12px] w-full h-40 md:h-52 resize-none outline-none font-mono text-indigo-100/80 leading-relaxed no-scrollbar" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* NOTE PERINGATAN */}
                                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex gap-3 items-start mb-2">
                                    <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                                    <p className="text-[10px] font-bold text-amber-200/90 leading-tight uppercase tracking-wide">
                                        PENTING: Mohon isi data kalkulator dengan benar agar admin bisa langsung memproses pesanan.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <button onClick={() => processOrder('whatsapp')} disabled={isSubmitting || !customerName || !customerPhone} className="w-full bg-white text-slate-900 py-5 md:py-6 rounded-[2rem] font-black text-lg md:text-xl hover:bg-indigo-50 transition-all active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-3 shadow-2xl group">
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />} Pesan via WhatsApp
                                    </button>
                                    <button onClick={() => processOrder('shopee')} className="w-full bg-orange-600 text-white py-5 md:py-6 rounded-[2rem] font-black text-lg md:text-xl hover:bg-orange-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-orange-900/20 group">
                                        <ShoppingBag size={24} className="group-hover:-translate-y-1 transition-transform" /> Order di Shopee
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex gap-4 items-start text-slate-400 text-[9px] md:text-[10px] leading-relaxed">
                                <AlertCircle size={20} className="shrink-0 text-indigo-500" />
                                <p className="uppercase font-medium">Jika tombol tidak merespon, klik <b>"Copy Text"</b> lalu kirim manual ke WA Admin: <span className="text-white font-black">+62 852-3611-0219</span>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}