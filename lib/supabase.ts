import { createBrowserClient } from '@supabase/ssr';

// Validasi Env Vars agar tidak error "undefined"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase Environment Variables");
}

// Gunakan createBrowserClient agar Cookies Auth otomatis tersimpan di browser
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);