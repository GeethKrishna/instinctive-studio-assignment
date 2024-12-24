import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        courses: { // Update to fetch multiple courses
          select: {
            id: true,
            name: true,
            code: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, cohort, status, courseIds } = body;

    // Validate input
    if (!name || !email || !cohort || !status || !Array.isArray(courseIds) || courseIds.length === 0) {
      return NextResponse.json(
        { error: "Name, email, cohort, status, and at least one course ID are required" },
        { status: 400 }
      );
    }

    // Ensure the status is a valid StudentStatus enum value
    const validStatuses = ["ACTIVE", "INACTIVE", "SUSPENDED", "GRADUATED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Valid statuses are: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Create a new student record with multiple courses
    const newStudent = await prisma.student.create({
      data: {
        name,
        email,
        cohort,
        status,
        courses: {
          connect: courseIds.map((id: string) => ({ id })), // Connect multiple courses
        },
      },
      include: {
        courses: { // Include courses in the response
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error: any) {
    console.error("Error creating student:", error);

    // Specific error handling for unique constraint violations
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email or other unique field already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}
