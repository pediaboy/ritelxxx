import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8',
  'Referer': 'https://sectors.app/',
}

export async function GET() {
  try {
    const { data: html } = await axios.get('https://sectors.app/indonesia/news', {
      headers: HEADERS,
      timeout: 10000,
    })
    const $ = cheerio.load(html)
    const news: { title: string; url: string; date: string; summary: string }[] = []

    $('article, .news-item, [class*="news"], [class*="article"]').each((_, el) => {
      const title = $(el).find('h2, h3, h4, .title, [class*="title"]').first().text().trim()
      const url = $(el).find('a').first().attr('href') || ''
      const date = $(el).find('time, .date, [class*="date"]').first().text().trim()
      const summary = $(el).find('p, .summary, [class*="summary"]').first().text().trim()
      if (title) {
        news.push({
          title,
          url: url.startsWith('http') ? url : `https://sectors.app${url}`,
          date,
          summary: summary.slice(0, 200),
        })
      }
    })

    if (news.length === 0) {
      $('a[href*="/news/"], a[href*="/artikel/"]').each((_, el) => {
        const title = $(el).text().trim()
        const url = $(el).attr('href') || ''
        if (title && title.length > 20) {
          news.push({ title, url: url.startsWith('http') ? url : `https://sectors.app${url}`, date: '', summary: '' })
        }
      })
    }

    return NextResponse.json({ success: true, data: news.slice(0, 20) })
  } catch (err: unknown) {
    const error = err as Error
    return NextResponse.json({ success: false, error: error.message, data: [] }, { status: 500 })
  }
}
