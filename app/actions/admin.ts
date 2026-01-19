'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// --- 👑 SETUP SUPER ADMIN ---
const SUPER_ADMIN_EMAIL = "kamalmuhammad003@gmail.com";

/**
 * Menggunakan fallback kunci:
 * Di localhost, ia akan mengambil dari .env.local
 * Di Vercel, ia akan mencoba SUPABASE_SERVICE_ROLE_KEY dahulu, 
 * jika tidak ada (karena masalah propagasi), ia akan menggunakan NEXT_PUBLIC_...
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("ERROR: Env variable Supabase tidak ditemukan.");
}

// Setup Supabase Admin (Server-side)
const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

// 1. Ambil List User
export async function getAdminList() {
    try {
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
        if (error) throw error;

        return users
            .map(u => ({
                id: u.id,
                email: u.email,
                created_at: u.created_at,
                last_sign_in: u.last_sign_in_at,
                is_super_admin: u.email === SUPER_ADMIN_EMAIL
            }))
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (err) {
        console.error("Get List Error:", err);
        return [];
    }
}

// 2. Tambah Admin Baru
export async function createNewAdmin(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) return { error: "Email dan Password wajib diisi" };
    if (password.length < 6) return { error: "Password minimal 6 karakter" };

    try {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true, // Bypass verifikasi email
            user_metadata: { role: 'admin' }
        });

        if (error) throw error;

        revalidatePath('/admin/dashboard/users');
        return { success: "Admin berhasil ditambahkan!" };
    } catch (err: any) {
        console.error("Create Admin Error:", err);
        return { error: err.message || "Gagal membuat user baru." };
    }
}

// 3. Hapus Admin
export async function deleteAdmin(userId: string, userEmail: string | undefined) {
    if (userEmail === SUPER_ADMIN_EMAIL) {
        return { error: "DILARANG! Akun Super Admin tidak boleh dihapus." };
    }

    try {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (error) throw error;

        revalidatePath('/admin/dashboard/users');
        return { success: "Admin berhasil dihapus." };
    } catch (err: any) {
        console.error("Delete Admin Error:", err);
        return { error: err.message || "Gagal menghapus user." };
    }
}