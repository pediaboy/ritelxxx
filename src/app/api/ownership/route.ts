import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

const FALLBACK = [
  { ticker: 'BBRI', name: 'Bank Rakyat Indonesia', foreignOwnership: '28,4%', govOwnership: '56,8%', publicOwnership: '14,8%' },
  { ticker: 'BMRI', name: 'Bank Mandiri', foreignOwnership: '31,2%', govOwnership: '52,1%', publicOwnership: '16,7%' },
  { ticker: 'TLKM', name: 'Telkom Indonesia', foreignOwnership: '24,5%', govOwnership: '52,6%', publicOwnership: '22,9%' },
  { ticker: 'BBNI', name: 'Bank Negara Indonesia', foreignOwnership: '22,3%', govOwnership: '60,0%', publicOwnership: '17,7%' },
  { ticker: 'PGAS', name: 'Perusahaan Gas Negara', foreignOwnership: '12,8%', govOwnership: '56,9%', publicOwnership: '30,3%' },
  { ticker: 'JSMR', name: 'Jasa Marga', foreignOwnership: '9,4%', govOwnership: '70,0%', publicOwnership: '20,6%' },
  { ticker: 'WIKA', name: 'Wijaya Karya', foreignOwnership: '8,2%', govOwnership: '65,0%', publicOwnership: '26,8%' },
  { ticker: 'PTPP', name: 'PP (Persero)', foreignOwnership: '11,3%', govOwnership: '51,0%', publicOwnership: '37,7%' },
  { ticker: 'ADHI', name: 'Adhi Karya', foreignOwnership: '7,6%', govOwnership: '51,0%', publicOwnership: '41,4%' },
  { ticker: 'WSKT', name: 'Waskita Karya', foreignOwnership: '5,9%', govOwnership: '75,3%', publicOwnership: '18,8%' },
]

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

export async function GET() {
  try {
    const { data: html } = await axios.get('https://sectors.app/indonesia/company-ownership', {
      headers: { 'User-Agent': UA, 'Accept': 'text/html,*/*;q=0.8', 'Referer': 'https://www.google.com/' },
      timeout: 12000,
    })
    const $ = cheerio.load(html)
    const companies: { ticker: string; name: string; foreignOwnership: string; govOwnership: string; publicOwnership: string }[] = []

    $('table tbody tr').each((_, row) => {
      const cells = $(row).find('td')
      if (cells.length >= 2) {
        const ticker = $(cells[0]).text().trim()
        if (ticker && ticker.length >= 2 && ticker.length <= 6) {
          companies.push({
            ticker,
            name: $(cells[1]).text().trim(),
            foreignOwnership: $(cells[2])?.text().trim() || '',
            govOwnership: $(cells[3])?.text().trim() || '',
            publicOwnership: $(cells[4])?.text().trim() || '',
          })
        }
      }
    })

    if (companies.length === 0) {
      return NextResponse.json({ success: true, data: FALLBACK, source: 'fallback' })
    }
    return NextResponse.json({ success: true, data: companies.slice(0, 50), source: 'scraped' })
  } catch {
    return NextResponse.json({ success: true, data: FALLBACK, source: 'fallback' })
  }
}
