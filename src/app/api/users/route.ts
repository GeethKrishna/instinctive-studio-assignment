import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userID = searchParams.get('userID')

  if (!userID) {
    return new NextResponse('User ID is required', { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userID }
    })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 })
  }
}