import { createClient } from '@supabase/supabase-js'

// Ambil kunci dari Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Debug (Hanya akan muncul di Console Browser saat Inspect)
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('🚨 Supabase Env Vars missing!');
} else {
    console.log('🔗 Supabase initialized with URL:', supabaseUrl);
}

// Buat client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true, // SAYA UBAH JADI TRUE (Supaya kalau refresh tidak logout)
        autoRefreshToken: true,
        detectSessionInUrl: false
    }
})