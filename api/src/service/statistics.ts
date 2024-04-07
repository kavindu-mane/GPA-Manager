import { PrismaClient } from "@prisma/client";
import { Context } from "hono";

export const Statistics = async (c: Context, prisma: PrismaClient) => {
  const user = await c.var.jwtPayload;
  try {
    //  retrieve all statistics of the user
    const statistics = await prisma.semester.findMany({
      where: {
        userId: user.userId,
      },
      select: {
        id: true,
        name: true,
        gpa: true,
        totalCredits: true,
        _count: true,
        courses: {
          select: {
            credits: true,
          },
        },
      },
    });

    // total semesters
    const totalSemesters = statistics.length;

    // calculate total credits
    const totalCredits = statistics.reduce(
      (acc, curr) => acc + curr.totalCredits,
      0,
    );
    // calculate total subjects
    const totalSubjects = statistics.reduce(
      (acc, curr) => acc + curr._count.courses,
      0,
    );
    // total gpa of all semesters
    const totalGPA = statistics.reduce((acc, curr) => acc + curr.gpa, 0);

    // success response
    return c.json(
      {
        success: true,
        message: "Statistics retrieved successfully",
        data: statistics,
        stats: {
          totalGPA,
          totalSemesters,
          totalSubjects,
          totalCredits,
        },
      },
      200,
    );
  } catch (error) {
    // error response
    return c.json(
      {
        success: false,
        message: "Error retrieving semester",
      },
      500,
    );
  }
};
