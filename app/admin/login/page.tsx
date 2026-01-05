"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
// IMPORT SUPABASE CLIENT
import { supabase } from "../../../lib/supabase";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. LOGIN KE SUPABASE AUTH
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: pass,
            });

            if (error) throw error;

            // 2. SET COOKIE (Tetap dipertahankan agar Middleware lama kamu tetap jalan)
            // Supabase sebenarnya sudah mengelola session sendiri, tapi ini bagus untuk backup
            document.cookie = "admin_session=true; path=/; max-age=86400; SameSite=Lax";

            // 3. ARAHKAN KE DASHBOARD
            setTimeout(() => {
                router.push("/admin/dashboard");
            }, 500);

        } catch (error: any) {
            setIsLoading(false);
            // Pesan error sekarang dinamis dari database (misal: "Invalid login credentials")
            alert("Login Gagal: " + error.message);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            {/* Background Decor - Fitur Dipertahankan */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-100/30 rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-blue-100 w-full max-w-md border border-slate-100"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                        <ShieldCheck size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Admin <span className="text-blue-600">Portal</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Kelola data EduAssist dengan aman</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    {/* Input Email */}
                    <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input
                            type="email"
                            placeholder="Email Admin"
                            className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Input Password */}
                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                            onChange={(e) => setPass(e.target.value)}
                            required
                        />
                    </div>

                    {/* Tombol Login */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 disabled:opacity-70 active:scale-95"
                    >
                        {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
                        {!isLoading && <ArrowRight size={20} />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-slate-400 text-sm font-bold hover:text-blue-600 transition">
                        Kembali ke Beranda Umum
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}