"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4 text-center">

            {/* Icon Besar */}
            <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mb-8 shadow-lg shadow-red-100 animate-bounce">
                <AlertTriangle size={48} className="text-red-500" />
            </div>

            {/* Teks */}
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
                Halaman Tidak <span className="text-indigo-600">Ditemukan</span>
            </h1>
            <p className="text-slate-500 text-lg mb-10 max-w-lg mx-auto">
                Ups! Sepertinya link yang kamu tuju salah atau halaman tersebut sudah dihapus oleh admin.
            </p>

            {/* Tombol Balik */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
            >
                <ArrowLeft size={20} /> Kembali ke Beranda
            </Link>

        </div>
    );
}