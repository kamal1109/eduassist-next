"use client";

import { useState, useEffect } from "react";
import {
    Trash2, Shield, UserPlus, AlertTriangle, CheckCircle, Loader2, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Import aman
import { getAdminList, createNewAdmin, deleteAdmin } from "@/app/actions/admin"; // Import server action

export default function UsersPage() {
    const router = useRouter();

    // --- STATE DATA ---
    const [admins, setAdmins] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- STATE FORM ---
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // 1. Load Data saat halaman dibuka
    useEffect(() => {
        loadAdmins();
    }, []);

    const loadAdmins = async () => {
        setIsLoading(true);
        // Kita ambil data dari Server Action (auth.users)
        const data = await getAdminList();
        setAdmins(data || []);
        setIsLoading(false);
    };

    // 2. Handle Tambah Admin Baru
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const res = await createNewAdmin(formData);

        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else {
            setMessage({ type: 'success', text: "Admin baru berhasil ditambahkan!" });
            setShowForm(false);
            loadAdmins(); // Refresh tabel otomatis
            (e.target as HTMLFormElement).reset();
        }
        setIsSubmitting(false);
    };

    // 3. Handle Hapus Admin
    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Yakin ingin MENGHAPUS akses login untuk ${email}?`)) return;

        const res = await deleteAdmin(id, email);
        if (res.error) {
            alert("GAGAL: " + res.error);
        } else {
            alert("Sukses! User berhasil dihapus.");
            loadAdmins();
        }
    };

    return (
        <div className="w-full min-h-full bg-[#F8FAFC]">

            {/* --- HEADER STICKY --- */}
            <div className="sticky top-0 z-20 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200 px-4 py-4 sm:px-8 sm:py-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <Link href="/admin/dashboard" className="font-bold hover:text-indigo-600">Dashboard</Link>
                            <ChevronRight size={14} />
                            <span className="text-indigo-600 font-bold">Users</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Manajemen Admin</h1>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition flex items-center gap-2 text-sm"
                    >
                        {showForm ? "Batal Tambah" : <><UserPlus size={18} /> Tambah Admin</>}
                    </button>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="p-4 sm:p-8 max-w-7xl mx-auto pb-24">

                {/* FORM INPUT ADMIN BARU */}
                {showForm && (
                    <div className="bg-white border border-indigo-100 p-6 rounded-2xl shadow-sm mb-8 animate-in slide-in-from-top-4">
                        <h3 className="font-bold text-slate-900 mb-4">Input Data Admin Baru</h3>
                        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-start">
                            <div className="flex-1 w-full">
                                <input name="email" type="email" placeholder="Email Login" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none text-sm" />
                            </div>
                            <div className="flex-1 w-full">
                                <input name="password" type="password" placeholder="Password (Min. 6 Karakter)" required minLength={6} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none text-sm" />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 text-sm">
                                {isSubmitting ? "Menyimpan..." : "Simpan Admin"}
                            </button>
                        </form>
                    </div>
                )}

                {/* NOTIFIKASI */}
                {message && (
                    <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                        <span className="font-bold text-sm">{message.text}</span>
                    </div>
                )}

                {/* TABEL LIST ADMIN */}
                <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Daftar Admin Aktif</h3>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
                            <Loader2 className="animate-spin text-indigo-600" />
                            <span className="text-sm">Memuat data user...</span>
                        </div>
                    ) : admins.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">Belum ada data admin.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                        <th className="pb-4 pl-2">Email Admin</th>
                                        <th className="pb-4">Role</th>
                                        <th className="pb-4 hidden sm:table-cell">Terdaftar</th>
                                        <th className="pb-4 text-right pr-2">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium text-slate-600">
                                    {admins.map((admin) => (
                                        <tr key={admin.id} className="group hover:bg-slate-50 transition">
                                            <td className="py-4 pl-2 border-b border-slate-50 text-slate-900 font-bold">
                                                {admin.email}
                                            </td>
                                            <td className="py-4 border-b border-slate-50">
                                                {admin.is_super_admin ? (
                                                    <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-md uppercase tracking-wide font-black border border-amber-200 flex items-center gap-1 w-fit">
                                                        <Shield size={10} /> SUPER ADMIN
                                                    </span>
                                                ) : (
                                                    <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md text-[10px] font-bold uppercase border border-indigo-100">
                                                        Admin
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 border-b border-slate-50 hidden sm:table-cell">
                                                {new Date(admin.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="py-4 pr-2 border-b border-slate-50 text-right">
                                                {admin.is_super_admin ? (
                                                    <button disabled className="text-slate-300 cursor-not-allowed p-2" title="Super Admin tidak bisa dihapus">
                                                        <Shield size={18} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDelete(admin.id, admin.email)}
                                                        className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
                                                        title="Hapus Akses Login"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}