import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// --- CONFIGURATION ---
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 menit
const MAX_REQUESTS = 100; // Maks 100 request per IP

// In-memory store (Reset saat redeploy di Vercel, ini wajar)
const rateLimitStore: Record<string, { count: number; resetTime: number }> = {};

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // --- 1. RATE LIMITING (Sederhana) ---
    // Skip untuk asset static, gambar, dan file internal Next.js
    const isStatic = path.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot|mp4|webp)$/i) || path.startsWith('/_next');

    if (!isStatic) {
        // Ambil IP dengan cara yang aman
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

        if (ip !== 'unknown') {
            const now = Date.now();
            const record = rateLimitStore[ip] || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

            if (now > record.resetTime) {
                record.count = 0;
                record.resetTime = now + RATE_LIMIT_WINDOW;
            }

            record.count++;
            rateLimitStore[ip] = record;

            if (record.count > MAX_REQUESTS) {
                return new NextResponse(
                    JSON.stringify({ error: 'Too many requests' }),
                    { status: 429, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }
    }

    // --- 2. PROTEKSI ADMIN (INTI MASALAH LOGIN LOOP ADA DISINI) ---

    // Kita gunakan .startsWith() agar lebih aman menangani trailing slash
    const isAdminArea = path.startsWith('/admin') || path.startsWith('/dashboard');
    const isLoginPage = path.startsWith('/admin/login');

    // Jika user mencoba masuk area Admin DAN bukan sedang di halaman Login
    if (isAdminArea && !isLoginPage) {
        const adminSession = request.cookies.get('admin_session');

        // Debugging Log (Bisa dilihat di Vercel Logs)
        if (!adminSession?.value) {
            // console.log(`[Middleware] 🔴 Akses ditolak ke ${path}: Cookie tidak ditemukan.`);

            const loginUrl = new URL('/admin/login', request.url);
            // Simpan halaman tujuan agar bisa redirect balik nanti
            loginUrl.searchParams.set('returnUrl', path);
            return NextResponse.redirect(loginUrl);
        }

        // Jika cookie ada, biarkan lewat
        // console.log(`[Middleware] 🟢 Akses diizinkan ke ${path}`);
    }

    // --- 3. RESPONSE & HEADERS ---
    const response = NextResponse.next();

    // Security Headers Standard
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // CORS untuk API Routes
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
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};