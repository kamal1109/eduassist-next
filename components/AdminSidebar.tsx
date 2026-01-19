"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Home, Inbox, Plus, Layers, User, LogOut, X, BarChart3, Globe
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Setup Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const confirmLogout = confirm("Yakin ingin keluar?");
        if (confirmLogout) {
            await supabase.auth.signOut();
            document.cookie = "admin_session=; path=/; max-age=0";
            router.push('/admin/login');
        }
    };

    // Helper: Cek menu aktif
    const isActive = (path: string) => pathname === path || (path !== '/admin/dashboard' && pathname.startsWith(path));

    // Helper: Class untuk Link
    const linkClass = (path: string) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(path)
            ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
        }`;

    return (
        <>
            {/* Overlay Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[90] md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed inset-y-0 left-0 z-[100] w-64 bg-white border-r border-slate-200 
                flex flex-col transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0
                ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
            `}>
                {/* Header */}
                <div className="h-16 flex items-center px-6 border-b border-slate-100 justify-between md:justify-start">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-indigo-600 tracking-tighter">EDUASSIST</span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">ADMIN</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 p-1">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigasi */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
                    <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-2">Utama</p>
                    <Link href="/admin/dashboard" className={linkClass("/admin/dashboard")} onClick={() => setIsOpen(false)}>
                        <Home size={18} /> Dashboard
                    </Link>
                    <Link href="/admin/dashboard/inbox" className={linkClass("/admin/dashboard/inbox")} onClick={() => setIsOpen(false)}>
                        <Inbox size={18} /> Inbox Leads
                    </Link>

                    <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">Konten</p>
                    <Link href="/admin/dashboard/input" className={linkClass("/admin/dashboard/input")} onClick={() => setIsOpen(false)}>
                        <Plus size={18} /> Input Artikel
                    </Link>
                    <Link href="/admin/dashboard/list" className={linkClass("/admin/dashboard/list")} onClick={() => setIsOpen(false)}>
                        <Layers size={18} /> Daftar Artikel
                    </Link>

                    <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">Sistem</p>
                    <Link href="/admin/dashboard/users" className={linkClass("/admin/dashboard/users")} onClick={() => setIsOpen(false)}>
                        <User size={18} /> Manajemen User
                    </Link>
                    <Link href="/admin/dashboard/analytics" className={linkClass("/admin/dashboard/analytics")} onClick={() => setIsOpen(false)}>
                        <BarChart3 size={18} /> Analytics
                    </Link>
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-100 space-y-2">
                    <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        <Globe size={18} className="text-slate-400" /> Lihat Website
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={18} /> Keluar
                    </button>
                </div>
            </aside>
        </>
    );
}