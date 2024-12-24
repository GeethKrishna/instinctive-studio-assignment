// app/api/courses/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
      const courses = await prisma.course.findMany({
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
          avatar: true,
        },
      });
  
      return NextResponse.json(courses);
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      );
    }
}  