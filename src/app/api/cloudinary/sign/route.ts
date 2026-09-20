import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const timestamp = Math.round(new Date().getTime() / 1000)
    const apiSecret = process.env.CLOUDINARY_API_SECRET!
    
    // Create string to sign
    const signatureString = `timestamp=${timestamp}${apiSecret}`
    
    const signature = crypto
      .createHash('sha1')
      .update(signatureString)
      .digest('hex')

    return NextResponse.json({
      timestamp,
      signature,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    })
  } catch (error) {
    console.error('Error generating Cloudinary signature:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
