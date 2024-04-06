import { PrismaClient } from "@prisma/client";
import { Context } from "hono";
import { deleteCookie } from "hono/cookie";

export const Logout = async (c: Context, prisma: PrismaClient) => {
  const user = await c.var.jwtPayload;
  await prisma.session.delete({
    where: {
      id: user.id,
    },
  });
  deleteCookie(c, "token");
  return c.json({ message: "Logged out" });
};
