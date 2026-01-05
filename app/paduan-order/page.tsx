"use client";
import { MessageSquare, Link as LinkIcon, Settings, CreditCard, Send, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const steps = [
    { icon: <MessageSquare />, title: "Chat Admin", desc: "Hubungi admin via WhatsApp untuk konsultasi awal kuesioner Anda." },
    { icon: <LinkIcon />, title: "Kirim Link", desc: "Kirimkan link Google Form atau link riset yang ingin diisi." },
    { icon: <Settings />, title: "Request Pola", desc: "Berikan detail kriteria responden dan pola jawaban yang Anda butuhkan." },
    { icon: <CreditCard />, title: "Pembayaran", desc: "Lakukan pembayaran sesuai instruksi admin setelah detail disepakati." },
    { icon: <Send />, title: "Proses Kilat", desc: "Admin memproses pengisian. Tersedia paket express untuk hasil lebih cepat." },
    { icon: <CheckCircle />, title: "Selesai", desc: "Cek hasil pengisian di kuesioner Anda. Berikan ulasan jika sudah sesuai!" },
];

export default function PanduanOrder() {
    return (
        <main className="pt-32 pb-20 container mx-auto px-6 max-w-4xl">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 font-bold mb-10 hover:text-blue-600 transition">
                <ArrowLeft size={20} /> Kembali ke Beranda
            </Link>
            <h1 className="text-4xl md:text-6xl font-black mb-12 tracking-tight text-center">Alur <span className="text-blue-600">Pemesanan.</span></h1>
            <div className="grid gap-8">
                {steps.map((step, i) => (
                    <div key={i} className="flex flex-col md:flex-row items-center gap-6 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
                            {step.icon}
                        </div>
                        <div className="md:text-left text-center">
                            <h3 className="text-2xl font-black mb-1 text-slate-900">{i + 1}. {step.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-16 flex flex-col md:flex-row justify-center gap-4">
                <Link href="https://wa.me/628123456789" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-lg hover:scale-105 transition-transform text-center">
                    Hubungi Admin Sekarang
                </Link>
            </div>
        </main>
    );
}