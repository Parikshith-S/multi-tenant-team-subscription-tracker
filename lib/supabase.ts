import { createClient } from '@supabase/supabase-js';

// Anon client — safe for server components / route handlers for user-scoped reads
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
