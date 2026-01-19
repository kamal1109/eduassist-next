"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/admin/dashboard';

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true); // State loading awal
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // --- PROTEKSI: CEK APAKAH SUDAH LOGIN? ---
    useEffect(() => {
        const checkActiveSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // Jika sudah login, langsung ke dashboard
                router.replace('/admin/dashboard');
            } else {
                setIsCheckingSession(false);
            }
        };
        checkActiveSession();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        try {
            // 1. Login ke Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            });

            if (error) throw error;
            if (!data.user) throw new Error("User tidak ditemukan.");

            // 2. Set Cookie Manual (Agar Middleware Server Baca)
            // Menggunakan max-age 24 jam
            document.cookie = `admin_session=true; path=/; max-age=86400; SameSite=Lax; Secure`;

            // 3. HARD RELOAD
            // Penting agar Middleware mendeteksi cookie baru di request selanjutnya
            window.location.href = returnUrl;

        } catch (error: any) {
            console.error("Login Error:", error.message);
            if (error.message.includes("Invalid login credentials")) {
                setErrorMessage("Email atau password salah.");
            } else {
                setErrorMessage(error.message);
            }
            setIsLoading(false);
        }
    };

    // Tampilkan loading screen saat mengecek sesi awal
    if (isCheckingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-100/30 rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-blue-100 w-full max-w-md border border-slate-100 relative"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                        <ShieldCheck size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Admin <span className="text-blue-600">Portal</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Masuk untuk mengelola website</p>
                </div>

                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
                        <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
                        <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input
                            type="email"
                            placeholder="Email Admin"
                            className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium text-slate-900"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full pl-14 pr-12 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium text-slate-900"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-1"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 rounded-2xl font-black text-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed mt-2 active:scale-95"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                <span>Masuk Dashboard</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-50 pt-6">
                    <Link
                        href="/"
                        className="text-slate-400 text-sm font-bold hover:text-blue-600 transition uppercase tracking-widest inline-flex items-center gap-2"
                    >
                        ← Kembali ke Beranda
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}