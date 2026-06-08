'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

interface Company { ticker: string; name: string; foreignOwnership: string; govOwnership: string; publicOwnership: string }

export default function OwnershipPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/ownership')
      .then(r => r.json())
      .then(d => { setCompanies(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = companies.filter(c =>
    c.ticker.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-wrapper">
      <div className="container-mobile animate-fade-in">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span className="text-xs font-semibold tracking-widest text-[#6c63ff] uppercase">Ritelcommunity.id</span>
          </div>
          <h1 className="text-xl font-bold text-white">Company Ownership</h1>
          <p className="text-xs text-slate-500 mt-1">Data kepemilikan saham IDX</p>
        </motion.div>

        <NavBar />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari ticker atau nama perusahaan..."
              className="w-full glass-card pl-8 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#6c63ff]/50 transition-all"
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-4 mb-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="spinner" />
              <p className="text-xs text-slate-400">Memuat data ownership...</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">Tidak ada data ditemukan</p>
          ) : (
            <div>
              {/* Header */}
              <div className="grid grid-cols-12 gap-1 pb-2 border-b border-white/10 mb-2">
                <span className="col-span-3 text-[10px] text-slate-500 font-semibold">TICKER</span>
                <span className="col-span-3 text-[10px] text-slate-500 font-semibold text-right">ASING</span>
                <span className="col-span-3 text-[10px] text-slate-500 font-semibold text-right">GOV</span>
                <span className="col-span-3 text-[10px] text-slate-500 font-semibold text-right">PUBLIK</span>
              </div>
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                {filtered.map((c, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-12 gap-1 py-2 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-lg px-1 transition-colors">
                    <div className="col-span-3">
                      <p className="text-[11px] font-bold text-white">{c.ticker}</p>
                      <p className="text-[9px] text-slate-500 truncate">{c.name}</p>
                    </div>
                    <span className="col-span-3 text-[11px] text-blue-400 font-medium text-right self-center">{c.foreignOwnership || '-'}</span>
                    <span className="col-span-3 text-[11px] text-yellow-400 font-medium text-right self-center">{c.govOwnership || '-'}</span>
                    <span className="col-span-3 text-[11px] text-green-400 font-medium text-right self-center">{c.publicOwnership || '-'}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <Footer />
      </div>
    </div>
  )
}
