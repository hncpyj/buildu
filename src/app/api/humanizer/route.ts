// app/api/humanizer/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { rewriteText } from '@/utils/humanizer'

export async function POST(req: NextRequest) {
  const { inputText, level } = await req.json()
  if (!inputText || !level) {
    return NextResponse.json({ error: 'Missing inputText or level' }, { status: 400 })
  }

  try {
    const rewrittenText = await rewriteText(inputText, level)
    return NextResponse.json({ rewrittenText })
  } catch (err) {
    console.error('[humanizer]', err)
    return NextResponse.json({ error: 'Rewrite failed' }, { status: 500 })
  }
}