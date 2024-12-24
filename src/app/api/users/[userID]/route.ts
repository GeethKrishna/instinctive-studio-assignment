// app/api/users/[userId]/route.ts
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { userID: string } }
) {
  const { userID } = context.params

  if (!userID) {
    return new Response('User ID is required', { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userID }
    })

    if (!user) {
      return new Response('User not found', { status: 404 })
    }

    return Response.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}