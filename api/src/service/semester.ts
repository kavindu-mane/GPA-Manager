/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { Context } from "hono";

export const getAllSemesters = async (prisma: PrismaClient, user: any) => {
  return await prisma.semester.findMany({
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
};

export const AddSemester = async (c: Context, prisma: PrismaClient) => {
  const { semester } = await c.req.json();
  const user = await c.var.jwtPayload;
  try {
    // create semester
    await prisma.semester.create({
      data: {
        name: semester,
        userId: user.userId,
      },
    });

    //  retrieve all semesters of the user
    const semesters = await prisma.semester.findMany({
      where: {
        userId: user.userId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    // success response
    return c.json(
      {
        success: true,
        message: "Semester created successfully",
        data: semesters,
      },
      201,
    );
  } catch (error) {
    // error response
    return c.json(
      {
        success: false,
        message: "Error creating user",
      },
      500,
    );
  }
};

export const GetSemester = async (c: Context, prisma: PrismaClient) => {
  const user = await c.var.jwtPayload;
  try {
    //  retrieve all semesters of the user
    const semesters = await prisma.semester.findMany({
      where: {
        userId: user.userId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    // success response
    return c.json(
      {
        success: true,
        message: "Semester retrieved successfully",
        data: semesters,
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

export const DeleteSemester = async (c: Context, prisma: PrismaClient) => {
  const { id } = c.req.param();
  const user = await c.var.jwtPayload;

  try {
    // delete semester
    const isDeleted = await prisma.semester.delete({
      where: {
        id: id,
        AND: {
          userId: user.userId,
        },
      },
    });

    if (isDeleted) {
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
        message: error,
      },
      500,
    );
  }
};

export const UpdateSemester = async (c: Context, prisma: PrismaClient) => {
  const { semester } = await c.req.json();
  const { id } = c.req.param();
  const user = await c.var.jwtPayload;
  try {
    // create semester
    const isUpdated = await prisma.semester.update({
      where: {
        id: id,
        AND: {
          userId: user.userId,
        },
      },
      data: {
        name: semester,
      },
    });

    if (isUpdated) {
      //  retrieve all semesters results of the user
      const semesters = await getAllSemesters(prisma, user);
      // success response
      return c.json(
        {
          success: true,
          message: "Semester updated successfully",
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
        message: "Error creating user",
      },
      500,
    );
  }
};