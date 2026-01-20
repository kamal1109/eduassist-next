"use client";

import { useState, useEffect } from "react";
import {
    Trash2, Shield, UserPlus, AlertTriangle, CheckCircle, Loader2, ChevronRight, Lock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getAdminList, createNewAdmin, deleteAdmin } from "@/app/actions/admin";

export default function UsersPage() {
    const router = useRouter();

    // --- STATE DATA ---
    const [admins, setAdmins] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // --- STATE FORM ---
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // 1. Load Data & Validasi Sesi
    useEffect(() => {
        const initPage = async () => {
            setIsLoading(true);

            // Cek sesi user yang sedang login
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push("/admin/login");
                return;
            }

            setCurrentUser(session.user);
            await loadAdmins();
        };

        initPage();
    }, [router]);

    const loadAdmins = async () => {
        const data = await getAdminList();
        setAdmins(data || []);
        setIsLoading(false);
    };

    // 2. Handle Tambah Admin Baru
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Proteksi Tambahan: Hanya email terdaftar tertentu yang bisa tambah admin (Opsional)
        // Jika ingin lebih ketat, logic ini harus ada di Server Action (createNewAdmin)

        setIsSubmitting(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const res = await createNewAdmin(formData);

        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else {
            setMessage({ type: 'success', text: "Admin baru berhasil ditambahkan!" });
            setShowForm(false);
            loadAdmins();
            (e.target as HTMLFormElement).reset();
        }
        setIsSubmitting(false);
    };

    // 3. Handle Hapus Admin
    const handleDelete = async (id: string, email: string) => {
        // Jangan biarkan user menghapus dirinya sendiri
        if (id === currentUser?.id) {
            alert("Anda tidak bisa menghapus akun Anda sendiri demi alasan keamanan.");
            return;
        }

        if (!confirm(`PERINGATAN: Menghapus ${email} akan menghilangkan akses login mereka selamanya. Lanjutkan?`)) return;

        const res = await deleteAdmin(id, email);
        if (res.error) {
            alert("GAGAL: " + res.error);
        } else {
            alert("Sukses! Akses admin telah dicabut.");
            loadAdmins();
        }
    };

    if (isLoading && !currentUser) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
                <Loader2 className="animate-spin text-indigo-600 w-10 h-10 mb-4" />
                <p className="text-slate-400 font-bold text-xs tracking-widest">MEMUAT SISTEM KEAMANAN...</p>
            </div>
        );
    }
    // Jangan biarkan user menghapus dirinya sendiri
    return (
        <div className="w-full min-h-full bg-[#F8FAFC]">

            {/* --- HEADER --- */}
            <div className="sticky top-0 z-20 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200 px-4 py-4 sm:px-8 sm:py-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <Link href="/admin/dashboard" className="font-bold hover:text-indigo-600 transition">Dashboard</Link>
                            <ChevronRight size={14} />
                            <span className="text-indigo-600 font-bold">Akses Kontrol</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Manajemen User</h1>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 text-sm shadow-lg ${showForm
                            ? "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-none"
                            : "bg-slate-900 text-white hover:bg-indigo-600 shadow-indigo-100"
                            }`}
                    >
                        {showForm ? "Tutup Form" : <><UserPlus size={18} /> Tambah Akun Admin</>}
                    </button>
                </div>
            </div>

            <div className="p-4 sm:p-8 max-w-7xl mx-auto pb-24">

                {/* FORM INPUT DENGAN DESAIN BARU */}
                {showForm && (
                    <div className="bg-white border border-indigo-100 p-8 rounded-3xl shadow-sm mb-10 animate-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Lock size={20} /></div>
                            <div>
                                <h3 className="font-black text-slate-900">Registrasi Admin Baru</h3>
                                <p className="text-xs text-slate-500">Gunakan email aktif untuk kredensial login.</p>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Alamat Email</label>
                                <input name="email" type="email" placeholder="contoh@eduassist.id" required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none text-sm transition-all" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Password Baru</label>
                                <input name="password" type="password" placeholder="Min. 6 Karakter" required minLength={6} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none text-sm transition-all" />
                            </div>
                            <div className="flex items-end">
                                <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50">
                                    {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : "AKTIFKAN AKSES"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {message && (
                    <div className={`p-4 rounded-2xl mb-8 flex items-center gap-3 border animate-in fade-in ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                        {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                        <span className="font-bold text-sm">{message.text}</span>
                    </div>
                )}

                {/* TABEL LIST ADMIN */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-slate-50">
                        <h3 className="text-xl font-black text-slate-900">Otoritas Aktif</h3>
                        <p className="text-sm text-slate-400 font-medium">Daftar akun yang memiliki akses ke Dashboard EduAssist.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    <th className="py-4 px-8">Email Pengguna</th>
                                    <th className="py-4 px-4 text-center">Tingkat Akses</th>
                                    <th className="py-4 px-4 hidden sm:table-cell text-center">Bergabung Pada</th>
                                    <th className="py-4 px-8 text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {admins.map((admin) => (
                                    <tr key={admin.id} className={`group hover:bg-slate-50/80 transition-colors ${admin.id === currentUser?.id ? 'bg-indigo-50/30' : ''}`}>
                                        <td className="py-5 px-8">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-800">{admin.email}</span>
                                                {admin.id === currentUser?.id && (
                                                    <span className="text-[9px] font-bold text-indigo-500 uppercase mt-0.5 tracking-tighter">(Sesi Anda Saat Ini)</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-5 px-4 text-center">
                                            <div className="flex justify-center">
                                                {admin.is_super_admin ? (
                                                    <div className="bg-amber-100 text-amber-700 text-[9px] px-3 py-1 rounded-full font-black flex items-center gap-1.5 border border-amber-200">
                                                        <Shield size={12} strokeWidth={3} /> SUPER ADMIN
                                                    </div>
                                                ) : (
                                                    <div className="text-slate-500 bg-slate-100 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-slate-200">
                                                        Standard Admin
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-5 px-4 hidden sm:table-cell text-center">
                                            <span className="text-xs font-bold text-slate-400">
                                                {new Date(admin.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            {admin.is_super_admin || admin.id === currentUser?.id ? (
                                                <div className="p-2 text-slate-200 inline-block" title="Akses dilindungi">
                                                    <Lock size={18} />
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleDelete(admin.id, admin.email)}
                                                    className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-all active:scale-90"
                                                    title="Cabut Akses Admin"// Jangan biarkan user menghapus dirinya sendiri
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
                    {admins.length === 0 && !isLoading && (
                        <div className="p-20 text-center text-slate-300 font-bold italic">Data otoritas kosong.</div>
                    )}
                </div>
            </div>
        </div>
    );
}