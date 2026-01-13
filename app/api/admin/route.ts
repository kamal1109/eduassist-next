import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server'; // Server-side Supabase client

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Rate limiting di server
        const ip = request.ip || 'unknown';
        // ... rate limiting logic ...

        // Login via Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return NextResponse.json(
                { error: 'Login gagal' },
                { status: 401 }
            );
        }

        // Set secure HTTP-only cookie
        const response = NextResponse.json({ success: true });

        response.cookies.set({
            name: 'admin_session',
            value: data.session.access_token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 // 24 jam
        });

        return response;

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}