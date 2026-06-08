import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

const FALLBACK_STOCKS = [
  { ticker: 'BBRI', name: 'Bank Rakyat Indonesia', price: '4.250', change: '+50', changePercent: '+1.19%' },
  { ticker: 'BMRI', name: 'Bank Mandiri', price: '5.800', change: '+75', changePercent: '+1.31%' },
  { ticker: 'BBNI', name: 'Bank Negara Indonesia', price: '4.920', change: '-30', changePercent: '-0.61%' },
  { ticker: 'TLKM', name: 'Telkom Indonesia', price: '3.150', change: '+20', changePercent: '+0.64%' },
  { ticker: 'PGAS', name: 'Perusahaan Gas Negara', price: '1.430', change: '+15', changePercent: '+1.06%' },
  { ticker: 'JSMR', name: 'Jasa Marga', price: '3.890', change: '-20', changePercent: '-0.51%' },
  { ticker: 'WIKA', name: 'Wijaya Karya', price: '680', change: '+10', changePercent: '+1.49%' },
  { ticker: 'WSKT', name: 'Waskita Karya', price: '183', change: '-5', changePercent: '-2.66%' },
  { ticker: 'PTPP', name: 'PP (Persero)', price: '760', change: '+15', changePercent: '+2.01%' },
  { ticker: 'ADHI', name: 'Adhi Karya', price: '415', change: '+5', changePercent: '+1.22%' },
]

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

export async function GET() {
  try {
    const { data: html } = await axios.get('https://sectors.app/indonesia/index/idxbumn20', {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Referer': 'https://www.google.com/',
        'Accept-Language': 'id-ID,id;q=0.9',
      },
      timeout: 12000,
    })
    const $ = cheerio.load(html)
    const stocks: { ticker: string; name: string; price: string; change: string; changePercent: string }[] = []

    $('table tbody tr').each((_, row) => {
      const cells = $(row).find('td')
      if (cells.length >= 2) {
        const ticker = $(cells[0]).text().trim()
        if (ticker && ticker.length >= 2 && ticker.length <= 6) {
          stocks.push({
            ticker,
            name: $(cells[1]).text().trim(),
            price: $(cells[2])?.text().trim() || '',
            change: $(cells[3])?.text().trim() || '',
            changePercent: $(cells[4])?.text().trim() || $(cells[3])?.text().trim() || '',
          })
        }
      }
    })

    if (stocks.length === 0) {
      return NextResponse.json({ success: true, data: FALLBACK_STOCKS, source: 'fallback' })
    }

    return NextResponse.json({ success: true, data: stocks.slice(0, 25), source: 'scraped' })
  } catch {
    return NextResponse.json({ success: true, data: FALLBACK_STOCKS, source: 'fallback' })
  }
}
