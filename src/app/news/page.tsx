'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

interface NewsItem { title: string; url: string; date: string; summary: string }

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(d => { setNews(d.data || []); setLoading(false) })
      .catch(() => { setError('Gagal memuat berita'); setLoading(false) })
  }, [])

  return (
    <div className="page-wrapper">
      <div className="container-mobile animate-fade-in">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z"/></svg>
            <span className="text-xs font-semibold tracking-widest text-[#a78bfa] uppercase">Ritelcommunity.id</span>
          </div>
          <h1 className="text-xl font-bold text-white">Berita Saham</h1>
          <p className="text-xs text-slate-500 mt-1">Update terkini dari sectors.app</p>
        </motion.div>

        <NavBar />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 mb-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="spinner" />
              <p className="text-xs text-slate-400">Mengambil berita terbaru...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400">Tidak ada berita tersedia saat ini</p>
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((item, i) => (
                <motion.a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="block p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/5 hover:border-[#6c63ff]/30"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#6c63ff] mt-1.5" />
                    <div>
                      <p className="text-xs font-semibold text-white leading-snug mb-1">{item.title}</p>
                      {item.summary && <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{item.summary}</p>}
                      {item.date && <p className="text-[10px] text-slate-500 mt-1.5">{item.date}</p>}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </motion.div>

        <Footer />
      </div>
    </div>
  )
}
