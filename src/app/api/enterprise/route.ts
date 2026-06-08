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
    const { data: html } = await axios.get('https://sectors.app/enterprise', {
      headers: HEADERS,
      timeout: 10000,
    })
    const $ = cheerio.load(html)
    const features: { title: string; description: string }[] = []

    $('[class*="feature"], [class*="plan"], [class*="pricing"], .card').each((_, el) => {
      const title = $(el).find('h2, h3, h4, [class*="title"]').first().text().trim()
      const desc = $(el).find('p, [class*="desc"]').first().text().trim()
      if (title) features.push({ title, description: desc.slice(0, 300) })
    })

    return NextResponse.json({ success: true, data: features.slice(0, 20) })
  } catch (err: unknown) {
    const error = err as Error
    return NextResponse.json({ success: false, error: error.message, data: [] }, { status: 500 })
  }
}
