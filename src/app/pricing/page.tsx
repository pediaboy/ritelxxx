'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

function generateInvoiceId() {
  return 'INV-' + Date.now().toString(36).toUpperCase()
}

function generateUniqueDigits() {
  return Math.floor(100 + Math.random() * 900)
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export default function PricingPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60)
  const [invoiceId] = useState(generateInvoiceId)
  const [uniqueDigits] = useState(generateUniqueDigits)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => { setSettings(d.data || {}); setLoading(false) })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0')
  const seconds = String(timeLeft % 60).padStart(2, '0')

  const basePrice = parseInt(settings.vip_price || '299000')
  const finalPrice = basePrice + uniqueDigits

  const handleConfirm = useCallback(() => {
    const msg = encodeURIComponent(
      `Halo, saya ingin konfirmasi pembayaran VIP:\n\nID Invoice: ${invoiceId}\nTotal Bayar: ${formatRupiah(finalPrice)}\nNo Rekening: ${settings.bank_account || '-'} (${settings.bank_name || 'Bank'})\na.n. ${settings.bank_holder || '-'}\n\nMohon konfirmasi, terima kasih.`
    )
    window.open(`https://wa.me/6282172222494?text=${msg}`, '_blank')
  }, [invoiceId, finalPrice, settings])

  return (
    <div className="page-wrapper">
      <div className="container-mobile animate-fade-in">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span className="text-xs font-semibold tracking-widest text-[#f5c518] uppercase">Akses VIP</span>
          </div>
          <h1 className="text-xl font-bold text-white">Invoice Pembayaran</h1>
        </motion.div>

        <NavBar />

        {loading ? (
          <div className="flex justify-center py-12"><div className="spinner" /></div>
        ) : (
          <>
            {/* Timer */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
              className="glass-card p-4 mb-4 text-center border border-red-500/20">
              <p className="text-[10px] text-slate-400 mb-2 uppercase tracking-widest">Invoice berakhir dalam</p>
              <div className="flex items-center justify-center gap-2">
                {[hours, minutes, seconds].map((val, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 min-w-[52px]">
                      <p className="text-2xl font-bold text-red-400 tabular-nums">{val}</p>
                      <p className="text-[9px] text-slate-500">{['JAM', 'MIN', 'DET'][i]}</p>
                    </div>
                    {i < 2 && <span className="text-red-400 font-bold text-lg">:</span>}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Invoice Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 mb-4">
              {/* Invoice Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Invoice</p>
                  <p className="text-xs font-mono font-bold text-[#6c63ff]">{invoiceId}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-[#f5c518]/10 border border-[#f5c518]/30 rounded-full px-3 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span className="text-[10px] text-[#f5c518] font-semibold">VIP</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-white mb-2">Yang kamu dapatkan:</p>
                <div className="space-y-1.5">
                  {['Akses full screener saham IDX', 'Data ownership real-time', 'Alert perubahan indeks BUMN20', 'Akses grup WA Premium', 'Update fitur seumur hidup'].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span className="text-[11px] text-slate-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Harga VIP</span>
                  <span className="text-white">{formatRupiah(basePrice)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Kode Unik</span>
                  <span className="text-[#f5c518]">+ Rp {uniqueDigits}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-2">
                  <span className="text-sm font-bold text-white">Total Bayar</span>
                  <span className="text-lg font-bold text-[#f5c518]">{formatRupiah(finalPrice)}</span>
                </div>
              </div>

              {/* Bank Info */}
              <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest">Transfer ke Rekening</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{settings.bank_name || 'BCA'} - {settings.bank_account || '-'}</p>
                    <p className="text-[10px] text-slate-400">a.n. {settings.bank_holder || 'THIRAFI THARIQ AL IDRIS'}</p>
                  </div>
                  <button onClick={() => navigator.clipboard?.writeText(settings.bank_account || '')}
                    className="glow-btn p-1.5 rounded-lg bg-[#6c63ff]/10 border border-[#6c63ff]/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Confirm Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleConfirm}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 text-white text-sm font-bold glow-btn mb-4 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.77-.77a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Konfirmasi via WhatsApp
            </motion.button>
          </>
        )}

        <Footer />
      </div>
    </div>
  )
}
