import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // 1. Siapkan Response Awal
    // Kita butuh response object untuk memanipulasi cookie sebelum dikembalikan
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 2. Setup Supabase Client (Server-Side)
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // Update cookie di request & response agar sinkron (Refresh Token terjadi di sini)
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 3. Cek User dari Supabase (Ini akan me-refresh session jika expired)
    // Penting: getUser() lebih aman daripada getSession() di middleware
    const { data: { user } } = await supabase.auth.getUser()

    // 4. Cek Cookie Manual (VIP Pass / Fallback)
    // Ini penyelamat jika session Supabase belum terdeteksi tapi user baru saja login via API admin
    const adminSession = request.cookies.get('admin_session');
    const hasManualCookie = !!adminSession?.value; // True jika cookie ada isinya

    // --- LOGIKA PROTEKSI ROUTE ---
    const path = request.nextUrl.pathname;

    // Tentukan area yang diproteksi (tambahkan /dashboard jika perlu)
    const isAdminArea = path.startsWith('/admin') && path !== '/admin/login';
    const isLoginPage = path === '/admin/login';

    // KASUS A: Mencoba masuk area Admin tapi BELUM Login
    // Kondisi: Masuk /admin..., bukan di login, tidak ada user supabase, tidak ada cookie manual
    if (isAdminArea) {
        if (!user && !hasManualCookie) {
            // Redirect ke login, simpan URL tujuan di query param 'returnUrl'
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('returnUrl', path);
            return NextResponse.redirect(loginUrl);
        }
    }

    // KASUS B: Mencoba masuk halaman Login tapi SUDAH Login
    // Kondisi: Di halaman login, tapi punya user atau cookie manual
    if (isLoginPage) {
        if (user || hasManualCookie) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
    }

    // KASUS C: User Valid atau Halaman Publik -> Lanjut
    // Kita kembalikan 'response' yang sudah dimodifikasi oleh Supabase (set-cookie)
    return response
}