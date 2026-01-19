'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function submitContact(formData: FormData) {
    // --- 1. SETUP SUPABASE ADMIN CLIENT ---
    // Kita prioritaskan pakai SERVICE_ROLE_KEY agar bisa BYPASS RLS (izin database)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false // Server action tidak butuh session browser
        }
    });

    // --- 2. AMBIL DATA ---
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const phone = formData.get('phone')?.toString();
    const message = formData.get('message')?.toString();

    console.log("📥 Menerima Data:", { name, email, phone }); // Debugging Server

    // --- 3. VALIDASI ---
    // Email atau Phone boleh kosong salah satu, tapi nama & message wajib
    if (!name || !message) {
        console.error("❌ Validasi Gagal: Nama/Pesan kosong");
        return { error: "Nama dan Pesan wajib diisi." };
    }

    try {
        // --- 4. INSERT KE DATABASE ---
        const { data, error } = await supabase.from('contacts').insert({
            name,
            email: email || "-", // Jika kosong isi strip
            phone: phone || "-",
            message,
            is_read: false,
        }).select(); // .select() berguna untuk memastikan data benar-benar kembali

        if (error) {
            console.error("❌ Supabase Insert Error:", error.message, error.details);
            return { error: `Gagal database: ${error.message}` };
        }

        console.log("✅ Sukses Simpan ke Database:", data);

        // --- 5. REFRESH HALAMAN ADMIN ---
        revalidatePath('/admin/dashboard/inbox');

        return { success: true };

    } catch (err: any) {
        console.error("❌ Server Action Crash:", err);
        return { error: "Terjadi kesalahan sistem pada server." };
    }
}