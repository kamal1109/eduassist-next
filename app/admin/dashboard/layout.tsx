"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Gunakan client yang sudah kita buat sebelumnya
import {
    Home,
    Inbox,
    PenTool,
    FileText,
    Users,
    BarChart3,
    Globe,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Loader2
} from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isChecking, setIsChecking] = useState(true); // State loading untuk cek user
    const pathname = usePathname();
    const router = useRouter();

    // --- PROTEKSI KEAMANAN: CEK USER SETIAP KALI PINDAH HALAMAN ---
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // Jika tidak ada sesi aktif di Supabase, hapus cookie manual dan tendang ke login
                document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                router.push("/admin/login");
            } else {
                setIsChecking(false);
            }
        };

        checkUser();
    }, [pathname, router]);

    // Fungsi Logout (DIPERBAIKI)
    const handleLogout = async () => {
        const confirmLogout = confirm("Yakin ingin keluar dari Admin?");
        if (confirmLogout) {
            // 1. Logout dari Supabase
            await supabase.auth.signOut();

            // 2. Hapus cookie admin_session secara total
            document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

            // 3. Paksa pindah ke halaman login
            window.location.href = "/admin/login";
        }
    };

    // Daftar Menu Navigasi
    const menuItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: Home },
        { name: "Inbox Leads", href: "/admin/dashboard/inbox", icon: Inbox },
    ];

    const contentMenu = [
        { name: "Input Artikel", href: "/admin/dashboard/input", icon: PenTool },
        { name: "Daftar Artikel", href: "/admin/dashboard/list", icon: FileText },
    ];

    const systemMenu = [
        { name: "Manajemen User", href: "/admin/dashboard/users", icon: Users },
        { name: "Analytics", href: "/admin/dashboard/analytics", icon: BarChart3 },
    ];

    const isActive = (path: string) => pathname === path || (path !== '/admin/dashboard' && pathname.startsWith(path));

    // Jika sedang mengecek keamanan, tampilkan loading layar penuh
    if (isChecking) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                <p className="text-slate-400 font-bold text-sm tracking-widest">MEMERIKSA OTORITAS...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">

            {/* --- SIDEBAR --- */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-[100] w-64 bg-white border-r border-slate-200 
          flex flex-col transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
            >
                <div className="h-16 flex items-center px-6 border-b border-slate-100 justify-between md:justify-start">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-indigo-600 tracking-tighter">
                            EDUASSIST
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                            ADMIN
                        </span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden text-slate-400 p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
                    <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-2">
                        Utama
                    </p>
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(item.href)
                                ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                }`}
                        >
                            <item.icon size={18} className={isActive(item.href) ? "text-indigo-600" : "text-slate-400"} />
                            {item.name}
                            {isActive(item.href) && <ChevronRight size={14} className="ml-auto opacity-50" />}
                        </Link>
                    ))}

                    <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">
                        Konten
                    </p>
                    {contentMenu.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(item.href)
                                ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                }`}
                        >
                            <item.icon size={18} className={isActive(item.href) ? "text-indigo-600" : "text-slate-400"} />
                            {item.name}
                        </Link>
                    ))}

                    <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">
                        Sistem
                    </p>
                    {systemMenu.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(item.href)
                                ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                }`}
                        >
                            <item.icon size={18} className={isActive(item.href) ? "text-indigo-600" : "text-slate-400"} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-2">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <Globe size={18} className="text-slate-400" />
                        Lihat Website
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className="md:hidden bg-white border-b border-slate-200 h-16 flex items-center px-4 shrink-0 justify-between absolute top-0 left-0 right-0 z-40">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="text-slate-500 p-1">
                            <Menu size={24} />
                        </button>
                        <span className="font-black text-slate-800 tracking-tight">EDUASSIST ADMIN</span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-slate-50 relative pt-16 md:pt-0 scroll-smooth">
                    {children}
                </main>
            </div>

            {/* Overlay Mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[90] md:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}