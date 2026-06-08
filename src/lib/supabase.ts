import { createClient } from '@supabase/supabase-js'

// Clean URL - remove trailing /rest/v1/ if present
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

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
    .upsert({ key, value }, { onConflict: 'key' })
  return error
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('global_settings').select('key, value')
  if (error || !data) return {}
  return Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]))
}

// VIP Users
export interface VipUser {
  id?: number
  name: string
  phone: string
  email?: string
  status: 'active' | 'inactive' | 'expired'
  notes?: string
  joined_at?: string
  expired_at?: string
}

export async function getAllUsers(): Promise<VipUser[]> {
  const { data, error } = await supabase
    .from('vip_users')
    .select('*')
    .order('joined_at', { ascending: false })
  if (error || !data) return []
  return data
}

export async function createUser(user: Omit<VipUser, 'id' | 'joined_at'>) {
  const { data, error } = await supabase
    .from('vip_users')
    .insert([user])
    .select()
    .single()
  return { data, error }
}

export async function updateUser(id: number, updates: Partial<VipUser>) {
  const { error } = await supabase
    .from('vip_users')
    .update(updates)
    .eq('id', id)
  return error
}

export async function deleteUser(id: number) {
  const { error } = await supabase
    .from('vip_users')
    .delete()
    .eq('id', id)
  return error
}
