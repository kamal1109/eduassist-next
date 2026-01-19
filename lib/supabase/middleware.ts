import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
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

    // getUser() adalah pengecekan server-side yang paling aman
    const { data: { user } } = await supabase.auth.getUser()

    const adminSession = request.cookies.get('admin_session');
    const hasManualCookie = !!adminSession?.value;

    const path = request.nextUrl.pathname;
    const isAdminArea = path.startsWith('/admin') && path !== '/admin/login';
    const isLoginPage = path === '/admin/login';

    // --- LOGIKA PROTEKSI TAMBAHAN ---

    if (isAdminArea) {
        // Jika tidak ada user Supabase, tapi masih ada cookie manual,
        // berati cookie itu "sampah" atau expired. Kita anggap tidak login.
        if (!user) {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('returnUrl', path);

            // Buat response redirect
            const redirectResponse = NextResponse.redirect(loginUrl);

            // HAPUS cookie manual agar bersih
            redirectResponse.cookies.set('admin_session', '', { maxAge: 0 });
            return redirectResponse;
        }
    }

    if (isLoginPage) {
        if (user || hasManualCookie) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
    }

    return response
}