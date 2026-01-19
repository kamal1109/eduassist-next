import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware'; // Import logic auth

// --- CONFIGURATION ---
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 menit
const MAX_REQUESTS = 150; // Maksimum request per window

// In-memory store (Reset saat redeploy di Vercel, ini wajar untuk serverless)
const rateLimitStore: Record<string, { count: number; resetTime: number }> = {};

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // --- 1. RATE LIMITING ---
    // Skip untuk asset static agar performa tidak drop (gambar, font, css, dll)
    const isStatic = path.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot|mp4|webp)$/i) || path.startsWith('/_next');

    if (!isStatic) {
        // Ambil IP dengan cara yang aman (support Vercel/Cloudflare headers)
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

        if (ip !== 'unknown') {
            const now = Date.now();
            const record = rateLimitStore[ip] || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

            // Reset counter jika window time sudah lewat
            if (now > record.resetTime) {
                record.count = 0;
                record.resetTime = now + RATE_LIMIT_WINDOW;
            }

            record.count++;
            rateLimitStore[ip] = record;

            // Block jika melebihi limit
            if (record.count > MAX_REQUESTS) {
                return new NextResponse(
                    JSON.stringify({ error: 'Too many requests. Please try again later.' }),
                    { status: 429, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }
    }

    // --- 2. JALANKAN LOGIC SUPABASE & PROTEKSI ---
    // Di sini kita panggil fungsi dari lib/supabase/middleware.ts
    // Fungsi ini akan mengembalikan Response yang berisi redirect (jika belum login)
    // atau cookie refresh (jika session diperbarui)
    const response = await updateSession(request);

    // --- 3. TAMBAHKAN SECURITY HEADERS KE RESPONSE FINAL ---
    // Header ini akan menempel pada response apapun yang dihasilkan oleh updateSession
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // CORS untuk API Routes (Opsional, sesuaikan kebutuhan)
    if (path.startsWith('/api')) {
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - file extensions (svg, png, jpg, etc)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};