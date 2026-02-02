import "server-only"; // 🛡️ SECURITY: Prevents this file from being imported on the client side
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceRoleKey) {
  throw new Error(
    "FATAL: SUPABASE_SERVICE_ROLE_KEY is missing. Check your .env.local file.",
  );
}

// Create a Supabase client with the Service Role Key
// This client has admin privileges and must NEVER be exposed to the browser
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
