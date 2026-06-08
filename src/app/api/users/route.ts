import { NextResponse } from 'next/server'
import { getAllUsers, createUser, updateUser, deleteUser } from '@/lib/supabase'

// GET - ambil semua user
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const adminPass = searchParams.get('adminPass')
  if (adminPass !== 'pedia123') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const users = await getAllUsers()
    return NextResponse.json({ success: true, data: users })
  } catch (err: unknown) {
    const error = err as Error
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST - tambah user baru
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { adminPass, ...userData } = body
    if (adminPass !== 'pedia123') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const { data, error } = await createUser(userData)
    if (error) return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
    return NextResponse.json({ success: true, data })
  } catch (err: unknown) {
    const error = err as Error
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PATCH - update user
export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { adminPass, id, ...updates } = body
    if (adminPass !== 'pedia123') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const error = await updateUser(id, updates)
    if (error) return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const error = err as Error
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE - hapus user
export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { adminPass, id } = body
    if (adminPass !== 'pedia123') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const error = await deleteUser(id)
    if (error) return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const error = err as Error
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
