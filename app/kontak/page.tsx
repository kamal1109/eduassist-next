"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { submitContact } from "@/app/actions/contact"; // Pastikan import ini benar

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });

    // Handle saat form dikirim
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Mencegah reload halaman
        setIsSubmitting(true);
        setStatus({ type: null, message: "" });

        const formData = new FormData(e.currentTarget);

        // Kirim ke Server Action
        const result = await submitContact(formData);

        if (result.success) {
            // PERBAIKAN: Pesan sukses ditulis manual, bukan dari result.success (karena tipe datanya boolean)
            setStatus({
                type: 'success',
                message: "Pesan Anda berhasil dikirim! Tim kami akan segera menghubungi Anda."
            });
            (e.target as HTMLFormElement).reset(); // Kosongkan form
        } else {
            setStatus({
                type: 'error',
                message: result.error || "Maaf, terjadi kesalahan saat mengirim pesan."
            });
        }

        setIsSubmitting(false);
    };

    return (
        <main className="min-h-screen bg-white">

            {/* --- HEADER SECTION --- */}
            <section className="bg-slate-50 pt-32 pb-20 px-4 border-b border-slate-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Hubungi Tim <span className="text-indigo-600">EduAssist</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Punya pertanyaan seputar bimbingan skripsi, olah data, atau riset pasar?
                        Kami siap membantu Anda kapan saja.
                    </p>
                </div>
            </section>

            {/* --- CONTENT SECTION --- */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

                        {/* KOLOM KIRI: INFO KONTAK */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Informasi Kontak</h2>
                            <div className="space-y-8">

                                {/* Item 1: WhatsApp */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">WhatsApp / Telepon</h3>
                                        <p className="text-slate-500 text-sm mb-2">Respon cepat (09:00 - 21:00)</p>
                                        <a href="https://wa.me/628123456789" target="_blank" className="text-green-600 font-bold hover:underline">
                                            +62 812-3456-7890
                                        </a>
                                    </div>
                                </div>

                                {/* Item 2: Email */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Email Official</h3>
                                        <p className="text-slate-500 text-sm mb-2">Untuk kerjasama & penawaran resmi</p>
                                        <a href="mailto:admin@eduassist.id" className="text-indigo-600 font-bold hover:underline">
                                            admin@eduassist.id
                                        </a>
                                    </div>
                                </div>

                                {/* Item 3: Alamat */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Kantor Pusat</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            Jl. Pendidikan No. 101, Kampus Universitas Indonesia,<br />
                                            Depok, Jawa Barat 16424
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* KOLOM KANAN: FORMULIR */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Kirim Pesan</h2>
                            <p className="text-slate-400 text-sm mb-6">Silakan isi formulir di bawah ini.</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Nama */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Contoh: Budi Santoso"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none font-medium text-slate-700"
                                    />
                                </div>

                                {/* Grid Email & HP */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="email@anda.com"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none font-medium text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">WhatsApp (Opsional)</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="0812..."
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none font-medium text-slate-700"
                                        />
                                    </div>
                                </div>

                                {/* Pesan */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Pesan / Kendala Anda</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={4}
                                        placeholder="Ceritakan kebutuhan riset atau skripsi Anda..."
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none font-medium text-slate-700 resize-none"
                                    ></textarea>
                                </div>

                                {/* Notifikasi Status */}
                                {status.type && (
                                    <div className={`p-4 rounded-xl flex items-start gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                        {status.type === 'success' ? <CheckCircle className="shrink-0" size={20} /> : <AlertCircle className="shrink-0" size={20} />}
                                        <p className="text-sm font-bold">{status.message}</p>
                                    </div>
                                )}

                                {/* Tombol Submit */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" /> Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} /> Kirim Pesan Sekarang
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}