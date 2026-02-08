"use client";

import Link from "next/link";
import { MessageCircle, Instagram, Mail, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 max-w-[1600px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    {/* 1. Brand & Deskripsi */}
                    <div>
                        <Link href="/" className="flex items-center gap-1 mb-6">
                            <div className="text-2xl font-black tracking-tighter flex items-center">
                                <span className="text-[#f9a825]">EDU</span>
                                <span className="text-[#0a4191]">ASSIST</span>
                                <span className="text-[#0a4191]">.</span>
                            </div>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Solusi nomor 1 bagi mahasiswa Indonesia untuk mendapatkan responden kuesioner yang valid, cepat, dan terpercaya. Lulus tepat waktu bukan lagi mimpi.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://instagram.com" target="_blank" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="mailto:admin@eduassist.id" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    {/* 2. Quick Links */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 text-lg">Menu Navigasi</h4>
                        <ul className="space-y-4 text-sm text-slate-500 font-medium">
                            <li><Link href="/" className="hover:text-indigo-600 transition-colors">Beranda</Link></li>
                            <li><Link href="/layanan" className="hover:text-indigo-600 transition-colors">Layanan & Harga</Link></li>
                            <li><Link href="/paduan-order" className="hover:text-indigo-600 transition-colors">Panduan Order</Link></li>
                            <li><Link href="/artikel" className="hover:text-indigo-600 transition-colors">Artikel & Edukasi</Link></li>
                            <li><Link href="/tentang" className="hover:text-indigo-600 transition-colors">Tentang Kami</Link></li>
                        </ul>
                    </div>

                    {/* 3. Layanan */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 text-lg">Layanan Kami</h4>
                        <ul className="space-y-4 text-sm text-slate-500 font-medium">
                            <li>Penyebaran Kuesioner</li>
                            <li>Filter Responden Spesifik</li>
                            <li>Uji Validitas Data</li>
                            <li>Olah Data Statistik</li>
                            <li>Konsultasi Judul Skripsi</li>
                        </ul>
                    </div>

                    {/* 4. Kontak */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 text-lg">Hubungi Kami</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li className="flex items-start gap-3">
                                <MessageCircle size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                                <span>
                                    <strong>WhatsApp Admin:</strong><br />
                                    <a href="https://wa.me/6285236110219" target="_blank" className="hover:text-indigo-600 underline decoration-slate-300 underline-offset-4">+62 852-3611-0219</a>
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                                <span>
                                    <strong>Lokasi:</strong><br />
                                    Jakarta, Indonesia
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-slate-100 pt-8 text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} EduAssist Indonesia. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}