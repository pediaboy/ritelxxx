'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '@/components/Footer'

type Tab = 'settings' | 'users'
interface Settings { vip_price: string; bank_account: string; bank_name: string; bank_holder: string; wa_link: string }
interface VipUser { id: number; name: string; phone: string; email: string; status: string; notes: string; joined_at: string; expired_at: string }

const ADMIN_PASS = 'pedia123'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pass, setPass] = useState('')
  const [passError, setPassError] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('settings')

  // Settings state
  const [settings, setSettings] = useState<Settings>({ vip_price: '', bank_account: '', bank_name: '', bank_holder: '', wa_link: '' })
  const [loadingSettings, setLoadingSettings] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)

  // Users state
  const [users, setUsers] = useState<VipUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', phone: '', email: '', status: 'active', notes: '', expired_at: '' })
  const [addingUser, setAddingUser] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [toast, setToast] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast(msg); setToastType(type); setTimeout(() => setToast(''), 3000)
  }

  const handleLogin = () => {
    if (pass === ADMIN_PASS) { setAuthed(true); setPassError('') }
    else setPassError('Password salah. Coba lagi.')
  }

  const fetchSettings = useCallback(async () => {
    setLoadingSettings(true)
    const res = await fetch('/api/settings').then(r => r.json())
    if (res.data) setSettings({
      vip_price: res.data.vip_price || '',
      bank_account: res.data.bank_account || '',
      bank_name: res.data.bank_name || '',
      bank_holder: res.data.bank_holder || '',
      wa_link: res.data.wa_link || '',
    })
    setLoadingSettings(false)
  }, [])

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true)
    const res = await fetch(`/api/users?adminPass=${ADMIN_PASS}`).then(r => r.json())
    if (res.success) setUsers(res.data || [])
    else showToast(res.error || 'Gagal memuat user', 'error')
    setLoadingUsers(false)
  }, [])

  useEffect(() => {
    if (authed) {
      fetchSettings()
      fetchUsers()
    }
  }, [authed, fetchSettings, fetchUsers])

  const saveSetting = async (key: string, value: string) => {
    setSaving(key)
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value, adminPass: ADMIN_PASS }),
    }).then(r => r.json())
    if (res.success) showToast('Berhasil disimpan!')
    else showToast('Gagal: ' + res.error, 'error')
    setSaving(null)
  }

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.phone) { showToast('Nama dan nomor HP wajib diisi', 'error'); return }
    setAddingUser(true)
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newUser, adminPass: ADMIN_PASS }),
    }).then(r => r.json())
    if (res.success) {
      showToast('User berhasil ditambahkan!')
      setNewUser({ name: '', phone: '', email: '', status: 'active', notes: '', expired_at: '' })
      setShowAddUser(false)
      fetchUsers()
    } else {
      showToast('Gagal menambah user: ' + res.error, 'error')
    }
    setAddingUser(false)
  }

  const handleToggleStatus = async (user: VipUser) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, status: newStatus, adminPass: ADMIN_PASS }),
    }).then(r => r.json())
    if (res.success) { showToast('Status diupdate!'); fetchUsers() }
    else showToast('Gagal update: ' + res.error, 'error')
  }

  const handleDeleteUser = async (id: number) => {
    setDeletingId(id)
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, adminPass: ADMIN_PASS }),
    }).then(r => r.json())
    if (res.success) { showToast('User dihapus'); fetchUsers() }
    else showToast('Gagal hapus: ' + res.error, 'error')
    setDeletingId(null)
  }

  // === LOGIN SCREEN ===
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
                <input type="password" value={pass} onChange={e => setPass(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Masukkan password..."
                  className="w-full glass-card px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#6c63ff]/50 transition-all" />
                {passError && <p className="text-xs text-red-400 mt-1.5">{passError}</p>}
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleLogin}
                className="w-full py-3 rounded-xl bg-[#6c63ff] text-white text-sm font-bold glow-btn flex items-center justify-center gap-2">
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

  const statusColor: Record<string, string> = {
    active: 'text-green-400 bg-green-400/10 border-green-400/30',
    inactive: 'text-red-400 bg-red-400/10 border-red-400/30',
    expired: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  }

  return (
    <div className="page-wrapper">
      <div className="container-mobile animate-fade-in">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span className="text-xs font-semibold tracking-widest text-[#6c63ff] uppercase">Admin</span>
          </div>
          <h1 className="text-xl font-bold text-white">CMS Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">{users.length} user terdaftar</p>
        </motion.div>

        {/* Tabs */}
        <div className="glass-card p-1 flex gap-1 mb-4">
          {(['settings', 'users'] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 glow-btn ${activeTab === tab ? 'bg-[#6c63ff] text-white' : 'text-slate-400 hover:text-white'}`}>
              {tab === 'settings' ? 'Pengaturan' : `Kelola User (${users.length})`}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* SETTINGS TAB */}
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
                        <input type={field.type} value={settings[field.key]}
                          onChange={e => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="flex-1 glass-card px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#6c63ff]/50 transition-all rounded-xl" />
                        <motion.button whileTap={{ scale: 0.95 }}
                          onClick={() => saveSetting(field.key, settings[field.key])}
                          disabled={saving === field.key}
                          className="px-4 py-2.5 rounded-xl bg-[#6c63ff] text-white text-xs font-semibold glow-btn disabled:opacity-50 flex items-center gap-1.5 min-w-[70px] justify-center">
                          {saving === field.key ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} /> : 'Simpan'}
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              {/* Add User Button */}
              <div className="mb-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowAddUser(!showAddUser)}
                  className="w-full py-3 rounded-xl bg-[#6c63ff] text-white text-xs font-bold glow-btn flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                  {showAddUser ? 'Batal' : 'Tambah Member VIP'}
                </motion.button>
              </div>

              {/* Add User Form */}
              <AnimatePresence>
                {showAddUser && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="glass-card p-4 mb-4 overflow-hidden">
                    <h3 className="text-xs font-bold text-white mb-3">Data Member Baru</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'name', label: 'Nama Lengkap *', type: 'text', placeholder: 'Contoh: Budi Santoso' },
                        { key: 'phone', label: 'No HP/WA *', type: 'tel', placeholder: '08xxx' },
                        { key: 'email', label: 'Email (opsional)', type: 'email', placeholder: 'email@contoh.com' },
                        { key: 'notes', label: 'Catatan', type: 'text', placeholder: 'Transfer 20/1/2025, dst.' },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="text-[10px] text-slate-400 mb-1 block">{f.label}</label>
                          <input type={f.type} value={(newUser as Record<string, string>)[f.key]}
                            onChange={e => setNewUser(prev => ({ ...prev, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            className="w-full glass-card px-3 py-2 text-xs text-white placeholder-slate-500 outline-none rounded-xl" />
                        </div>
                      ))}
                      <div>
                        <label className="text-[10px] text-slate-400 mb-1 block">Status</label>
                        <select value={newUser.status} onChange={e => setNewUser(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full glass-card px-3 py-2 text-xs text-white outline-none rounded-xl bg-transparent">
                          <option value="active" className="bg-[#0d0d2b]">Active</option>
                          <option value="inactive" className="bg-[#0d0d2b]">Inactive</option>
                          <option value="expired" className="bg-[#0d0d2b]">Expired</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 mb-1 block">Tanggal Expired (opsional)</label>
                        <input type="date" value={newUser.expired_at}
                          onChange={e => setNewUser(prev => ({ ...prev, expired_at: e.target.value }))}
                          className="w-full glass-card px-3 py-2 text-xs text-white outline-none rounded-xl" />
                      </div>
                      <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddUser} disabled={addingUser}
                        className="w-full py-2.5 rounded-xl bg-green-600 text-white text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-2">
                        {addingUser ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} /> Menyimpan...</> : 'Simpan Member'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* User List */}
              <div className="glass-card p-4 mb-4">
                {loadingUsers ? (
                  <div className="flex justify-center py-8"><div className="spinner" /></div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto mb-3 opacity-30" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <p className="text-xs text-slate-400">Belum ada member VIP</p>
                    <p className="text-[10px] text-slate-500 mt-1">Tambahkan member pertama di atas</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {users.map((user) => (
                      <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-xs font-bold text-white truncate">{user.name}</p>
                              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${statusColor[user.status] || statusColor.inactive}`}>
                                {user.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400">{user.phone}</p>
                            {user.email && <p className="text-[10px] text-slate-500">{user.email}</p>}
                            {user.notes && <p className="text-[10px] text-slate-500 italic mt-0.5">{user.notes}</p>}
                            {user.expired_at && (
                              <p className="text-[9px] text-yellow-400 mt-0.5">
                                Exp: {new Date(user.expired_at).toLocaleDateString('id-ID')}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <button onClick={() => handleToggleStatus(user)}
                              className={`px-2 py-1 rounded-lg text-[9px] font-semibold border transition-all ${user.status === 'active' ? 'border-red-400/30 text-red-400 hover:bg-red-400/10' : 'border-green-400/30 text-green-400 hover:bg-green-400/10'}`}>
                              {user.status === 'active' ? 'Nonaktif' : 'Aktifkan'}
                            </button>
                            <button onClick={() => handleDeleteUser(user.id)} disabled={deletingId === user.id}
                              className="px-2 py-1 rounded-lg text-[9px] font-semibold border border-red-500/20 text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all disabled:opacity-40">
                              {deletingId === user.id ? '...' : 'Hapus'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout */}
        <button onClick={() => setAuthed(false)}
          className="w-full py-2.5 rounded-xl border border-white/10 text-xs text-slate-400 hover:text-red-400 hover:border-red-400/30 transition-all duration-200 mb-4">
          Keluar dari Admin
        </button>

        <Footer />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 border text-white text-xs px-5 py-3 rounded-2xl shadow-xl z-50 whitespace-nowrap ${
              toastType === 'error' ? 'bg-red-900/80 border-red-500/40' : 'bg-[#1a1a4e] border-[#6c63ff]/40'
            }`}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
