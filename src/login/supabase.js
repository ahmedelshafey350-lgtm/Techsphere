import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

export function isSupabaseConfigured() {
    return Boolean(
        supabaseUrl
        && supabaseAnonKey
        && !supabaseUrl.includes('your-project')
        && !supabaseAnonKey.includes('your-')
    );
}

export function getSupabaseClient() {
    if (!isSupabaseConfigured()) {
        throw new Error(
            'إعداد Supabase غير مكتمل. أضف رابط المشروع ومفتاحه إلى ملف البيئة ثم أعد تشغيل التطبيق.'
        );
    }

    if (!supabase) {
        supabase = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
            },
        });
    }

    return supabase;
}
