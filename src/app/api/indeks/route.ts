import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Referer': 'https://sectors.app/',
}

export async function GET() {
  try {
    const { data: html } = await axios.get('https://sectors.app/indonesia/indeks', {
      headers: HEADERS,
      timeout: 10000,
    })
    const $ = cheerio.load(html)
    const indices: { name: string; value: string; change: string; changePercent: string }[] = []

    $('table tbody tr').each((_, row) => {
      const cells = $(row).find('td')
      if (cells.length >= 2) {
        indices.push({
          name: $(cells[0]).text().trim(),
          value: $(cells[1]).text().trim(),
          change: $(cells[2])?.text().trim() || '',
          changePercent: $(cells[3])?.text().trim() || '',
        })
      }
    })

    $('[class*="index"], [class*="indeks"], [class*="market"]').each((_, el) => {
      const name = $(el).find('[class*="name"], h3, h4').first().text().trim()
      const value = $(el).find('[class*="value"], [class*="price"]').first().text().trim()
      if (name && value) {
        indices.push({ name, value, change: '', changePercent: '' })
      }
    })

    return NextResponse.json({ success: true, data: indices.slice(0, 30) })
  } catch (err: unknown) {
    const error = err as Error
    return NextResponse.json({ success: false, error: error.message, data: [] }, { status: 500 })
  }
}
