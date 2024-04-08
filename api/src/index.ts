import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { PrismaClient } from "@prisma/client";
import { bearerAuth } from "hono/bearer-auth";
import { verify, decode } from "hono/jwt";
import { validate as uuidValidate } from "uuid";
import {
  addSemesterSchema,
  addSubjectSchema,
  loginSchema,
  registerSchema,
} from "./validation/schema";
import {
  AddSemester,
  AddSubject,
  DeleteSemester,
  DeleteSubject,
  GetSemester,
  GetSubjects,
  Login,
  Logout,
  Register,
  Statistics,
  UpdateSemester,
  UpdateSubject,
  WhoIAm,
} from "./service";
/**
 * @requires
 * If you are run on Bun you need to comment bellow line .
 * If you are run on Nodejs you need to uncomment bellow line.
 */
// import { serve } from "@hono/node-server";

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
// cors setup
app.use(
  "/api/*",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// login route
api.post("/login", zValidator("json", loginSchema), async (c) =>
  Login(c, prisma),
);

// register route
api.post("/register", zValidator("json", registerSchema), async (c) =>
  Register(c, prisma),
);

// authorization middleware setup with bearer token
api.use("/user/*", async (c, next) => {
  const auth = bearerAuth({
    verifyToken: async (token) => {
      try {
        // check if token is valid
        const isValid = await verify(token, process.env.JWT_SECRET!);
        if (isValid) {
          const { payload } = decode(token);
          // check if user is valid
          const isValidUser = uuidValidate(payload.user);
          if (!isValidUser) return false;
          // check if user exists
          const user = await prisma.session.findUnique({
            where: {
              id: payload.user,
            },
          });
          // if user exists
          if (user) {
            c.set("jwtPayload", user);
            return true;
          }
          // if user does not exist
          return false;
        }
        // if token is invalid
        return false;
      } catch (e) {
        // if any error occurs
        return false;
      }
    },
  });
  return auth(c, next);
});

// get user route
api.get("/user", async (c) => WhoIAm(c, prisma));

//user logout route
api.post("/user/logout", async (c) => Logout(c, prisma));

// user get semester route
api.get("/user/semester", async (c) => GetSemester(c, prisma));

// user add semester route
api.post(
  "/user/semester/add",
  zValidator("json", addSemesterSchema),
  async (c) => AddSemester(c, prisma),
);

// delete semester route
api.delete("/user/semester/delete/:id", async (c) => DeleteSemester(c, prisma));

// update semester route
api.put(
  "/user/semester/update/:id",
  zValidator("json", addSemesterSchema),
  async (c) => UpdateSemester(c, prisma),
);

// user get subject route
api.get("/user/subject", async (c) => GetSubjects(c, prisma));

// user add subject route
api.post("/user/subject/add", zValidator("json", addSubjectSchema), async (c) =>
  AddSubject(c, prisma),
);

// user update subject route
api.put(
  "/user/subject/update/:id",
  zValidator("json", addSubjectSchema),
  async (c) => UpdateSubject(c, prisma),
);

// user delete subject route
api.delete("/user/subject/delete/:id", async (c) => DeleteSubject(c, prisma));

// user statistics route
api.get("/user/statistics", async (c) => Statistics(c, prisma));

// initialize the base path
app.route("/api", api);

/**
 * @requires
 * If you are run on Nodejs you need to comment bellow line .
 * If you are run on Bun you need to uncomment bellow line.
 */

export default {
  port: 8000,
  fetch: app.fetch,
};

/**
 * @requires
 * If you are run on Bun you need to comment bellow line .
 * If you are run on Nodejs you need to uncomment bellow line.
 */

// serve({
//   port: 8000,
//   fetch: app.fetch,
// })
