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
    const { data: html } = await axios.get('https://sectors.app/indonesia/company-ownership', {
      headers: HEADERS,
      timeout: 10000,
    })
    const $ = cheerio.load(html)
    const companies: { ticker: string; name: string; foreignOwnership: string; govOwnership: string; publicOwnership: string }[] = []

    $('table tbody tr').each((_, row) => {
      const cells = $(row).find('td')
      if (cells.length >= 2) {
        companies.push({
          ticker: $(cells[0]).text().trim(),
          name: $(cells[1]).text().trim(),
          foreignOwnership: $(cells[2])?.text().trim() || '',
          govOwnership: $(cells[3])?.text().trim() || '',
          publicOwnership: $(cells[4])?.text().trim() || '',
        })
      }
    })

    return NextResponse.json({ success: true, data: companies.slice(0, 50) })
  } catch (err: unknown) {
    const error = err as Error
    return NextResponse.json({ success: false, error: error.message, data: [] }, { status: 500 })
  }
}
