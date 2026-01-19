"use client";
import { MessageSquare, Link as LinkIcon, Settings, CreditCard, Send, CheckCircle, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const steps = [
    { icon: <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />, title: "Chat Admin", desc: "Hubungi admin via WhatsApp untuk konsultasi awal kuesioner Anda." },
    { icon: <LinkIcon className="w-5 h-5 md:w-6 md:h-6" />, title: "Kirim Link", desc: "Kirimkan link Google Form atau link riset yang ingin diisi." },
    { icon: <Settings className="w-5 h-5 md:w-6 md:h-6" />, title: "Request Pola", desc: "Berikan detail kriteria responden dan pola jawaban yang Anda butuhkan." },
    { icon: <CreditCard className="w-5 h-5 md:w-6 md:h-6" />, title: "Pembayaran", desc: "Lakukan pembayaran sesuai instruksi admin setelah detail disepakati." },
    { icon: <Send className="w-5 h-5 md:w-6 md:h-6" />, title: "Proses Kilat", desc: "Admin memproses pengisian. Tersedia paket express untuk hasil lebih cepat." },
    { icon: <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />, title: "Selesai", desc: "Cek hasil pengisian di kuesioner Anda. Berikan ulasan jika sudah sesuai!" },
];

export default function PanduanOrder() {
    return (
        <main className="bg-[#F8FAFC] text-slate-900 overflow-x-hidden min-h-screen selection:bg-indigo-100 selection:text-indigo-700">
            {/* --- HERO SECTION --- */}
            <section className="relative pt-28 pb-12 md:pt-32 md:pb-24 px-4 sm:px-6 overflow-hidden bg-white">
                <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/70 via-white to-transparent -z-10"></div>

                <div className="container mx-auto max-w-6xl text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 font-bold mb-6 md:mb-10 hover:text-indigo-600 transition group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm md:text-base">Kembali ke Beranda</span>
                    </Link>

                    <div className="mb-8 md:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tight text-slate-900">
                            Alur <span className="text-indigo-600 relative inline-block">
                                Pemesanan
                                <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-slate-500 text-base md:text-xl max-w-2xl mx-auto font-medium">
                            Panduan lengkap untuk memesan jasa pengisian kuesioner di EduAssist. Mudah, Cepat, dan Amanah.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- STEPS SECTION --- */}
            <section className="container mx-auto px-4 sm:px-6 py-12 md:py-20 max-w-4xl">
                <div className="mb-8 md:mb-12 bg-gradient-to-r from-indigo-50 to-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-indigo-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-indigo-100 text-indigo-600 rounded-lg p-2 shrink-0">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-1">Info Penting:</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Minimal order 30 responden. Waktu pengerjaan mulai dari 4 hari. Harga mulai Rp 2.000 per responden.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 md:space-y-6 relative">
                    {/* Garis Vertikal Konektor (Mobile Only) */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 md:hidden -z-10"></div>

                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className="bg-white p-4 md:p-6 lg:p-8 rounded-xl md:rounded-[2.5rem] border border-slate-200/60 shadow-lg shadow-slate-200/20 hover:shadow-xl hover:border-indigo-200 transition-all group relative"
                        >
                            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                                {/* Number Badge */}
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 group-hover:rotate-3 transition-transform z-10 relative">
                                        {step.icon}
                                    </div>
                                    <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-indigo-100 text-indigo-600 font-black rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs md:text-sm border-2 border-white z-20">
                                        {i + 1}
                                    </div>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-lg md:text-2xl font-black mb-1 md:mb-2 text-slate-900">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>

                                {/* Chevron for mobile */}
                                <ChevronRight className="w-5 h-5 text-slate-400 md:hidden group-hover:text-indigo-600 transition-colors" />
                            </div>

                            {/* Timeline connector for desktop */}
                            {i < steps.length - 1 && (
                                <div className="hidden md:block mt-6">
                                    <div className="flex justify-center items-center gap-4">
                                        <div className="h-0.5 w-full bg-slate-100"></div>
                                        <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0">
                                            Selanjutnya
                                        </div>
                                        <div className="h-0.5 w-full bg-slate-100"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 md:p-6 rounded-xl border border-green-200">
                        <h4 className="font-bold text-green-800 mb-2">Garansi Kepuasan:</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Data valid & reliabel</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Responden manusia asli 100%</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Revisi jika data tidak valid</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 md:p-6 rounded-xl border border-amber-200">
                        <h4 className="font-bold text-amber-800 mb-2">Tips Sukses Order:</h4>
                        <ul className="text-sm text-amber-700 space-y-1">
                            <li className="flex items-start gap-2">
                                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 font-bold">•</div>
                                <span>Siapkan link kuesioner dan kriteria</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 font-bold">•</div>
                                <span>Diskusikan pola jawaban yang diinginkan</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 font-bold">•</div>
                                <span>Konfirmasi detail sebelum pembayaran</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-12 md:mt-16 text-center bg-slate-900 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -ml-16 -mb-16"></div>

                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-4xl font-black mb-4">Siap Memulai Pesanan?</h3>
                        <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-sm md:text-lg">
                            Ikuti alur di atas dan hubungi admin kami via WhatsApp untuk konsultasi gratis. Kami siap membantu riset Anda sampai tuntas.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                            <Link
                                href="https://wa.me/6285236110219"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 md:px-10 py-3 md:py-4 rounded-xl font-bold md:font-black text-base md:text-lg shadow-xl hover:from-green-600 hover:to-green-700 transition-all hover:-translate-y-1 active:scale-95"
                            >
                                <MessageSquare className="w-5 h-5" />
                                <span>Hubungi via WhatsApp</span>
                            </Link>

                            <Link
                                href="/layanan"
                                className="inline-flex items-center justify-center gap-2 md:gap-3 bg-white text-slate-900 px-6 md:px-10 py-3 md:py-4 rounded-xl font-bold md:font-black text-base md:text-lg hover:bg-slate-50 transition-all active:scale-95"
                            >
                                <span>Lihat Kalkulator Harga</span>
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 text-xs text-slate-400">
                            Admin WhatsApp: 0852-3611-0219 (Salsabella Ajeng Syahtry) • Respon Cepat
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}