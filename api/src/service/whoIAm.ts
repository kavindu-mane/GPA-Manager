import { PrismaClient } from "@prisma/client";
import { Context } from "hono";

export const WhoIAm = async (c: Context, prisma: PrismaClient) => {
  const user = await c.var.jwtPayload;
  const userData = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    select: {
      email: true,
      name: true,
    },
  });
  return c.json({ data: userData });
};
