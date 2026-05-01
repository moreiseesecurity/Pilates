import { createClient } from '@supabase/supabase-js'

// Values from your Supabase Dashboard
const supabaseUrl = 'https://njuchrxxvlxmlzkhfxz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qdWNocnh4dmx4a21semtoZnh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTQzOTYsImV4cCI6MjA5MzIzMDM5Nn0.920x1virUj2fjVGHP3TzRovHqUxKpIs6P_Ea1D5NRB8' // Click 'Copy' on the 'anon public' row

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
