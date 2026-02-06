import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jtmbnmpggzbucmgglisw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bWJubXBnZ3pidWNtZ2dsaXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NjM3MTAsImV4cCI6MjA4NTQzOTcxMH0.f4pXbQCwJyTOPF27BODKuTGo9grFOhTdXgXwqVl6jQk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
