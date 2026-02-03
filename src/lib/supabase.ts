import { createBrowserClient } from "@supabase/ssr";

// Use createBrowserClient for Client Components
// It automatically handles cookie storage for auth tokens
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
