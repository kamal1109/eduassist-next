import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting (gunakan Redis untuk production)
interface RateLimitData {
    count: number;
    resetTime: number;
}

const rateLimitStore: Record<string, RateLimitData> = {};
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 menit
const MAX_REQUESTS = 100; // Maks 100 request per IP per window
let lastCleanup = Date.now();

// Fungsi cleanup yang kompatibel
function cleanupRateLimitStore() {
    const currentTime = Date.now();

    // Jalankan cleanup maksimal setiap 5 menit
    if (currentTime - lastCleanup > 5 * 60 * 1000) {
        const ips = Object.keys(rateLimitStore);

        for (let i = 0; i < ips.length; i++) {
            const ip = ips[i];
            const data = rateLimitStore[ip];

            // Cleanup data yang expired (lebih dari 1 jam)
            if (data && currentTime > data.resetTime + (60 * 60 * 1000)) {
                delete rateLimitStore[ip];
            }
        }

        lastCleanup = currentTime;
    }
}

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Dapatkan IP address dengan cara yang aman
    let ip = 'unknown';
    try {
        ip = request.ip ||
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            'unknown';
    } catch (error) {
        console.error('Error getting IP:', error);
        ip = 'unknown';
    }

    // Cleanup rate limit store
    cleanupRateLimitStore();

    // 🔐 Rate Limiting (skip untuk static assets)
    const isStaticAsset = path.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot|mp4|webp)$/i);
    const isPublicFile = path.startsWith('/_next/') || path === '/favicon.ico' || path.startsWith('/public/');

    if (!isStaticAsset && !isPublicFile && ip !== 'unknown') {
        const currentTime = Date.now();
        const ipData = rateLimitStore[ip] || { count: 0, resetTime: currentTime + RATE_LIMIT_WINDOW };

        // Reset jika window sudah lewat
        if (currentTime > ipData.resetTime) {
            ipData.count = 0;
            ipData.resetTime = currentTime + RATE_LIMIT_WINDOW;
        }

        ipData.count++;
        rateLimitStore[ip] = ipData;

        // Blokir jika melebihi limit
        if (ipData.count > MAX_REQUESTS) {
            console.warn(`[RATE LIMIT] IP: ${ip}, Path: ${path}, Count: ${ipData.count}`);

            return new NextResponse(
                JSON.stringify({
                    error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
                    retryAfter: Math.ceil((ipData.resetTime - currentTime) / 1000)
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': String(Math.ceil((ipData.resetTime - currentTime) / 1000)),
                        'X-RateLimit-Limit': String(MAX_REQUESTS),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': String(ipData.resetTime)
                    }
                }
            );
        }
    }

    // 🛡️ Security Headers untuk semua response
    const response = NextResponse.next();

    // Basic security headers
    const securityHeaders = [
        ['X-Content-Type-Options', 'nosniff'],
        ['X-Frame-Options', 'DENY'],
        ['X-XSS-Protection', '1; mode=block'],
        ['Referrer-Policy', 'strict-origin-when-cross-origin'],
        ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()'],
    ];

    // Apply headers
    securityHeaders.forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    // HSTS hanya di production
    if (process.env.NODE_ENV === 'production') {
        response.headers.set(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains'
        );
    }

    // 🔐 Path-based protection
    const isAdminRoute = path.startsWith('/admin');
    const isDashboardRoute = path.startsWith('/dashboard');
    const isApiRoute = path.startsWith('/api');
    const isLoginRoute = path === '/admin/login' || path === '/login';

    // Proteksi route admin/dashboard
    if ((isAdminRoute || isDashboardRoute) && !isLoginRoute) {
        const adminSession = request.cookies.get('admin_session');
        const sessionToken = request.cookies.get('session_token');

        // Jika tidak ada session, redirect ke login
        if (!adminSession?.value && !sessionToken?.value) {
            console.warn(`[UNAUTHORIZED] Path: ${path}, IP: ${ip}`);

            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('returnUrl', encodeURIComponent(path));

            return NextResponse.redirect(loginUrl);
        }

        // 🔒 CSP yang lebih ketat untuk area admin
        if (isAdminRoute) {
            response.headers.set(
                'Content-Security-Policy',
                "default-src 'self'; " +
                "script-src 'self'; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data:; " +
                "font-src 'self'; " +
                "connect-src 'self'; " +
                "frame-ancestors 'none';"
            );
        }
    }

    // 🔐 Proteksi API routes
    if (isApiRoute) {
        // CORS headers untuk API
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Access-Control-Allow-Credentials', 'true');

        // Validasi Origin (sederhana)
        const origin = request.headers.get('origin');
        if (origin && !origin.includes('localhost') && !origin.includes('yourdomain.com')) {
            response.headers.set('Access-Control-Allow-Origin', 'self');
        } else if (origin) {
            response.headers.set('Access-Control-Allow-Origin', origin);
        }
    }

    // 🔐 Basic path traversal protection
    const suspiciousPatterns = ['../', '..\\', '/etc/', '/bin/', 'cmd.exe'];
    const hasSuspiciousPattern = suspiciousPatterns.some(pattern => path.includes(pattern));

    if (hasSuspiciousPattern) {
        console.warn(`[SUSPICIOUS PATH] ${path} from IP: ${ip}`);
        return new NextResponse('Forbidden', { status: 403 });
    }

    // Tambahkan rate limit info header
    if (!isStaticAsset && !isPublicFile && ip !== 'unknown' && rateLimitStore[ip]) {
        const ipData = rateLimitStore[ip];
        response.headers.set('X-RateLimit-Limit', String(MAX_REQUESTS));
        response.headers.set('X-RateLimit-Remaining', String(Math.max(0, MAX_REQUESTS - ipData.count)));
        response.headers.set('X-RateLimit-Reset', String(ipData.resetTime));
    }

    return response;
}

// 🔧 Konfigurasi matcher
export const config = {
    matcher: [
        // Match semua routes kecuali static files
        '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|public/).*)',
    ],
};