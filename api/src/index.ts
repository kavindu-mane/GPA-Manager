import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { PrismaClient } from "@prisma/client";
import { loginSchema, registerSchema } from "./validation/schema";
import { Register } from "./functions";

const app = new Hono();
const prisma = new PrismaClient();

app.get("/", (c) => c.text("GPA Manager API"));
app.get("/api", (c) => c.text("GPA Manager API"));
app.use(prettyJSON());

// not found handler
app.notFound((c) =>
  c.json(
    {
      message: "Not Found",
      ok: false,
    },
    404,
  ),
);

const api = new Hono();
api.use("/api/*", cors());

// login route
api.post("/login", zValidator("json", loginSchema), async (c) => {
  const data = await c.req.json();
  return c.json({
    success: true,
    message: `${data?.email} is ${data?.password}`,
  });
});

// register route
api.post("/register", zValidator("json", registerSchema), async (c) =>
  Register(c, prisma),
);

// initialize the base path
app.route("/api", api);

export default {
  port: 8000,
  fetch: app.fetch,
};
