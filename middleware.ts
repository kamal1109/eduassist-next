import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// --- 1. CONFIGURATION ---
// Simple in-memory rate limiting (Note: Reset saat redeploy/cold start di Vercel)
interface RateLimitData {
    count: number;
    resetTime: number;
}

const rateLimitStore: Record<string, RateLimitData> = {};
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 menit
const MAX_REQUESTS = 100; // Maks 100 request per IP

let lastCleanup = Date.now();

// --- 2. HELPER FUNCTIONS ---
function cleanupRateLimitStore() {
    const currentTime = Date.now();
    // Cleanup tiap 5 menit
    if (currentTime - lastCleanup > 5 * 60 * 1000) {
        const ips = Object.keys(rateLimitStore);
        for (const ip of ips) {
            const data = rateLimitStore[ip];
            if (data && currentTime > data.resetTime + (60 * 60 * 1000)) {
                delete rateLimitStore[ip];
            }
        }
        lastCleanup = currentTime;
    }
}

// --- 3. MAIN MIDDLEWARE ---
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // A. Dapatkan IP Address
    let ip = 'unknown';
    try {
        ip = request.ip ||
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            'unknown';
    } catch (error) {
        console.error('Error getting IP:', error);
    }

    // B. Rate Limiting Logic (Skip untuk asset static)
    cleanupRateLimitStore();

    const isStaticAsset = path.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot|mp4|webp)$/i);
    const isPublicFile = path.startsWith('/_next/') || path === '/favicon.ico' || path.startsWith('/public/');

    if (!isStaticAsset && !isPublicFile && ip !== 'unknown') {
        const currentTime = Date.now();
        const ipData = rateLimitStore[ip] || { count: 0, resetTime: currentTime + RATE_LIMIT_WINDOW };

        if (currentTime > ipData.resetTime) {
            ipData.count = 0;
            ipData.resetTime = currentTime + RATE_LIMIT_WINDOW;
        }

        ipData.count++;
        rateLimitStore[ip] = ipData;

        if (ipData.count > MAX_REQUESTS) {
            return new NextResponse(
                JSON.stringify({ error: 'Terlalu banyak permintaan. Coba lagi nanti.' }),
                { status: 429, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    // C. Siapkan Response
    const response = NextResponse.next();

    // D. Security Headers (PENTING)
    const securityHeaders = [
        ['X-Content-Type-Options', 'nosniff'],
        ['X-Frame-Options', 'DENY'],
        ['X-XSS-Protection', '1; mode=block'],
        ['Referrer-Policy', 'strict-origin-when-cross-origin'],
        ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()'],
    ];

    securityHeaders.forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    // E. Proteksi Route Admin (AUTH CHECK)
    // Kita gunakan logic manual cookie 'admin_session' agar sesuai dengan API Login Anda
    const isAdminRoute = path.startsWith('/admin');
    const isDashboardRoute = path.startsWith('/dashboard');
    const isLoginRoute = path === '/admin/login' || path === '/login';

    if ((isAdminRoute || isDashboardRoute) && !isLoginRoute) {
        const adminSession = request.cookies.get('admin_session');

        // Jika tidak ada cookie sesi admin, tendang ke login
        if (!adminSession?.value) {
            const loginUrl = new URL('/admin/login', request.url);
            // Simpan url tujuan untuk redirect balik setelah login
            loginUrl.searchParams.set('returnUrl', path);
            return NextResponse.redirect(loginUrl);
        }
    }

    // F. Proteksi API Routes (CORS)
    if (path.startsWith('/api')) {
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    return response;
}

// --- 4. MATCHER CONFIG ---
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
    ],
};