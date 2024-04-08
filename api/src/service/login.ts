import { PrismaClient } from "@prisma/client";
import { Context } from "hono";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
/**
 * @requires
 * If you are run on Bun you need to comment bellow line .
 * If you are run on Nodejs you need to uncomment bellow line.
 */
// import { compareSync } from "bcrypt";

export const Login = async (c: Context, prisma: PrismaClient) => {
  const { email, password } = await c.req.json();

  try {
    // check user exists or not
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      // check password

      /**
       * @requires
       * If you are run on Bun you need uncomment bellow hash function.
       * If you are run on Nodejs you need to comment bellow hash function.
       */
      const isMatch = await Bun.password.verify(password, user.password);

      /**
       * @requires
       * If you are run on Nodejs you need uncomment bellow hash function.
       * If you are run on Bun you need to comment bellow hash function.
       */
      // const isMatch = compareSync(password, user.password);

      // if password matches
      if (isMatch) {
        // get date for 30 days
        const date = new Date();
        date.setDate(date.getDate() + 30);
        const uuid = await prisma.session.create({
          data: {
            userId: user.id,
            deletedAt: date,
          },
        });
        // generate token
        const payload = {
          name: user.name,
          user: uuid.id,
          exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 30, // Token expires in 5 minutes
        };
        // cookies setup
        const secret = process.env.JWT_SECRET!;
        const token = await sign(payload, secret);
        setCookie(c, "token", token, {
          path: "/",
          secure: false,
          domain: "localhost",
          httpOnly: false,
          expires: date,
          sameSite: "Strict",
        });
        return c.json(
          {
            success: true,
            message: "Login successful",
          },
          200,
        );
      } else {
        // if password does not match
        return c.json(
          {
            success: false,
            message: "Incorrect Email or password",
          },
          401,
        );
      }
    } else {
      // if email not found
      return c.json(
        {
          success: false,
          message: "Email not found",
        },
        401,
      );
    }
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Internal server error",
      },
      500,
    );
  }
};
