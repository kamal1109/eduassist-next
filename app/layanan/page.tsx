"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
    Users,
    CheckCircle2,
    MessageCircle,
    ShoppingBag,
    Check,
    Clock,
    Calculator,
    FileText,
    ShieldCheck,
    ArrowRight,
    AlertCircle,
    Banknote,
    Type,
    HelpCircle,
    Wallet,
    Smartphone,
    Phone,
    Link as LinkIcon,
    ExternalLink,
    AlertTriangle,
    Loader2,
    User,
    Mail,
    Copy,
    Edit3,
    Lightbulb,
    Send // Icon untuk Telegram/Komunitas
} from "lucide-react";
import Link from "next/link";
// IMPORT SERVER ACTION
import { submitContact } from "@/app/actions/contact";

export default function Layanan() {
    // --- STATE DATA PEMESAN ---
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // State untuk kalkulator harga
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

    // State untuk template chat
    const [chatTemplate, setChatTemplate] = useState("");

    // Data harga
    const hargaPilgan = [
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

    // Validasi URL
    const isValidUrl = (url: string) => {
        if (!url) return false;
        return url.length > 4 && url.includes(".");
    };

    // Helper Copy Clipboard
    const handleCopyTemplate = () => {
        navigator.clipboard.writeText(chatTemplate);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Hitung harga otomatis
    useEffect(() => {
        let hargaPerResponden = 0;
        let totalPertanyaan = 0;

        if (tipePertanyaan === "campuran") {
            totalPertanyaan = pilganCount + esaiCount;
            const hargaItem = hargaPilgan.find(item =>
                item.hari === hariPengerjaan &&
                pilganCount <= item.maxPertanyaan
            );
            hargaPerResponden = hargaItem?.harga ||
                hargaPilgan
                    .filter(item => item.hari === hariPengerjaan)
                    .sort((a, b) => b.maxPertanyaan - a.maxPertanyaan)[0]?.harga || 0;

            if (esaiCount > 0) {
                hargaPerResponden += (esaiCount * 400);
            }
        } else if (tipePertanyaan === "pilgan") {
            totalPertanyaan = showManualPertanyaan ? parseInt(manualPertanyaan) || pertanyaanCount : pertanyaanCount;
            const hargaItem = hargaPilgan.find(item =>
                item.hari === hariPengerjaan &&
                totalPertanyaan <= item.maxPertanyaan
            );
            hargaPerResponden = hargaItem?.harga ||
                hargaPilgan
                    .filter(item => item.hari === hariPengerjaan)
                    .sort((a, b) => b.maxPertanyaan - a.maxPertanyaan)[0]?.harga || 0;
        } else {
            totalPertanyaan = showManualPertanyaan ? parseInt(manualPertanyaan) || pertanyaanCount : pertanyaanCount;
            hargaPerResponden = totalPertanyaan * 400;
        }

        const finalRespondenCount = showManualResponden ?
            parseInt(manualResponden) || respondenCount : respondenCount;

        const total = finalRespondenCount * hargaPerResponden;
        setTotalPrice(total);

        const template = `Halo, saya ingin pesan jasa pengisian kuesioner. Berikut data saya:

👤 **Data Pemesan:**
• Nama: ${customerName || "(Belum diisi)"}
• No. HP: ${customerPhone || "(Belum diisi)"}
• Email: ${customerEmail || "(Belum diisi)"}

📋 **Detail Pesanan:**
• Jumlah Responden: ${finalRespondenCount} orang
• Tipe Pertanyaan: ${tipePertanyaan === "pilgan" ? "Pilihan Ganda" : tipePertanyaan === "esai" ? "Esai" : "Campuran (Pilgan + Esai)"}
${tipePertanyaan === "campuran"
                ? `• Jumlah Pertanyaan: ${pilganCount} pilgan + ${esaiCount} esai (total ${totalPertanyaan} soal)`
                : `• Jumlah Pertanyaan: ${totalPertanyaan} soal ${tipePertanyaan === "esai" ? "esai" : "pilgan"}`}
• Waktu Pengerjaan: ${hariPengerjaan} hari
${questionnaireLink ? `• Link Kuesioner: ${questionnaireLink}` : "• Link Kuesioner: (akan dikirim kemudian)"}
• Total Biaya: Rp ${total.toLocaleString('id-ID')}
${tipePertanyaan === "esai" ? `\n💰 **Catatan Harga:** 1 pertanyaan esai = Rp 400/responden` : ""}
${tipePertanyaan === "campuran" && esaiCount > 0 ? `\n💰 **Catatan Harga:** ${esaiCount} esai × Rp 400 = Rp ${(esaiCount * 400).toLocaleString('id-ID')}/responden` : ""}

💳 **Metode Pembayaran Pilihan:**
${paymentMethod === "bca" ? "• BCA: 8614021834" : ""}
${paymentMethod === "bni" ? "• BNI: 0842143940" : ""}
${paymentMethod === "dana" ? "• Dana: 0852-3611-0219" : ""}
${paymentMethod === "shopee" ? "• Shopee Pay via Shopee" : ""}
• Atas Nama: Salsabella Ajeng Syahtry

${specialRequest ? `\n📝 **Request Khusus:** ${specialRequest}` : ""}

✅ **Syarat & Ketentuan yang saya setujui:**
1. Minimal order 30 responden
2. Harga per responden sudah termasuk
3. Garansi validitas dan reliabilitas data
4. Revisi hanya jika data tidak valid/tidak reliabel

Silakan berikan informasi pembayaran dan langkah selanjutnya. Terima kasih!`;

        setChatTemplate(template);
    }, [respondenCount, manualResponden, showManualResponden,
        pertanyaanCount, manualPertanyaan, showManualPertanyaan,
        hariPengerjaan, tipePertanyaan, pilganCount, esaiCount,
        manualPilgan, showManualPilgan, manualEsai, showManualEsai,
        paymentMethod, specialRequest, questionnaireLink,
        customerName, customerPhone, customerEmail
    ]);

    // --- FUNGSI UNTUK MEMPROSES PESANAN (WA & SHOPEE) ---
    // Fungsi ini menangani penyimpanan ke database (Supabase) lalu redirect
    const processOrder = async (destination: 'whatsapp' | 'shopee') => {
        setIsSubmitting(true);

        try {
            // 1. Simpan Data ke Database (Inbox Leads)
            // Kita lakukan ini "fire-and-wait" sebentar agar data masuk
            if (customerName || customerEmail || customerPhone) {
                const formData = new FormData();
                formData.append("name", customerName || "Guest User");
                formData.append("email", customerEmail || "no-email@provided.com");
                formData.append("phone", customerPhone || "-");
                // Kita tambahkan penanda di pesan database agar admin tahu sumbernya
                const sourceLabel = destination === 'whatsapp' ? "[VIA WHATSAPP]" : "[VIA SHOPEE]";
                formData.append("message", `${sourceLabel}\n\n${chatTemplate}`);

                try {
                    await submitContact(formData);
                } catch (dbError) {
                    console.error("Gagal simpan database, melanjutkan redirect...", dbError);
                }
            }

            // 2. Redirect ke Tujuan
            if (destination === 'whatsapp') {
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                const baseUrl = isMobile ? "https://api.whatsapp.com/send" : "https://web.whatsapp.com/send";
                const waUrl = `${baseUrl}?phone=6285236110219&text=${encodeURIComponent(chatTemplate)}`;
                window.open(waUrl, '_blank');
            } else if (destination === 'shopee') {
                window.open("https://id.shp.ee/RoYtQCu", '_blank');
            }

        } catch (error) {
            console.error("Critical error processing order:", error);
            alert("Terjadi kesalahan teknis. Mohon coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler Toggles & Manual Input 
    const handleToggleManual = (type: 'responden' | 'pertanyaan' | 'pilgan' | 'esai') => {
        if (type === 'responden') { if (!showManualResponden) { setManualResponden(respondenCount.toString()); setShowManualResponden(true); } else { const val = parseInt(manualResponden) || 30; if (val >= 30 && val <= 1000) { setRespondenCount(val); setShowManualResponden(false); } else alert("Min 30 responden"); } }
        else if (type === 'pertanyaan') { if (!showManualPertanyaan) { setManualPertanyaan(pertanyaanCount.toString()); setShowManualPertanyaan(true); } else { const val = parseInt(manualPertanyaan) || 30; if (val >= 1 && val <= 500) { setPertanyaanCount(val); setShowManualPertanyaan(false); } else alert("1-500 pertanyaan"); } }
        else if (type === 'pilgan') { if (!showManualPilgan) { setManualPilgan(pilganCount.toString()); setShowManualPilgan(true); } else { const val = parseInt(manualPilgan) || 30; if (val >= 1 && val <= 500) { setPilganCount(val); setShowManualPilgan(false); } else alert("1-500 pertanyaan"); } }
        else if (type === 'esai') { if (!showManualEsai) { setManualEsai(esaiCount.toString()); setShowManualEsai(true); } else { const val = parseInt(manualEsai) || 0; if (val >= 0 && val <= 500) { setEsaiCount(val); setShowManualEsai(false); } else alert("0-500 pertanyaan"); } }
    };
    const handleApplyManual = (type: 'responden' | 'pertanyaan' | 'pilgan' | 'esai') => {
        if (type === 'responden') { const val = parseInt(manualResponden); if (val >= 30 && val <= 1000) { setRespondenCount(val); setShowManualResponden(false); } else alert("Min 30 responden"); }
        if (type === 'pertanyaan') { const val = parseInt(manualPertanyaan); if (val >= 1 && val <= 500) { setPertanyaanCount(val); setShowManualPertanyaan(false); } else alert("1-500 pertanyaan"); }
        if (type === 'pilgan') { const val = parseInt(manualPilgan); if (val >= 1 && val <= 500) { setPilganCount(val); setShowManualPilgan(false); } else alert("1-500 pertanyaan"); }
        if (type === 'esai') { const val = parseInt(manualEsai); if (val >= 0 && val <= 500) { setEsaiCount(val); setShowManualEsai(false); } else alert("0-500 pertanyaan"); }
    };

    const formatNumber = (num: number) => num.toLocaleString('id-ID');

    const renderSlider = (min: number, max: number, value: number, onChange: (value: number) => void, quickSelectValues: number[], label: string, unit: string = "", step: number = 1) => {
        const percentage = ((value - min) / (max - min)) * 100;
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 text-base">{label}:</span>
                    <span className="font-bold text-indigo-600 text-lg bg-indigo-50 px-3 py-1 rounded-lg">{formatNumber(value)} {unit}</span>
                </div>
                <div className="relative py-6">
                    <div className="h-2 sm:h-3 bg-slate-200 rounded-full absolute top-1/2 left-0 right-0 transform -translate-y-1/2"></div>
                    <div className="h-2 sm:h-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full absolute top-1/2 left-0 transform -translate-y-1/2" style={{ width: `${percentage}%` }}></div>
                    <div className="absolute top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white border-2 sm:border-3 border-indigo-600 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform z-20 active:scale-95" style={{ left: `${percentage}%`, marginLeft: '-16px' }}>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-600 rounded-full"></div>
                    </div>
                    <div className="absolute top-0 transform -translate-x-1/2 -translate-y-full bg-indigo-600 text-white px-2 py-1 rounded-lg font-bold text-xs shadow-lg z-30 whitespace-nowrap" style={{ left: `${percentage}%` }}>{formatNumber(value)}<div className="absolute top-full left-1/2 transform -translate-x-1/2"><div className="w-1.5 h-1.5 bg-indigo-600 rotate-45"></div></div></div>
                    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-30" aria-label={label} />
                    <div className="flex justify-between text-xs sm:text-sm text-slate-600 mt-8"><span className="font-medium">{formatNumber(min)}</span><span className="font-medium">{formatNumber(max)}</span></div>
                </div>
                {quickSelectValues.length > 0 && (<div className="mt-4"><p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">Pilih cepat:</p><div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5 sm:gap-2">{quickSelectValues.map((val) => (<button key={val} type="button" onClick={() => onChange(val)} className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs rounded-lg transition-all font-medium flex-1 text-center ${value === val ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{formatNumber(val)}</button>))}</div></div>)}
            </div>
        );
    };

    return (
        <main className="bg-[#F8FAFC] text-slate-900 overflow-x-hidden min-h-screen selection:bg-indigo-100 selection:text-indigo-700">

            {/* --- HERO SECTION --- */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 px-6 overflow-hidden bg-white">
                <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/70 via-white to-transparent -z-10"></div>
                <div className="container mx-auto max-w-6xl flex flex-col items-center justify-center text-center">

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-indigo-700 font-bold text-xs sm:text-sm uppercase tracking-[0.15em] mb-4 sm:mb-6 shadow-sm"><HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-indigo-600" /><span className="text-xs sm:text-sm">Kalkulator Harga Kuesioner</span></motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 leading-[1.15] mb-3 sm:mb-4 md:mb-8 tracking-tight text-center">Kuesioner Valid <br className="hidden sm:block" /><span className="text-indigo-600 relative inline-block text-center">Tanpa Ribet<svg className="absolute -bottom-1 sm:-bottom-1.5 md:-bottom-2 left-0 w-full h-1.5 sm:h-2 md:h-3 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="6" fill="transparent" /></svg></span></motion.h1>

                    {/* TULISAN DESKRIPSI UTAMA (Diubah Urutannya) */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center px-2 max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10">
                        <p className="text-indigo-600 font-bold text-sm sm:text-base md:text-xl lg:text-2xl mb-2 tracking-wide">
                            MINIMAL ORDER 30 RESPONDEN
                        </p>
                        <p className="text-slate-500 text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-relaxed">
                            • Data valid & reliabel • Respon manusia asli • Bisa request jawaban sesuai keinginan
                        </p>
                    </motion.div>

                    {/* ALERT PENEGASAN (Dipindah ke Bawah Tulisan) */}
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl bg-red-600 text-white p-6 rounded-2xl shadow-xl shadow-red-200 mb-12 animate-pulse">
                        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                            <div className="bg-white/20 p-3 rounded-full shrink-0"><AlertTriangle size={32} className="text-white" /></div>
                            <div>
                                <h3 className="font-black text-xl sm:text-2xl uppercase tracking-wider mb-1">PENTING: JANGAN LANGSUNG CHAT!</h3>
                                <p className="font-medium text-sm sm:text-base leading-relaxed opacity-90">Calon pemesan <strong>WAJIB</strong> mengisi data di bawah & menghitung harga terlebih dahulu. Tombol WhatsApp akan <strong>TERKUNCI</strong> jika data belum lengkap.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* BUTTON GROUP (MODIFIED) */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center items-center w-full max-w-5xl px-2">
                        {/* Tombol Kalkulator */}
                        <Link href="#kalkulator" className="w-full sm:w-auto bg-slate-900 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-sm sm:text-base hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 group">
                            <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform" />Isi Data & Hitung Harga
                        </Link>

                        {/* Tombol Shopee (DIUBAH JADI BUTTON untuk simpan data) */}
                        <button
                            onClick={() => processOrder('shopee')}
                            className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-sm sm:text-base hover:border-orange-400 hover:shadow-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2"
                        >
                            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />Lihat di Shopee
                        </button>

                        {/* Tombol Komunitas 1 */}
                        <Link href="https://t.me/respondenkuesioner2" target="_blank" className="w-full sm:w-auto bg-blue-50 text-blue-600 border border-blue-200 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-sm sm:text-base hover:bg-blue-100 hover:shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2">
                            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Komunitas 1
                        </Link>

                        {/* Tombol Komunitas 2 */}
                        <Link href="https://t.me/kuesionerpenelitian" target="_blank" className="w-full sm:w-auto bg-blue-50 text-blue-600 border border-blue-200 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-sm sm:text-base hover:bg-blue-100 hover:shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2">
                            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Komunitas 2
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- PRICE TABLE SECTION --- */}
            <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20 max-w-6xl">
                <div className="text-center mb-6 sm:mb-8 md:mb-12"><h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-2 sm:mb-3 md:mb-4">Daftar <span className="text-indigo-600">Harga</span></h2><p className="text-slate-500 text-xs sm:text-sm md:text-base lg:text-xl">Harga per responden berdasarkan jumlah pertanyaan dan waktu pengerjaan</p></div>
                <div className="mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-indigo-50 to-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-indigo-100 shadow-sm"><div className="flex flex-col md:flex-row md:items-start gap-3 sm:gap-4"><div className="flex-shrink-0"><HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-indigo-600" /></div><div className="flex-1"><h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 mb-2 sm:mb-3">Informasi Penting:</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"><div className="space-y-1.5 sm:space-y-2"><h4 className="font-bold text-indigo-700 text-sm sm:text-base">Pilihan Ganda:</h4><ul className="text-xs sm:text-sm text-slate-600 space-y-1"><li className="flex items-start gap-2"><Check className="w-3 h-3 text-green-500 mt-0.5" /><span>Harga tergantung jumlah pertanyaan</span></li><li className="flex items-start gap-2"><Check className="w-3 h-3 text-green-500 mt-0.5" /><span>Maksimal 500 pertanyaan per kuesioner</span></li><li className="flex items-start gap-2"><Check className="w-3 h-3 text-green-500 mt-0.5" /><span>Semakin cepat, semakin mahal</span></li></ul></div><div className="space-y-1.5 sm:space-y-2"><h4 className="font-bold text-indigo-700 text-sm sm:text-base">Esai:</h4><ul className="text-xs sm:text-sm text-slate-600 space-y-1"><li className="flex items-start gap-2"><Banknote className="w-3 h-3 text-blue-500 mt-0.5" /><span><strong>Rp 400</strong> per pertanyaan esai per responden</span></li><li className="flex items-start gap-2"><Clock className="w-3 h-3 text-blue-500 mt-0.5" /><span>Waktu pengerjaan: 4 hari</span></li><li className="flex items-start gap-2"><Users className="w-3 h-3 text-blue-500 mt-0.5" /><span>Minimal 30 responden</span></li></ul></div></div></div></div></div>
                <div className="overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-200 bg-white shadow-lg mb-4 sm:mb-6">
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full min-w-[800px]"><thead><tr className="bg-gradient-to-r from-indigo-50 to-indigo-100"><th className="py-3 md:py-4 px-4 md:px-6 text-left font-bold text-indigo-700 border-b border-indigo-200"><div className="flex items-center gap-2"><Clock className="w-3 h-3 md:w-4 md:h-4" /><span>Waktu</span></div></th><th className="py-3 md:py-4 px-4 md:px-6 text-center font-bold text-indigo-700 border-b border-indigo-200"><div className="flex items-center gap-2 justify-center"><FileText className="w-3 h-3 md:w-4 md:h-4" /><span>Jumlah Pertanyaan</span></div></th><th className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-indigo-700 border-b border-indigo-200"><div className="flex items-center gap-2 justify-end"><Banknote className="w-3 h-3 md:w-4 md:h-4" /><span>Harga/Responden</span></div></th></tr></thead><tbody><tr className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 md:py-4 px-4 md:px-6 align-top"><div className="flex items-center gap-2"><div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div><span className="font-bold text-slate-900 text-sm md:text-base">4 Hari</span></div><p className="text-xs md:text-sm text-slate-600 mt-1">Paling ekonomis</p></td><td className="py-3 md:py-4 px-4 md:px-6 align-top"><div className="space-y-1 md:space-y-2">{[30, 60, 90, 150, 500].map(c => <div key={c} className="text-center font-medium text-slate-700 text-sm md:text-base">{c} pertanyaan</div>)}</div></td><td className="py-3 md:py-4 px-4 md:px-6 align-top text-right"><div className="space-y-1 md:space-y-2">{[400, 800, 1200, 1800, 2500].map(h => <div key={h} className="font-bold text-base md:text-lg text-indigo-600">Rp {formatNumber(h)}</div>)}</div></td></tr><tr className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 md:py-4 px-4 md:px-6 align-top"><div className="flex items-center gap-2"><div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div><span className="font-bold text-slate-900 text-sm md:text-base">2 Hari</span></div><p className="text-xs md:text-sm text-slate-600 mt-1">Cepat</p></td><td className="py-3 md:py-4 px-4 md:px-6 align-top"><div className="space-y-1 md:space-y-2">{[30, 60, 90, 150, 500].map(c => <div key={c} className="text-center font-medium text-slate-700 text-sm md:text-base">{c} pertanyaan</div>)}</div></td><td className="py-3 md:py-4 px-4 md:px-6 align-top text-right"><div className="space-y-1 md:space-y-2">{[800, 1200, 1600, 2200, 3200].map(h => <div key={h} className="font-bold text-base md:text-lg text-indigo-600">Rp {formatNumber(h)}</div>)}</div></td></tr><tr className="hover:bg-slate-50"><td className="py-3 md:py-4 px-4 md:px-6 align-top"><div className="flex items-center gap-2"><div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div><span className="font-bold text-slate-900 text-sm md:text-base">1 Hari</span></div><p className="text-xs md:text-sm text-slate-600 mt-1">Express</p></td><td className="py-3 md:py-4 px-4 md:px-6 align-top"><div className="space-y-1 md:space-y-2">{[30, 60, 90, 150, 500].map(c => <div key={c} className="text-center font-medium text-slate-700 text-sm md:text-base">{c} pertanyaan</div>)}</div></td><td className="py-3 md:py-4 px-4 md:px-6 align-top text-right"><div className="space-y-1 md:space-y-2">{[1200, 1600, 2000, 2800, 4000].map(h => <div key={h} className="font-bold text-base md:text-lg text-indigo-600">Rp {formatNumber(h)}</div>)}</div></td></tr></tbody></table>
                    </div>
                    <div className="md:hidden p-3 space-y-3">
                        <div className="border border-slate-200 rounded-lg p-3 bg-gradient-to-r from-green-50 to-white"><div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div><h3 className="font-bold text-slate-900 text-sm">4 Hari - Paling Ekonomis</h3></div><div className="space-y-2">{[{ p: "30 pertanyaan", h: 400 }, { p: "60 pertanyaan", h: 800 }, { p: "90 pertanyaan", h: 1200 }, { p: "150 pertanyaan", h: 1800 }, { p: "500 pertanyaan", h: 2500 }].map((i, x) => <div key={x} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0"><span className="text-xs font-medium text-slate-700">{i.p}</span><span className="font-bold text-indigo-600 text-sm">Rp {formatNumber(i.h)}</span></div>)}</div></div>
                        <div className="border border-slate-200 rounded-lg p-3 bg-gradient-to-r from-yellow-50 to-white"><div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 bg-yellow-500 rounded-full"></div><h3 className="font-bold text-slate-900 text-sm">2 Hari - Cepat</h3></div><div className="space-y-2">{[{ p: "30 pertanyaan", h: 800 }, { p: "60 pertanyaan", h: 1200 }, { p: "90 pertanyaan", h: 1600 }, { p: "150 pertanyaan", h: 2200 }, { p: "500 pertanyaan", h: 3200 }].map((i, x) => <div key={x} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0"><span className="text-xs font-medium text-slate-700">{i.p}</span><span className="font-bold text-indigo-600 text-sm">Rp {formatNumber(i.h)}</span></div>)}</div></div>
                        <div className="border border-slate-200 rounded-lg p-3 bg-gradient-to-r from-red-50 to-white"><div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 bg-red-500 rounded-full"></div><h3 className="font-bold text-slate-900 text-sm">1 Hari - Express</h3></div><div className="space-y-2">{[{ p: "30 pertanyaan", h: 1200 }, { p: "60 pertanyaan", h: 1600 }, { p: "90 pertanyaan", h: 2000 }, { p: "150 pertanyaan", h: 2800 }, { p: "500 pertanyaan", h: 4000 }].map((i, x) => <div key={x} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0"><span className="text-xs font-medium text-slate-700">{i.p}</span><span className="font-bold text-indigo-600 text-sm">Rp {formatNumber(i.h)}</span></div>)}</div></div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200"><div className="flex items-start gap-2 sm:gap-3"><FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" /><div className="flex-1"><h4 className="font-bold text-blue-800 text-sm sm:text-base mb-1.5 sm:mb-2">Harga Esai (Pertanyaan Terbuka):</h4><div className="bg-white rounded p-2 sm:p-3 border border-blue-100 mb-2"><div className="flex justify-between items-center mb-1"><span className="font-medium text-blue-700 text-xs sm:text-sm">Perhitungan:</span><span className="font-bold text-sm sm:text-base text-blue-600">Rp 400 × jumlah esai</span></div><p className="text-xs text-blue-600"><strong>Contoh:</strong> 5 pertanyaan esai = 5 × Rp 400 = Rp 2.000 per responden</p></div><div className="p-2 bg-amber-50 border border-amber-200 rounded"><div className="flex items-start gap-1.5"><AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 mt-0.5 flex-shrink-0" /><p className="text-xs text-amber-700"><strong>Note:</strong> Minimal order 30 responden untuk semua tipe pertanyaan.</p></div></div></div></div></div>
            </section>

            {/* --- BENEFITS SECTION --- */}
            <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20 max-w-6xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-8 mb-6 sm:mb-8 md:mb-16">
                    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-3xl border border-slate-200 p-3 sm:p-4 md:p-8 text-center hover:shadow-lg transition-shadow"><div className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 bg-green-100 rounded sm:rounded-lg md:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4"><ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8 text-green-600" /></div><h3 className="text-sm sm:text-base md:text-xl font-bold text-slate-900 mb-1 md:mb-2">Data Valid & Reliabel</h3><p className="text-xs sm:text-sm text-slate-600">Hasil pengisian dijamin valid dan reliabel untuk analisis statistik</p></div>
                    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-3xl border border-slate-200 p-3 sm:p-4 md:p-8 text-center hover:shadow-lg transition-shadow"><div className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 bg-blue-100 rounded sm:rounded-lg md:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4"><Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8 text-blue-600" /></div><h3 className="text-sm sm:text-base md:text-xl font-bold text-slate-900 mb-1 md:mb-2">Respon Manusia Asli</h3><p className="text-xs sm:text-sm text-slate-600">100% responden manusia asli, bukan bot atau program</p></div>
                    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-3xl border border-slate-200 p-3 sm:p-4 md:p-8 text-center hover:shadow-lg transition-shadow"><div className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 bg-purple-100 rounded sm:rounded-lg md:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8 text-purple-600" /></div><h3 className="text-sm sm:text-base md:text-xl font-bold text-slate-900 mb-1 md:mb-2">Custom Request</h3><p className="text-xs sm:text-sm text-slate-600">Bisa request jawaban sesuai pola yang diinginkan</p></div>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg sm:rounded-xl md:rounded-3xl p-3 sm:p-4 md:p-8 border border-indigo-100"><div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4"><ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8 text-indigo-600" /><h3 className="text-base sm:text-lg md:text-2xl font-bold text-slate-900">Garansi Kepuasan</h3></div><p className="text-slate-700 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">Kami memberikan garansi validitas dan reliabilitas data. Garansi revisi dapat diajukan jika:</p><ul className="space-y-1 sm:space-y-2"><li className="flex items-start gap-1.5 sm:gap-2"><Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" /><span className="text-xs sm:text-sm md:text-base">Data tidak valid</span></li><li className="flex items-start gap-1.5 sm:gap-2"><Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" /><span className="text-xs sm:text-sm md:text-base">Data tidak reliabel</span></li></ul><div className="mt-2 sm:mt-3 md:mt-4 p-2 sm:p-3 bg-yellow-50 border border-yellow-100 rounded"><div className="flex items-start gap-1.5 sm:gap-2"><AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 mt-0.5 flex-shrink-0" /><p className="text-xs sm:text-sm text-yellow-700"><strong>Catatan:</strong> Garansi hanya berlaku jika syarat di atas terpenuhi ya, Kak.</p></div></div></div>
            </section>

            {/* --- KALKULATOR HARGA --- */}
            <section id="kalkulator" className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20 max-w-4xl">
                <div className="bg-white rounded-xl md:rounded-[2rem] lg:rounded-[3rem] border border-slate-200/60 shadow-xl p-4 sm:p-6 md:p-8 lg:p-12">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
                        <Calculator className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-indigo-600" />
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-slate-900">
                            Kalkulator Harga
                        </h2>
                    </div>

                    <div className="space-y-4 sm:space-y-6 md:space-y-8">

                        {/* --- DATA DIRI PEMESAN --- */}
                        <div className="p-4 sm:p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <User className="w-5 h-5 text-indigo-600" />
                                <h3 className="font-bold text-slate-900 text-lg">Data Pemesan (Wajib Diisi)</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label><input type="text" placeholder="Nama Anda" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" /></div>
                                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Nomor WhatsApp <span className="text-red-500">*</span></label><input type="tel" placeholder="0812xxxx" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" /></div>
                                <div className="md:col-span-2"><label className="block text-sm font-semibold text-slate-700 mb-1">Email <span className="text-red-500">*</span></label><input type="email" placeholder="email@contoh.com" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" /></div>
                            </div>
                        </div>

                        {/* Jumlah Responden (UPDATE: Tombol Manual Lebih Tegas) */}
                        <div>
                            <div className="flex justify-between items-center mb-2 sm:mb-3">
                                <label className="block font-bold text-slate-900 text-sm sm:text-base md:text-lg">
                                    Jumlah Responden
                                </label>
                                <button
                                    type="button"
                                    onClick={() => handleToggleManual('responden')}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${showManualResponden ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <Edit3 className="w-3 h-3" />
                                    {showManualResponden ? "Mode Manual Aktif" : "Input Manual?"}
                                </button>
                            </div>

                            {showManualResponden ? (
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="number" min="30" max="1000" placeholder="30-1000" value={manualResponden} onChange={(e) => setManualResponden(e.target.value)}
                                            className="flex-1 p-2.5 sm:p-3 border-2 border-indigo-500 bg-indigo-50/50 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base font-bold text-indigo-900"
                                        />
                                        <button type="button" onClick={() => handleApplyManual('responden')} className="bg-indigo-600 text-white px-4 rounded-lg font-bold hover:bg-indigo-700 transition-colors text-sm">OK</button>
                                    </div>
                                    <p className="text-xs text-indigo-600 font-medium">Minimal 30 responden, maksimal 1000 responden.</p>
                                </div>
                            ) : (
                                <>{renderSlider(30, 1000, respondenCount, (value) => { setRespondenCount(value); setManualResponden(value.toString()); }, [30, 100, 250, 500, 1000], "Jumlah Responden", "orang", 10)}</>
                            )}
                        </div>

                        {/* Tipe Pertanyaan */}
                        <div>
                            <label className="block font-bold text-slate-900 text-sm sm:text-base md:text-lg mb-2 sm:mb-3">
                                Tipe Pertanyaan
                            </label>
                            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-4">
                                <button type="button" onClick={() => { setTipePertanyaan("pilgan"); setShowManualPertanyaan(false); }} className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 transition-all flex flex-col items-center justify-center ${tipePertanyaan === "pilgan" ? 'bg-indigo-50 border-indigo-600 shadow-sm' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'}`}><div className="font-bold text-slate-900 text-center text-xs sm:text-sm md:text-base">Pilgan</div><div className="text-[10px] sm:text-xs md:text-sm text-slate-600 mt-0.5 text-center">Pilihan Ganda</div></button>
                                <button type="button" onClick={() => { setTipePertanyaan("campuran"); setShowManualPertanyaan(false); }} className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 transition-all flex flex-col items-center justify-center ${tipePertanyaan === "campuran" ? 'bg-indigo-50 border-indigo-600 shadow-sm' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'}`}><div className="font-bold text-slate-900 text-center text-xs sm:text-sm md:text-base">Campuran</div><div className="text-[10px] sm:text-xs md:text-sm text-slate-600 mt-0.5 text-center">Pilgan + Esai</div></button>
                                <button type="button" onClick={() => { setTipePertanyaan("esai"); setShowManualPertanyaan(false); }} className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 transition-all flex flex-col items-center justify-center ${tipePertanyaan === "esai" ? 'bg-indigo-50 border-indigo-600 shadow-sm' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'}`}><div className="font-bold text-slate-900 text-center text-xs sm:text-sm md:text-base">Esai</div><div className="text-[10px] sm:text-xs md:text-sm text-slate-600 mt-0.5 text-center">Essay</div></button>
                            </div>
                        </div>

                        {/* Jumlah Pertanyaan */}
                        <div>
                            <div className="flex justify-between items-center mb-2 sm:mb-3">
                                <label className="block font-bold text-slate-900 text-sm sm:text-base md:text-lg">
                                    Jumlah Pertanyaan
                                </label>
                                {tipePertanyaan !== "campuran" && (
                                    <button
                                        type="button"
                                        onClick={() => handleToggleManual('pertanyaan')}
                                        className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${showManualPertanyaan ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        <Edit3 className="w-3 h-3" />
                                        {showManualPertanyaan ? "Mode Manual Aktif" : "Input Manual?"}
                                    </button>
                                )}
                            </div>

                            {tipePertanyaan === "campuran" ? (
                                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                                    <div className="bg-slate-50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-slate-200">
                                        <div className="flex justify-between items-center mb-2 sm:mb-3">
                                            <div><h3 className="font-bold text-slate-900 text-sm sm:text-base">Pilihan Ganda</h3></div>
                                            <button type="button" onClick={() => handleToggleManual('pilgan')} className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 transition-all ${showManualPilgan ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{showManualPilgan ? "Manual ON" : "Manual?"}</button>
                                        </div>
                                        {showManualPilgan ? (
                                            <div className="flex gap-2"><input type="number" min="1" max="500" value={manualPilgan} onChange={(e) => setManualPilgan(e.target.value)} className="flex-1 p-2 border-2 border-indigo-500 bg-indigo-50 rounded-lg font-bold text-indigo-900" /><button type="button" onClick={() => handleApplyManual('pilgan')} className="bg-indigo-600 text-white px-3 rounded-lg font-bold">OK</button></div>
                                        ) : (
                                            <>{renderSlider(1, 500, pilganCount, (value) => { setPilganCount(value); setManualPilgan(value.toString()); }, [30, 60, 90, 150, 300, 500], "Pilihan Ganda", "soal", 5)}</>
                                        )}
                                    </div>
                                    <div className="bg-slate-50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-slate-200">
                                        <div className="flex justify-between items-center mb-2 sm:mb-3">
                                            <div><h3 className="font-bold text-slate-900 text-sm sm:text-base">Esai</h3></div>
                                            <button type="button" onClick={() => handleToggleManual('esai')} className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 transition-all ${showManualEsai ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{showManualEsai ? "Manual ON" : "Manual?"}</button>
                                        </div>
                                        {showManualEsai ? (
                                            <div className="flex gap-2"><input type="number" min="0" max="500" value={manualEsai} onChange={(e) => setManualEsai(e.target.value)} className="flex-1 p-2 border-2 border-indigo-500 bg-indigo-50 rounded-lg font-bold text-indigo-900" /><button type="button" onClick={() => handleApplyManual('esai')} className="bg-indigo-600 text-white px-3 rounded-lg font-bold">OK</button></div>
                                        ) : (
                                            <>{renderSlider(0, 500, esaiCount, (value) => { setEsaiCount(value); setManualEsai(value.toString()); }, [0, 1, 5, 10, 20, 50], "Jumlah Esai", "soal", 1)}</>
                                        )}
                                    </div>
                                </div>
                            ) : showManualPertanyaan ? (
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="number" min="1" max="500" placeholder="1-500" value={manualPertanyaan} onChange={(e) => setManualPertanyaan(e.target.value)}
                                            className="flex-1 p-2.5 sm:p-3 border-2 border-indigo-500 bg-indigo-50/50 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base font-bold text-indigo-900"
                                        />
                                        <button type="button" onClick={() => handleApplyManual('pertanyaan')} className="bg-indigo-600 text-white px-4 rounded-lg font-bold hover:bg-indigo-700 transition-colors text-sm">OK</button>
                                    </div>
                                    <p className="text-xs text-indigo-600 font-medium">Maksimal 500 pertanyaan.</p>
                                </div>
                            ) : (
                                <div>
                                    {tipePertanyaan === "esai" ? (
                                        <>{renderSlider(1, 500, pertanyaanCount, (value) => { setPertanyaanCount(value); setManualPertanyaan(value.toString()); }, [1, 5, 10, 20, 50, 100, 200, 500], "Pertanyaan Esai", "soal", 1)}</>
                                    ) : (
                                        <>{renderSlider(1, 500, pertanyaanCount, (value) => { setPertanyaanCount(value); setManualPertanyaan(value.toString()); }, [30, 60, 90, 150, 300, 500], "Pertanyaan Pilgan", "soal", 5)}</>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Link Kuesioner */}
                        <div>
                            <label className="block font-bold text-slate-900 text-sm sm:text-base md:text-lg mb-2 sm:mb-3">
                                Link Kuesioner <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="flex-shrink-0"><LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" /></div>
                                    <div className="relative flex-1">
                                        <input
                                            type="url"
                                            placeholder="Link Google Form / Lainnya..."
                                            value={questionnaireLink}
                                            onChange={(e) => setQuestionnaireLink(e.target.value)}
                                            className="w-full p-2.5 sm:p-3 md:p-3.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                                        />
                                        {questionnaireLink && isValidUrl(questionnaireLink) && (
                                            <a href={questionnaireLink.startsWith('http') ? questionnaireLink : `https://${questionnaireLink}`} target="_blank" rel="noopener noreferrer" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-700">
                                                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500">* Paste link kuesioner Anda di sini.</p>
                            </div>
                        </div>

                        {/* Waktu Pengerjaan */}
                        <div>
                            <label className="block font-bold text-slate-900 text-sm sm:text-base md:text-lg mb-2 sm:mb-3">Waktu Pengerjaan</label>
                            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-4">
                                <button type="button" onClick={() => setHariPengerjaan(4)} className={`p-2 sm:p-3 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all flex flex-col items-center justify-center ${hariPengerjaan === 4 ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-700 shadow-lg' : 'bg-white border-slate-300 hover:border-indigo-400 hover:shadow-md'}`}><div className="font-bold text-sm sm:text-base md:text-lg">4 Hari</div><div className="text-[10px] sm:text-xs md:text-sm mt-0.5">Termurah</div></button>
                                <button type="button" onClick={() => setHariPengerjaan(2)} className={`p-2 sm:p-3 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all flex flex-col items-center justify-center ${hariPengerjaan === 2 ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-700 shadow-lg' : 'bg-white border-slate-300 hover:border-indigo-400 hover:shadow-md'}`}><div className="font-bold text-sm sm:text-base md:text-lg">2 Hari</div><div className="text-[10px] sm:text-xs md:text-sm mt-0.5">Cepat</div></button>
                                <button type="button" onClick={() => setHariPengerjaan(1)} className={`p-2 sm:p-3 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all flex flex-col items-center justify-center ${hariPengerjaan === 1 ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-700 shadow-lg' : 'bg-white border-slate-300 hover:border-indigo-400 hover:shadow-md'}`}><div className="font-bold text-sm sm:text-base md:text-lg">1 Hari</div><div className="text-[10px] sm:text-xs md:text-sm mt-0.5">Express</div></button>
                            </div>
                        </div>

                        {/* Metode Pembayaran */}
                        <div>
                            <label className="block font-bold text-slate-900 text-sm sm:text-base md:text-lg mb-2 sm:mb-3">Metode Pembayaran</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 md:gap-4">
                                <button type="button" onClick={() => setPaymentMethod("bca")} className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 transition-all flex flex-col items-center justify-center ${paymentMethod === "bca" ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-500 shadow-lg' : 'bg-white border-slate-300 hover:border-blue-400 hover:shadow-md'}`}><div className="flex items-center justify-center mb-1 sm:mb-2"><Banknote className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-blue-600" /></div><div className="font-bold text-slate-900 text-xs sm:text-sm">BCA</div><div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-medium">8614021834</div></button>
                                <button type="button" onClick={() => setPaymentMethod("bni")} className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 transition-all flex flex-col items-center justify-center ${paymentMethod === "bni" ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-500 shadow-lg' : 'bg-white border-slate-300 hover:border-green-400 hover:shadow-md'}`}><div className="flex items-center justify-center mb-1 sm:mb-2"><Wallet className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-green-600" /></div><div className="font-bold text-slate-900 text-xs sm:text-sm">BNI</div><div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-medium">0842143940</div></button>
                                <button type="button" onClick={() => setPaymentMethod("dana")} className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 transition-all flex flex-col items-center justify-center ${paymentMethod === "dana" ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-500 shadow-lg' : 'bg-white border-slate-300 hover:border-indigo-400 hover:shadow-md'}`}><div className="flex items-center justify-center mb-1 sm:mb-2"><Smartphone className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-indigo-600" /></div><div className="font-bold text-slate-900 text-xs sm:text-sm">Dana</div><div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-medium">0852-3611-0219</div></button>
                                <button type="button" onClick={() => setPaymentMethod("shopee")} className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 transition-all flex flex-col items-center justify-center ${paymentMethod === "shopee" ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-500 shadow-lg' : 'bg-white border-slate-300 hover:border-orange-400 hover:shadow-md'}`}><div className="flex items-center justify-center mb-1 sm:mb-2"><ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-orange-500" /></div><div className="font-bold text-slate-900 text-xs sm:text-sm">Shopee</div><div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-medium">Shopee Pay</div></button>
                            </div>
                            <div className="mt-3 sm:mt-4 p-2 sm:p-3 md:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl border-2 border-green-200">
                                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5">
                                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-600" />
                                    <span className="font-bold text-green-800 text-sm sm:text-base md:text-lg">Konfirmasi via WhatsApp:</span>
                                </div>
                                <div className="space-y-0.5 text-xs sm:text-sm text-green-700 pl-4 sm:pl-6 md:pl-8">
                                    <div><strong>Nomor:</strong> 0852-3611-0219</div>
                                    <div><strong>Nama:</strong> Salsabella Ajeng Syahtry</div>
                                </div>
                            </div>
                        </div>

                        {/* Request Khusus (DENGAN PENJELASAN & CONTOH) */}
                        <div>
                            <label className="block font-bold text-slate-900 text-sm sm:text-base md:text-lg mb-2 sm:mb-3">
                                Request Khusus (Opsional)
                            </label>
                            <textarea
                                placeholder="Contoh: Saya butuh responden khusus domisili Jakarta, atau tolong variasi jawaban dibuat senatural mungkin..."
                                value={specialRequest}
                                onChange={(e) => setSpecialRequest(e.target.value)}
                                rows={3}
                                className="w-full p-2.5 sm:p-3 md:p-4 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm sm:text-base"
                            />
                            {/* INFO BOX CONTOH */}
                            <div className="mt-2 bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs sm:text-sm text-indigo-800">
                                <div className="flex items-center gap-1.5 font-bold mb-1">
                                    <Lightbulb className="w-4 h-4" />
                                    Contoh Request yang Bisa Kami Bantu:
                                </div>
                                <ul className="list-disc list-inside space-y-0.5 pl-1 opacity-90">
                                    <li><strong>Kriteria Responden:</strong> Gender, Domisili, Usia, Pekerjaan.</li>
                                    <li><strong>Variasi Jawaban:</strong> Pola acak/natural (tidak lurus).</li>
                                    <li><strong>Format Bukti:</strong> Perlu screenshot Google Form?</li>
                                    <li><strong>Lainnya:</strong> Request pengerjaan bertahap.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Total Harga & Chat Template */}
                        <div className="bg-gradient-to-r from-indigo-50 to-white p-4 sm:p-6 md:p-8 rounded-xl md:rounded-3xl border-2 border-indigo-100 shadow-lg">
                            <div className="text-center mb-3 sm:mb-4 md:mb-6">
                                <h4 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">Total Investasi Anda:</h4>
                                <div className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-indigo-600 mb-1.5 sm:mb-2 md:mb-3">Rp {formatNumber(totalPrice)}</div>
                                <p className="text-slate-600 text-xs sm:text-sm md:text-lg">{showManualResponden ? parseInt(manualResponden) || 0 : respondenCount} responden × Rp {formatNumber(totalPrice / (showManualResponden ? parseInt(manualResponden) || 1 : respondenCount))}/responden</p>
                            </div>

                            {/* Chat Template Preview */}
                            <div className="mt-3 sm:mt-4 md:mt-6 relative">
                                <div className="flex items-center justify-between mb-1.5 sm:mb-2 md:mb-3">
                                    <label className="block font-bold text-slate-900 text-sm sm:text-base md:text-lg flex items-center gap-1.5 sm:gap-2">
                                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                        Template Pesan WhatsApp
                                    </label>
                                    <button
                                        onClick={handleCopyTemplate}
                                        className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded-md transition-colors"
                                    >
                                        {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {isCopied ? "Disalin!" : "Salin Pesan"}
                                    </button>
                                </div>
                                <div className="bg-slate-50 p-2 sm:p-3 md:p-4 rounded border border-slate-200">
                                    <textarea value={chatTemplate} onChange={(e) => setChatTemplate(e.target.value)} rows={6} className="w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none text-slate-700 text-xs sm:text-sm md:text-base" />
                                </div>
                            </div>

                            {/* TOMBOL AKSI */}
                            <div className="mt-6 sm:mt-8 flex flex-col md:flex-row gap-3 justify-center items-stretch">
                                <button
                                    onClick={() => processOrder('whatsapp')}
                                    disabled={isSubmitting}
                                    className={`flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-bold text-base md:text-lg transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none hover:from-green-600 hover:to-green-700`}
                                >
                                    {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</> : <><MessageCircle className="w-5 h-5" /> Pesan via WhatsApp</>}
                                </button>
                                <button
                                    onClick={() => processOrder('shopee')}
                                    disabled={isSubmitting}
                                    className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-orange-500 border-2 border-orange-500 px-6 py-4 rounded-xl font-bold text-base md:text-lg transition-all shadow-md hover:bg-orange-50 active:scale-95"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    Pesan di Shopee
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <footer className="container mx-auto px-4 sm:px-6 pb-8 sm:pb-12 md:pb-20 text-center">
                <div className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-24 bg-white border border-slate-200 rounded-lg sm:rounded-xl md:rounded-3xl lg:rounded-[5rem] shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-50/50 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full -z-10 origin-center"></div>
                    <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xl sm:text-2xl md:text-4xl lg:text-6xl xl:text-8xl font-black mb-3 sm:mb-4 md:mb-10 tracking-tight leading-[1.1] text-slate-900">
                        Siap Order <br className="hidden sm:block" />
                        <span className="text-indigo-600 block md:inline">Kuesioner?</span>
                    </motion.h2>
                    <div className="mb-3 sm:mb-4 md:mb-10 max-w-2xl mx-auto">
                        <p className="text-slate-600 text-xs sm:text-sm md:text-lg">Sudah menghitung biaya dan siap memesan? Gunakan kalkulator di atas untuk membuat pesanan Anda!</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 md:gap-4 justify-center items-center">
                        <Link href="#kalkulator" className="inline-flex items-center gap-1.5 sm:gap-2 md:gap-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 sm:px-6 md:px-12 lg:px-16 py-2.5 sm:py-3 md:py-4 lg:py-6 rounded-lg sm:rounded-xl md:rounded-3xl font-bold sm:font-black text-sm sm:text-base md:text-lg lg:text-xl shadow-xl hover:from-indigo-700 hover:to-indigo-800 transition-all hover:scale-105 active:scale-95 group">Hitung & Pesan Sekarang <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-6 md:h-7 lg:w-8 lg:h-8 group-hover:rotate-12 transition-transform" /></Link>
                        <button onClick={() => processOrder('shopee')} className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-3 bg-white text-slate-800 border-2 border-slate-300 px-3 sm:px-4 md:px-10 py-2 sm:py-2.5 md:py-4 rounded-lg sm:rounded-xl md:rounded-3xl font-bold hover:border-orange-400 hover:shadow-sm transition-all active:scale-95 text-xs sm:text-sm md:text-base"><ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-orange-500" />Lihat di Shopee</button>
                    </div>
                </div>
            </footer>
        </main>
    );
}