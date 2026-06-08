import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
]

const FALLBACK_NEWS = [
  { title: 'IHSG Menguat Didukung Sektor Keuangan dan Energi', url: 'https://sectors.app/indonesia/news', date: 'Hari ini', summary: 'Indeks Harga Saham Gabungan (IHSG) mengalami penguatan pada sesi perdagangan hari ini.' },
  { title: 'Saham BUMN Kompak Menguat, BBRI dan BMRI Memimpin', url: 'https://sectors.app/indonesia/news', date: 'Hari ini', summary: 'Saham-saham BUMN kompak bergerak positif dipimpin oleh sektor perbankan.' },
  { title: 'Investor Asing Catat Net Buy di Pasar Saham Indonesia', url: 'https://sectors.app/indonesia/news', date: 'Kemarin', summary: 'Investor asing membukukan pembelian bersih pada perdagangan bursa Indonesia.' },
  { title: 'Analisis Teknikal: IDX BUMN20 Uji Level Resistance', url: 'https://sectors.app/indonesia/news', date: 'Kemarin', summary: 'Indeks IDX BUMN20 tengah menguji level resistance penting di tengah momentum bullish.' },
  { title: 'Laporan Keuangan Q1 2025: Mayoritas Emiten Tumbuh Positif', url: 'https://sectors.app/indonesia/news', date: '2 hari lalu', summary: 'Sebagian besar emiten tercatat di BEI melaporkan pertumbuhan laba bersih pada kuartal pertama 2025.' },
]

export async function GET() {
  const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
  
  try {
    const { data: html } = await axios.get('https://sectors.app/indonesia/news', {
      headers: {
        'User-Agent': ua,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Referer': 'https://www.google.com/',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
      },
      timeout: 12000,
    })

    const $ = cheerio.load(html)
    const news: { title: string; url: string; date: string; summary: string }[] = []

    // Coba berbagai selector
    const selectors = [
      'article', '.news-item', '[class*="news-card"]', '[class*="article-card"]',
      '[class*="NewsCard"]', '[class*="ArticleCard"]', 'a[href*="/news/"]',
    ]

    for (const sel of selectors) {
      $(sel).each((_, el) => {
        const title = $(el).find('h1,h2,h3,h4,[class*="title"],[class*="headline"]').first().text().trim()
          || $(el).attr('title') || $(el).text().trim().split('\n')[0].trim()
        const href = $(el).find('a').first().attr('href') || $(el).attr('href') || ''
        const date = $(el).find('time,[class*="date"],[class*="time"]').first().text().trim()
        const summary = $(el).find('p,[class*="desc"],[class*="excerpt"],[class*="summary"]').first().text().trim()
        
        if (title && title.length > 15 && title.length < 200 && !news.find(n => n.title === title)) {
          news.push({
            title,
            url: href.startsWith('http') ? href : href ? `https://sectors.app${href}` : 'https://sectors.app/indonesia/news',
            date: date || '',
            summary: summary.slice(0, 200),
          })
        }
      })
      if (news.length >= 5) break
    }

    if (news.length === 0) {
      return NextResponse.json({ success: true, data: FALLBACK_NEWS, source: 'fallback' })
    }

    return NextResponse.json({ success: true, data: news.slice(0, 20), source: 'scraped' })
  } catch {
    return NextResponse.json({ success: true, data: FALLBACK_NEWS, source: 'fallback' })
  }
}
