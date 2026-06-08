import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

const FALLBACK_INDICES = [
  { name: 'IHSG', value: '7.234,56', change: '+45,23', changePercent: '+0,63%' },
  { name: 'IDX BUMN20', value: '456,78', change: '+3,45', changePercent: '+0,76%' },
  { name: 'LQ45', value: '892,34', change: '+6,78', changePercent: '+0,77%' },
  { name: 'IDX30', value: '512,45', change: '+4,12', changePercent: '+0,81%' },
  { name: 'JII', value: '623,45', change: '-2,34', changePercent: '-0,37%' },
  { name: 'KOMPAS100', value: '1.234,56', change: '+8,90', changePercent: '+0,73%' },
]

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'

export async function GET() {
  try {
    const { data: html } = await axios.get('https://sectors.app/indonesia/indeks', {
      headers: { 'User-Agent': UA, 'Accept': 'text/html,*/*;q=0.8', 'Referer': 'https://www.google.com/' },
      timeout: 12000,
    })
    const $ = cheerio.load(html)
    const indices: { name: string; value: string; change: string; changePercent: string }[] = []

    $('table tbody tr').each((_, row) => {
      const cells = $(row).find('td')
      if (cells.length >= 2) {
        const name = $(cells[0]).text().trim()
        const value = $(cells[1]).text().trim()
        if (name && value) {
          indices.push({ name, value, change: $(cells[2])?.text().trim() || '', changePercent: $(cells[3])?.text().trim() || '' })
        }
      }
    })

    if (indices.length === 0) {
      return NextResponse.json({ success: true, data: FALLBACK_INDICES, source: 'fallback' })
    }
    return NextResponse.json({ success: true, data: indices.slice(0, 20), source: 'scraped' })
  } catch {
    return NextResponse.json({ success: true, data: FALLBACK_INDICES, source: 'fallback' })
  }
}
