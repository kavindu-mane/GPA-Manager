import { PrismaClient } from "@prisma/client";
import { Context } from "hono";

export const Register = async (c: Context, prisma: PrismaClient) => {
  const { email, password, name } = await c.req.json();
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // check if user already exists
    if (!user) {
      // generate hashed password
      const hash = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 4,
      });

      // create user
      await prisma.user.create({
        data: {
          name,
          email,
          password: hash,
        },
      });
      // success response
      return c.json(
        {
          success: true,
          message: "User created successfully",
        },
        201,
      );
    } else {
      return c.json(
        {
          success: false,
          message: "User already exists",
        },
        401,
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
