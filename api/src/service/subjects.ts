import { PrismaClient } from "@prisma/client";
import { Context } from "hono";
import { getAllSemesters } from "./semester";

const getGpa = (grade: string) => {
  switch (grade) {
    case "A+" || "A":
      return 4.0;
    case "A":
      return 4.0;
    case "A-":
      return 3.7;
    case "B+":
      return 3.3;
    case "B":
      return 3.0;
    case "B-":
      return 2.7;
    case "C+":
      return 2.3;
    case "C":
      return 2.0;
    case "C-":
      return 1.7;
    case "D":
      return 1.3;
    default:
      return 0.0;
  }
};

export const AddSubject = async (c: Context, prisma: PrismaClient) => {
  const { semester, subject, grade, credits } = await c.req.json();
  const user = await c.var.jwtPayload;
  const gpa = getGpa(grade);

  try {
    // check semester is user's
    const semesterData = await prisma.semester.findUnique({
      where: {
        id: semester,
      },
      select: {
        userId: true,
      },
    });

    // send not found response if semester not found in user's semesters
    if (!semesterData || semesterData.userId !== user.userId) {
      return c.json(
        {
          success: false,
          message: "Semester not found",
        },
        404,
      );
    }

    // create subject
    await prisma.course.create({
      data: {
        name: subject,
        semesterId: semester,
        grade: grade,
        gpa: gpa,
        credits: credits,
      },
    });

    // update semester
    await prisma.semester.update({
      where: {
        id: semester,
      },
      data: {
        totalCredits: {
          increment: credits,
        },
        gpa: {
          increment: gpa * credits,
        },
      },
    });

    // success response
    return c.json(
      {
        success: true,
        message: "Subject created successfully",
      },
      201,
    );
  } catch (error) {
    // error response
    return c.json(
      {
        success: false,
        message: "Failed to create subject",
      },
      500,
    );
  }
};

export const GetSubjects = async (c: Context, prisma: PrismaClient) => {
  const user = await c.var.jwtPayload;
  try {
    //  retrieve all semesters results of the user
    const semestersWithCourses = await prisma.semester.findMany({
      where: {
        userId: user.userId,
      },
      select: {
        id: true,
        name: true,
        totalCredits: true,
        gpa: true,
        courses: {
          select: {
            id: true,
            name: true,
            grade: true,
            gpa: true,
            credits: true,
          },
        },
      },
    });

    // success response
    return c.json(
      {
        success: true,
        message: "Semester results retrieved successfully",
        data: semestersWithCourses,
      },
      200,
    );
  } catch (error) {
    // error response
    return c.json(
      {
        success: false,
        message: "Server Error",
      },
      500,
    );
  }
};

export const DeleteSubject = async (c: Context, prisma: PrismaClient) => {
  const { id } = c.req.param();
  const user = await c.var.jwtPayload;
  try {
    // delete subject
    const isDeleted = await prisma.course.delete({
      where: {
        id: Number(id),
        AND: {
          semester: {
            userId: user.userId,
          },
        },
      },
    });

    if (isDeleted) {
      // update semester after deleting subject
      await prisma.semester.update({
        where: {
          id: isDeleted.semesterId,
        },
        data: {
          totalCredits: {
            decrement: isDeleted.credits,
          },
          gpa: {
            decrement: isDeleted.gpa * isDeleted.credits,
          },
        },
      });

      //  retrieve all semesters results of the user
      const semesters = await getAllSemesters(prisma, user);

      // success response
      return c.json(
        {
          success: true,
          message: "Semester deleted successfully",
          data: semesters,
        },
        200,
      );
    } else {
      // error response
      return c.json(
        {
          success: false,
          message: "Error deleting semester",
        },
        500,
      );
    }
  } catch (error) {
    // error response
    return c.json(
      {
        success: false,
        message: "Failed to delete subject",
      },
      500,
    );
  }
};

export const UpdateSubject = async (c: Context, prisma: PrismaClient) => {
  const { semester, subject, grade, credits } = await c.req.json();
  const user = await c.var.jwtPayload;
  const gpa = getGpa(grade);
  const { id } = c.req.param();

  try {
    // get subject before update
    const subjectBeforeUpdate = await prisma.course.findUnique({
      where: {
        id: Number(id),
        AND: {
          semester: {
            userId: user.userId,
          },
        },
      },
      select: {
        semesterId: true,
        credits: true,
        gpa: true,
      },
    });

    // update subject
    const subjectData = await prisma.course.update({
      where: {
        id: Number(id),
        AND: {
          semester: {
            userId: user.userId,
          },
        },
      },
      data: {
        name: subject,
        grade: grade,
        gpa: gpa,
        credits: credits,
        semesterId: semester,
      },
    });

    if (subjectData && subjectBeforeUpdate) {
      // update semester after updating subject
      await prisma.semester.update({
        where: {
          id: subjectBeforeUpdate.semesterId,
        },
        data: {
          totalCredits: {
            increment: credits - subjectBeforeUpdate.credits,
          },
          gpa: {
            increment:
              gpa * credits -
              subjectBeforeUpdate.gpa * subjectBeforeUpdate.credits,
          },
        },
      });

      //  retrieve all subject results of the user
      const subject = await getAllSemesters(prisma, user);
      // success response
      return c.json(
        {
          success: true,
          message: "Subject updated successfully",
          data: subject,
        },
        200,
      );
    } else {
      // error response
      return c.json(
        {
          success: false,
          message: "Error deleting semester",
        },
        500,
      );
    }
  } catch (error) {
    // error response
    return c.json(
      {
        success: false,
        message: error,
      },
      500,
    );
  }
};
