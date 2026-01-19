import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Setup client Supabase khusus untuk API Route ini
// (Agar tidak bentrok session dengan client-side)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // 1. Validasi Input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email dan Password wajib diisi' },
                { status: 400 }
            );
        }

        // 2. Login ke Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return NextResponse.json(
                { error: 'Email atau password salah' },
                { status: 401 }
            );
        }

        // 3. Buat Response Sukses
        const response = NextResponse.json({
            success: true,
            user: data.user
        });

        // 4. Set Secure HTTP-only Cookie
        // Ini yang membuat sesi login "menempel" di browser dengan aman
        if (data.session) {
            response.cookies.set({
                name: 'admin_session',
                value: data.session.access_token, // Simpan token asli
                httpOnly: true, // Tidak bisa diakses via JavaScript (Anti-XSS)
                secure: process.env.NODE_ENV === 'production', // Wajib HTTPS di Production
                sameSite: 'lax',
                path: '/', // Berlaku untuk seluruh website
                maxAge: 60 * 60 * 24 // Expire dalam 24 jam
            });
        }

        return response;

    } catch (error: any) {
        console.error("API Login Error:", error);
        return NextResponse.json(
            { error: 'Terjadi kesalahan pada server' },
            { status: 500 }
        );
    }
}