# Architecture

Client → Supabase APIs → Postgres + RLS  
Service role key only on server. Never expose service role to browser.
