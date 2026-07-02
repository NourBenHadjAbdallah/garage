// lib/supabase-admin.ts
// Server-only client. NEVER import this from client components.
// Uses the service role key to bypass RLS for trusted, already-authenticated admin actions.
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})