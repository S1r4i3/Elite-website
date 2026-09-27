/** Supabase connection details, shared by the browser and the server. */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is the name the Vercel ↔ Supabase integration uses.
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

/** True once the project URL and the publishable key are configured. */
export const supabaseConfigured = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Bucket holding client tax documents (private). */
export const DOCUMENTS_BUCKET = process.env.SUPABASE_DOCUMENTS_BUCKET || "client-documents";
