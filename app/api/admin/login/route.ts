import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Menggunakan file yang sudah Anda punya

export async function POST(request: Request) {
    try {
        // 1. Ambil data email & password dari input user
        const body = await request.json();
        const { email, password } = body;

        // 2. Validasi sederhana
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email dan password wajib diisi" },
                { status: 400 }
            );
        }

        // 3. Cek Login ke Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        // 4. Jika login gagal (password salah / user tidak ada)
        if (error) {
            return NextResponse.json(
                { error: "Email atau password salah" },
                { status: 401 }
            );
        }

        // 5. Jika sukses
        return NextResponse.json({
            message: "Login berhasil",
            user: data.user,
            session: data.session,
        });

    } catch (err) {
        console.error("Login Error:", err);
        return NextResponse.json(
            { error: "Terjadi kesalahan pada server" },
            { status: 500 }
        );
    }
}