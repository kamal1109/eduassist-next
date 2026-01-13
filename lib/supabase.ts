import { createClient } from '@supabase/supabase-js'

// Gunakan environment variables atau fallback ke hardcoded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mxrmjlkkzpyuptcqboqk.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_afUh2v9XDq66-j-gHaH1Pg_XQmwKww-'

// Debug untuk verifikasi
console.log('🔗 Supabase initialized:', {
    url: supabaseUrl,
    keyExists: !!supabaseAnonKey
})

// Buat client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: true,
        detectSessionInUrl: false
    }
})