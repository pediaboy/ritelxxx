import { NextResponse } from 'next/server'
import { getAllSettings, setSetting } from '@/lib/supabase'

export async function GET() {
  try {
    const settings = await getAllSettings()
    return NextResponse.json({ success: true, data: settings })
  } catch (err: unknown) {
    const error = err as Error
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { key, value, adminPass } = body
    if (adminPass !== 'pedia123') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const error = await setSetting(key, value)
    if (error) return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const error = err as Error
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
