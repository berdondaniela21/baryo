// Add this to the top of your scripts
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://gpjfilzuvybggrddfsil.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwamZpbHp1dnliZ2dyZGRmc2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MDI1NTYsImV4cCI6MjA5MTQ3ODU1Nn0.OxOlh_bd9YGCzHgaqrCb9mwy9Jeo7VIzO1Hrrh1tfsQ'
export const supabase = createClient(supabaseUrl, supabaseKey)

// Export it so other files can use it
window.supabase = supabase;
