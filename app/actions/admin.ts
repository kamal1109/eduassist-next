'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// --- 👑 SETUP SUPER ADMIN ---
// Ganti dengan email asli Mas (Ini akun yang ANTI-HAPUS)
const SUPER_ADMIN_EMAIL = "kamalmuhammad003@gmail.com";

// Validasi Environment Variables sebelum inisialisasi
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("ERROR: Env variable Supabase belum lengkap. Cek .env.local Anda.");
}

// Setup Supabase Admin (Pakai Service Role Key - BISA BYPASS RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
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

        if (error) {
            console.error("Supabase Admin Error:", error);
            return [];
        }

        // Mapping data dan Sort dari yang terbaru (Created At Descending)
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
        console.error("Server Action Error:", err);
        return [];
    }
}

// 2. Tambah Admin Baru
export async function createNewAdmin(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validasi Sederhana
    if (!email || !password) return { error: "Email dan Password wajib diisi" };
    if (password.length < 6) return { error: "Password minimal 6 karakter" };

    try {
        // Create user dengan status email langsung confirm
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true, // Otomatis confirm email
            user_metadata: { role: 'admin' } // Menandai user sebagai admin
        });

        if (error) throw error;

        // Refresh halaman admin users
        revalidatePath('/admin/dashboard/users');
        return { success: "Admin berhasil ditambahkan!" };

    } catch (err: any) {
        console.error("Create Admin Error:", err);
        return { error: err.message || "Gagal membuat user baru." };
    }
}

// 3. Hapus Admin
export async function deleteAdmin(userId: string, userEmail: string | undefined) {
    // Proteksi Super Admin
    if (userEmail === SUPER_ADMIN_EMAIL) {
        return { error: "DILARANG! Ini akun Super Admin (Owner) tidak boleh dihapus." };
    }

    try {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (error) throw error;

        // Refresh halaman admin users
        revalidatePath('/admin/dashboard/users');
        return { success: "Admin berhasil dihapus." };

    } catch (err: any) {
        console.error("Delete Admin Error:", err);
        return { error: err.message || "Gagal menghapus user." };
    }
}