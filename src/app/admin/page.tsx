'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '@/components/Footer'

type Tab = 'settings' | 'users'

interface Settings { vip_price: string; bank_account: string; bank_name: string; bank_holder: string; wa_link: string }

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pass, setPass] = useState('')
  const [passError, setPassError] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('settings')
  const [settings, setSettings] = useState<Settings>({ vip_price: '', bank_account: '', bank_name: '', bank_holder: '', wa_link: '' })
  const [loadingSettings, setLoadingSettings] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleLogin = () => {
    if (pass === 'pedia123') { setAuthed(true); setPassError('') }
    else setPassError('Password salah. Coba lagi.')
  }

  useEffect(() => {
    if (authed) {
      setLoadingSettings(true)
      fetch('/api/settings').then(r => r.json()).then(d => {
        if (d.data) setSettings({ vip_price: d.data.vip_price || '', bank_account: d.data.bank_account || '', bank_name: d.data.bank_name || '', bank_holder: d.data.bank_holder || '', wa_link: d.data.wa_link || '' })
        setLoadingSettings(false)
      })
    }
  }, [authed])

  const saveSetting = async (key: string, value: string) => {
    setSaving(key)
    try {
      const res = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value, adminPass: 'pedia123' }) })
      const d = await res.json()
      if (d.success) showToast('Berhasil disimpan!')
      else showToast('Gagal menyimpan: ' + d.error)
    } catch { showToast('Terjadi kesalahan jaringan') }
    setSaving(null)
  }

  if (!authed) {
    return (
      <div className="page-wrapper items-center justify-center min-h-screen">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="container-mobile">
          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/30 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-slate-500 mt-1">Ritelcommunity.id CMS</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Password Admin</label>
                <input
                  type="password"
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Masukkan password..."
                  className="w-full glass-card px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#6c63ff]/50 transition-all"
                />
                {passError && <p className="text-xs text-red-400 mt-1.5">{passError}</p>}
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleLogin}
                className="w-full py-3 rounded-xl bg-[#6c63ff] text-white text-sm font-bold glow-btn flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                Masuk
              </motion.button>
            </div>
          </div>
          <Footer />
        </motion.div>
      </div>
    )
  }

  const settingFields: { key: keyof Settings; label: string; type: string; placeholder: string }[] = [
    { key: 'vip_price', label: 'Harga VIP (Rp)', type: 'number', placeholder: '299000' },
    { key: 'bank_name', label: 'Nama Bank', type: 'text', placeholder: 'BCA, BRI, Mandiri...' },
    { key: 'bank_account', label: 'Nomor Rekening', type: 'text', placeholder: '1234567890' },
    { key: 'bank_holder', label: 'Atas Nama', type: 'text', placeholder: 'Nama Pemilik Rekening' },
    { key: 'wa_link', label: 'Link WA Group', type: 'url', placeholder: 'https://chat.whatsapp.com/...' },
  ]

  return (
    <div className="page-wrapper">
      <div className="container-mobile animate-fade-in">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span className="text-xs font-semibold tracking-widest text-[#6c63ff] uppercase">Admin</span>
          </div>
          <h1 className="text-xl font-bold text-white">CMS Dashboard</h1>
        </motion.div>

        {/* Tabs */}
        <div className="glass-card p-1 flex gap-1 mb-4">
          {(['settings', 'users'] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 glow-btn ${activeTab === tab ? 'bg-[#6c63ff] text-white' : 'text-slate-400 hover:text-white'}`}>
              {tab === 'settings' ? 'Pengaturan' : 'Status User'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }} className="glass-card p-5 mb-4">
              <h2 className="text-sm font-bold text-white mb-4">Pengaturan Pricing & Rekening</h2>
              {loadingSettings ? (
                <div className="flex justify-center py-8"><div className="spinner" /></div>
              ) : (
                <div className="space-y-4">
                  {settingFields.map(field => (
                    <div key={field.key}>
                      <label className="text-xs text-slate-400 mb-1.5 block">{field.label}</label>
                      <div className="flex gap-2">
                        <input
                          type={field.type}
                          value={settings[field.key]}
                          onChange={e => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="flex-1 glass-card px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#6c63ff]/50 transition-all rounded-xl"
                        />
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => saveSetting(field.key, settings[field.key])}
                          disabled={saving === field.key}
                          className="px-4 py-2.5 rounded-xl bg-[#6c63ff] text-white text-xs font-semibold glow-btn disabled:opacity-50 flex items-center gap-1.5 min-w-[70px] justify-center"
                        >
                          {saving === field.key ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} /> : 'Simpan'}
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="glass-card p-5 mb-4">
              <h2 className="text-sm font-bold text-white mb-2">Manajemen Status User</h2>
              <p className="text-xs text-slate-400 mb-4">Kelola status member VIP dari panel ini.</p>
              <div className="p-4 rounded-xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 text-center">
                <svg className="mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <p className="text-xs text-slate-300">Fitur manajemen user akan ditampilkan di sini setelah integrasi database aktif.</p>
                <p className="text-[10px] text-slate-500 mt-1">Hubungkan Supabase untuk mulai mengelola user.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout */}
        <button onClick={() => setAuthed(false)} className="w-full py-2.5 rounded-xl border border-white/10 text-xs text-slate-400 hover:text-red-400 hover:border-red-400/30 transition-all duration-200 mb-4">
          Keluar dari Admin
        </button>

        <Footer />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a4e] border border-[#6c63ff]/40 text-white text-xs px-5 py-3 rounded-2xl shadow-xl z-50">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
