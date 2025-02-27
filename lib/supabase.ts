import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY


const supabase = createClient("https://bvaspntenbrqwqaqvzlx.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2YXNwbnRlbmJycXdxYXF2emx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1OTIzMzcsImV4cCI6MjA1NDE2ODMzN30.sSXAXunw8FVwpwRO1rFFAOnbrRpSTA04jwv3-nplUCM")

export default supabase