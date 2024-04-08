import { PrismaClient } from "@prisma/client";
import { Context } from "hono";
/**
 * @requires
 * If you are run on Bun you need to comment bellow line .
 * If you are run on Nodejs you need to uncomment bellow line.
 */
// import { hashSync } from "bcrypt";

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

      /**
       * @requires
       * If you are run on Bun you need uncomment bellow hash function.
       * If you are run on Nodejs you need to comment bellow hash function.
       */

      const hash = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 4,
      });

      /**
       * @requires
       * If you are run on Nodejs you need uncomment bellow hash function.
       * If you are run on Bun you need to comment bellow hash function.
       */
      
      // const hash = hashSync(password, 4);

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
