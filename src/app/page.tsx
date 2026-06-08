'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface Stock { ticker: string; name: string; price: string; change: string; changePercent: string }
interface NewsItem { title: string; url: string; date: string; summary: string }

export default function HomePage() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [loadingStocks, setLoadingStocks] = useState(true)
  const [loadingNews, setLoadingNews] = useState(true)

  useEffect(() => {
    fetch('/api/idxbumn20').then(r => r.json()).then(d => { setStocks(d.data || []); setLoadingStocks(false) })
    fetch('/api/news').then(r => r.json()).then(d => { setNews(d.data || []); setLoadingNews(false) })
  }, [])

  const isNegative = (val: string) => val.startsWith('-')

  return (
    <div className="page-wrapper">
      <div className="container-mobile animate-fade-in">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <span className="text-xs font-semibold tracking-widest text-[#6c63ff] uppercase">Ritelcommunity.id</span>
          </div>
          <h1 className="text-xl font-bold text-white">SCREENER</h1>
          <p className="text-xs text-slate-500 mt-1">Data Pasar Saham Indonesia</p>
        </motion.div>

        <NavBar />

        {/* IDX BUMN20 Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="glass-card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
              <span className="text-sm font-semibold text-[#f5c518]">IDX BUMN20</span>
            </div>
            <Link href="/ownership" className="text-xs text-[#6c63ff] hover:underline">Lihat semua</Link>
          </div>
          {loadingStocks ? (
            <div className="flex justify-center py-6"><div className="spinner" /></div>
          ) : stocks.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-4">Data tidak tersedia</p>
          ) : (
            <div className="space-y-2">
              {stocks.slice(0, 8).map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <div>
                    <span className="text-xs font-bold text-white">{s.ticker}</span>
                    <p className="text-[10px] text-slate-400">{s.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-white">{s.price}</p>
                    <p className={`text-[10px] font-medium ${isNegative(s.changePercent) ? 'text-red-400' : 'text-green-400'}`}>
                      {s.changePercent}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* News Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="glass-card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z"/></svg>
              <span className="text-sm font-semibold text-[#a78bfa]">Berita Terbaru</span>
            </div>
            <Link href="/news" className="text-xs text-[#6c63ff] hover:underline">Semua berita</Link>
          </div>
          {loadingNews ? (
            <div className="flex justify-center py-6"><div className="spinner" /></div>
          ) : news.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-4">Berita tidak tersedia</p>
          ) : (
            <div className="space-y-3">
              {news.slice(0, 4).map((n, i) => (
                <motion.a key={i} href={n.url} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
                  className="block py-2 border-b border-white/5 last:border-0 hover:opacity-80 transition-opacity">
                  <p className="text-xs font-medium text-white leading-snug line-clamp-2">{n.title}</p>
                  {n.date && <p className="text-[10px] text-slate-500 mt-1">{n.date}</p>}
                </motion.a>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="grid grid-cols-2 gap-3 mb-4">
          <Link href="/pricing" className="glass-card p-4 flex flex-col items-center gap-2 glow-gold-btn transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span className="text-xs font-semibold text-[#f5c518]">Akses VIP</span>
            <span className="text-[10px] text-slate-400 text-center">Premium screener tools</span>
          </Link>
          <Link href="/ownership" className="glass-card p-4 flex flex-col items-center gap-2 glow-btn transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span className="text-xs font-semibold text-[#6c63ff]">Ownership</span>
            <span className="text-[10px] text-slate-400 text-center">Data kepemilikan saham</span>
          </Link>
        </motion.div>

        <Footer />
      </div>
    </div>
  )
}
