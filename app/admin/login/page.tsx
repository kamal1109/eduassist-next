"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

// IMPORT SUPABASE CLIENT
import { supabase } from "../../../lib/supabase";

// --- HELPER FUNCTIONS ---

// Helper untuk encrypt session sederhana
const encryptSession = (data: object): string => {
    try {
        const jsonString = JSON.stringify(data);
        return btoa(unescape(encodeURIComponent(jsonString))); // Base64 encode
    } catch (error) {
        console.error('Encryption error:', error);
        return '';
    }
};

// Helper untuk delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Validasi email format
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validasi password strength (client-side only)
const isStrongPassword = (password: string): boolean => {
    if (password.length < 8) return false;

    // Cek minimal requirements
    const requirements = {
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumbers: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    // Hitung berapa requirements yang terpenuhi
    const score = Object.values(requirements).filter(Boolean).length;

    return score >= 3; // Minimal 3 dari 4 requirements
};

// --- KOMPONEN UTAMA (ISI FORM) ---
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [lockUntil, setLockUntil] = useState<number | null>(null);
    const [csrfToken, setCsrfToken] = useState("");

    // Refs untuk tracking
    const formRef = useRef<HTMLFormElement>(null);
    const lastAttemptTime = useRef<number>(0);

    // Ambil return URL jika ada
    const returnUrl = searchParams.get('returnUrl') || '/admin/dashboard';

    // Initialize CSRF Token dan cek lock
    useEffect(() => {
        // Generate CSRF token
        const generateToken = () => {
            const array = new Uint8Array(32);
            if (typeof crypto !== 'undefined') {
                crypto.getRandomValues(array);
                return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
            } else {
                // Fallback untuk environment tanpa crypto
                return Math.random().toString(36).substring(2) + Date.now().toString(36);
            }
        };

        const token = generateToken();
        setCsrfToken(token);

        // Simpan token di sessionStorage
        try {
            sessionStorage.setItem('csrf_token', token);
        } catch (e) {
            console.warn('sessionStorage not available');
        }

        // Check lock dari localStorage
        try {
            const storedLock = localStorage.getItem('login_lock_until');
            if (storedLock) {
                const lockTime = parseInt(storedLock, 10);
                if (Date.now() < lockTime) {
                    setLockUntil(lockTime);
                } else {
                    localStorage.removeItem('login_lock_until');
                    localStorage.removeItem('login_attempts');
                }
            }

            // Check attempts
            const storedAttempts = localStorage.getItem('login_attempts');
            if (storedAttempts) {
                setAttempts(parseInt(storedAttempts, 10));
            }
        } catch (e) {
            console.warn('localStorage not available');
        }

        // Clear error message setelah 5 detik
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    // Cek jika masih terkunci
    useEffect(() => {
        if (lockUntil) {
            const interval = setInterval(() => {
                if (Date.now() >= lockUntil) {
                    setLockUntil(null);
                    try {
                        localStorage.removeItem('login_lock_until');
                    } catch (e) {
                        console.warn('localStorage not available');
                    }
                    clearInterval(interval);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [lockUntil]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Cek jika masih terkunci
        if (lockUntil && Date.now() < lockUntil) {
            const remainingTime = Math.ceil((lockUntil - Date.now()) / 1000);
            setErrorMessage(`Akun terkunci. Coba lagi dalam ${remainingTime} detik.`);
            return;
        }

        // Cek rate limiting (minimal 2 detik antara attempt)
        const now = Date.now();
        if (now - lastAttemptTime.current < 2000) {
            setErrorMessage("Terlalu cepat. Tunggu sebentar.");
            return;
        }
        lastAttemptTime.current = now;

        // Validasi input
        if (!isValidEmail(email)) {
            setErrorMessage("Format email tidak valid.");
            return;
        }

        if (password.length < 1) {
            setErrorMessage("Password harus diisi.");
            return;
        }

        // Validasi CSRF token
        try {
            const storedToken = sessionStorage.getItem('csrf_token');
            if (!storedToken || storedToken !== csrfToken) {
                setErrorMessage("Token keamanan tidak valid. Silakan refresh halaman.");
                return;
            }
        } catch (e) {
            setErrorMessage("Session storage tidak tersedia.");
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            // Delay buatan untuk mencegah timing attacks
            await delay(500); // Delay sedikit dipercepat

            // 1. LOGIN KE SUPABASE AUTH
            const loginPromise = supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password: password,
            });

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Timeout: Login terlalu lama")), 10000);
            });

            const { data, error } = await Promise.race([
                loginPromise,
                timeoutPromise
            ]) as any;

            if (error) {
                // Handle specific Supabase errors
                if (error.message?.includes("Invalid login credentials")) {
                    throw new Error("Email atau password salah.");
                } else if (error.message?.includes("Email not confirmed")) {
                    throw new Error("Email belum dikonfirmasi.");
                } else if (error.message?.includes("rate limit")) {
                    throw new Error("Terlalu banyak percobaan. Coba lagi nanti.");
                } else {
                    throw new Error("Gagal login. Coba lagi.");
                }
            }

            if (!data || !data.session) {
                throw new Error("Session tidak ditemukan.");
            }

            // 2. Buat session data yang Ringkas
            const sessionData = {
                userId: data.session.user.id,
                email: data.session.user.email,
                role: 'admin',
                expiry: Date.now() + (24 * 60 * 60 * 1000), // 24 jam
                token: data.session.access_token.substring(0, 15) // Partial token
            };

            const sessionString = encryptSession(sessionData);
            if (!sessionString) {
                throw new Error("Gagal membuat session.");
            }

            // 3. SET COOKIE (VERSI UNIVERSAL & DETEKSI OTOMATIS)
            // Deteksi apakah sedang di HTTPS (Vercel) atau HTTP (Localhost)
            const isSecureContext = window.location.protocol === 'https:';

            // Susun atribut cookie dasar
            // Hapus HttpOnly (JS Client tidak bisa set ini)
            let cookieString = `admin_session=${encodeURIComponent(sessionString)}; path=/; max-age=86400; SameSite=Lax`;

            // HANYA tambahkan Secure jika benar-benar di HTTPS
            if (isSecureContext) {
                cookieString += "; Secure";
            }

            // Tulis ke browser
            document.cookie = cookieString;

            // 4. CEK ULANG (Fallback)
            // Kalau cookie masih kosong, kita coba paksa tanpa atribut Secure (untuk jaga-jaga)
            await delay(100);
            if (!document.cookie.includes('admin_session')) {
                console.warn("⚠️ Cookie pertama gagal/diblokir, mencoba mode fallback...");
                document.cookie = `admin_session=${encodeURIComponent(sessionString)}; path=/; max-age=86400; SameSite=Lax`;
            }

            // 5. DEBUGGING FINAL
            console.log("🍪 Status Cookie:", document.cookie.includes('admin_session') ? "TERSIMPAN ✅" : "GAGAL ❌");

            if (!document.cookie.includes('admin_session')) {
                throw new Error("Browser Anda memblokir cookie. Coba matikan AdBlock/Privacy Shield.");
            }

            // 5. Reset attempts pada success
            try {
                localStorage.removeItem('login_attempts');
                localStorage.removeItem('login_lock_until');
                sessionStorage.removeItem('csrf_token');
            } catch (e) {
                console.warn('Failed to clear localStorage');
            }
            setAttempts(0);

            // 7. Log success
            console.log(`[LOGIN SUCCESS] Admin: ${email.substring(0, 3)}***`);

            // 8. Redirect PAKSA (Hard Reload)
            // Refresh sangat penting agar Middleware membaca cookie baru
            await delay(500);
            window.location.href = returnUrl;

        } catch (error: unknown) {
            setIsLoading(false);

            // Increment attempts
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            try {
                localStorage.setItem('login_attempts', newAttempts.toString());
            } catch (e) {
                console.warn('Failed to save attempts');
            }

            // Determine error message
            let errorMsg = "Terjadi kesalahan saat login";

            if (error instanceof Error) {
                errorMsg = error.message;
            }

            // Lock account setelah 5 attempts
            if (newAttempts >= 5) {
                const lockTime = Date.now() + (15 * 60 * 1000); // 15 menit
                setLockUntil(lockTime);
                try {
                    localStorage.setItem('login_lock_until', lockTime.toString());
                } catch (e) {
                    console.warn('Failed to save lock time');
                }
                errorMsg = "Terlalu banyak percobaan gagal. Akun terkunci selama 15 menit.";
            } else if (newAttempts >= 3) {
                errorMsg = `Percobaan ${newAttempts}/5 gagal. ${errorMsg}`;
            }

            setErrorMessage(errorMsg);

            // Clear password field untuk keamanan
            setPassword("");
            if (formRef.current) {
                const passwordInput = formRef.current.querySelector('input[type="password"]') as HTMLInputElement;
                if (passwordInput) passwordInput.value = "";
            }
        }
    };

    // Hitung waktu remaining lock
    const getRemainingTime = () => {
        if (!lockUntil) return 0;
        const remaining = Math.ceil((lockUntil - Date.now()) / 1000);
        return Math.max(0, remaining);
    };

    const remainingTime = getRemainingTime();

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
                {/* Security Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <ShieldCheck size={12} />
                        <span>Secure Login</span>
                    </div>
                </div>

                {/* Attempts Indicator */}
                {attempts > 0 && (
                    <div className="absolute -top-3 right-4">
                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${attempts >= 3 ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                            }`}>
                            Attempt: {attempts}/5
                        </div>
                    </div>
                )}

                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                        <ShieldCheck size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Admin <span className="text-blue-600">Portal</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Kelola data EduAssist dengan aman</p>

                    {/* Lock Timer */}
                    {lockUntil && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl"
                        >
                            <p className="text-red-600 text-sm font-bold">
                                🔒 Akun terkunci: {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl"
                    >
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
                            <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
                        </div>
                    </motion.div>
                )}

                <form ref={formRef} onSubmit={handleLogin} className="flex flex-col gap-5">
                    {/* CSRF Token (hidden) */}
                    <input
                        type="hidden"
                        name="csrf_token"
                        value={csrfToken}
                        readOnly
                    />

                    {/* Input Email */}
                    <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input
                            type="email"
                            placeholder="Email Admin"
                            className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium text-slate-900 disabled:opacity-50"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!!lockUntil || isLoading}
                            required
                            autoComplete="username"
                            spellCheck="false"
                            maxLength={100}
                        />
                    </div>

                    {/* Input Password */}
                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full pl-14 pr-12 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium text-slate-900 disabled:opacity-50"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={!!lockUntil || isLoading}
                            required
                            autoComplete="current-password"
                            minLength={1}
                            maxLength={100}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-1"
                            disabled={!!lockUntil || isLoading}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password.length > 0 && !lockUntil && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="px-2"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-500">Kekuatan password:</span>
                                <span className={`text-xs font-bold ${isStrongPassword(password) ? 'text-green-600' :
                                    password.length >= 6 ? 'text-amber-600' : 'text-red-600'
                                    }`}>
                                    {isStrongPassword(password) ? 'Kuat' :
                                        password.length >= 6 ? 'Sedang' : 'Lemah'}
                                </span>
                            </div>
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${isStrongPassword(password) ? 'bg-green-500' :
                                        password.length >= 6 ? 'bg-amber-500' : 'bg-red-500'
                                        }`}
                                    style={{
                                        width: `${Math.min(
                                            (password.length / 12) * 100,
                                            isStrongPassword(password) ? 100 :
                                                password.length >= 6 ? 70 : 40
                                        )}%`
                                    }}
                                ></div>
                            </div>
                        </motion.div>
                    )}

                    {/* Tombol Login */}
                    <motion.button
                        type="submit"
                        disabled={!!lockUntil || isLoading}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 rounded-2xl font-black text-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed"
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Memproses...</span>
                            </>
                        ) : lockUntil ? (
                            "Terkunci"
                        ) : (
                            <>
                                <span>Masuk ke Dashboard</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-8 text-center border-t border-slate-50 pt-6">
                    <Link
                        href="/"
                        className="text-slate-400 text-sm font-bold hover:text-blue-600 transition uppercase tracking-widest inline-flex items-center gap-2"
                    >
                        ← Kembali ke Beranda Umum
                    </Link>

                    {/* Security Tips */}
                    <div className="mt-6 text-xs text-slate-400 space-y-1">
                        <p className="flex items-center justify-center gap-1">
                            <ShieldCheck size={12} />
                            <span>Pastikan Anda di jaringan aman</span>
                        </p>
                        <p>• Jangan bagikan kredensial login</p>
                        <p>• Logout setelah selesai menggunakan</p>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

// --- Wrapper Component dengan Suspense ---
export default function AdminLoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Memuat Login...</p>
                </div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}