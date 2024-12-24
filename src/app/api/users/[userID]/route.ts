import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  {params} : {params: Record<string, string>}
): Promise<NextResponse> {
  const {userID} = await params;

  if (!userID) {
    return new NextResponse('User ID is required', { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userID }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}