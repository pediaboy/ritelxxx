import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function initDB() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS global_settings (
        id SERIAL PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
      INSERT INTO global_settings (key, value) VALUES
        ('vip_price', '299000'),
        ('bank_account', '1234567890'),
        ('bank_name', 'BCA'),
        ('bank_holder', 'THIRAFI THARIQ AL IDRIS'),
        ('wa_link', 'https://chat.whatsapp.com/invite/example')
      ON CONFLICT (key) DO NOTHING;
    `
  })
  return error
}

export async function getSetting(key: string): Promise<string> {
  const { data } = await supabase
    .from('global_settings')
    .select('value')
    .eq('key', key)
    .single()
  return data?.value || ''
}

export async function setSetting(key: string, value: string) {
  const { error } = await supabase
    .from('global_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  return error
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const { data } = await supabase.from('global_settings').select('key, value')
  if (!data) return {}
  return Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]))
}
