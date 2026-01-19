import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Setup Supabase Client khusus untuk API Route ini
// (Kita buat instance baru agar tidak bentrok dengan cache client-side)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        // 1. Ambil data dari body request
        const body = await request.json();
        const { email, password } = body;

        // 2. Validasi Input
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email dan password wajib diisi" },
                { status: 400 }
            );
        }

        // 3. Login ke Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        // 4. Jika Gagal
        if (error) {
            return NextResponse.json(
                { error: "Email atau password salah" },
                { status: 401 }
            );
        }

        // 5. Jika Sukses -> Buat Response & Set Cookie
        const response = NextResponse.json({
            message: "Login berhasil",
            user: data.user,
            session: data.session,
        });

        // SET COOKIE 'admin_session' SECARA AMAN (HttpOnly)
        // Ini membuat middleware bisa membacanya, tapi JavaScript browser tidak bisa mengotak-atiknya (Anti XSS)
        response.cookies.set("admin_session", "true", {
            httpOnly: true, // Hanya bisa dibaca server
            secure: process.env.NODE_ENV === "production", // Hanya HTTPS di production
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 Jam
        });

        return response;

    } catch (err: any) {
        console.error("API Login Error:", err);
        return NextResponse.json(
            { error: "Terjadi kesalahan pada server: " + err.message },
            { status: 500 }
        );
    }
}