import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // WAJIB next/server

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isAdmin = request.cookies.get('admin_session');

    if (path.startsWith('/admin/dashboard')) {
        if (!isAdmin) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }
}