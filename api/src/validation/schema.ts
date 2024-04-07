import { z } from "zod";

// login schema for login form validation
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email field has to be filled." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(1, { message: "Password field has to be filled." })
    .max(32, { message: "Password should contain maximum 32 characters." }),
});

// register schema for register form validation
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name field has to be filled." })
      .max(50, { message: "Name should contain maximum 50 characters." }),
    email: z
      .string()
      .min(1, { message: "Email field has to be filled." })
      .email("This is not a valid email."),
    password: z
      .string()
      .min(1, { message: "Password field has to be filled." })
      .max(32, { message: "Password should contain maximum 32 characters." }),
    repeat_password: z
      .string()
      .min(1, { message: "Repeat Password field has to be filled." })
      .max(32, {
        message: "Repeat Password should contain maximum 32 characters.",
      }),
  })
  .refine((data) => data.password === data.repeat_password, {
    message: "Passwords do not match.",
    path: ["repeat_password"],
  });

// add subject schema for add subject form validation
export const addSubjectSchema = z.object({
  semester: z.string().min(1, { message: "Semester field has to be filled." }),
  subject: z
    .string()
    .min(1, { message: "Subject field has to be filled." })
    .max(100, {
      message: "Subject should contain maximum 100 characters.",
    }),
  grade: z.string().min(1, { message: "Grade field has to be filled." }),
  credits: z
    .number()
    .gte(1, { message: "Credits must be between 1 and 10" })
    .lte(10, { message: "Credits must be between 1 and 10" }),
});

// add semester schema for add semester form validation
export const addSemesterSchema = z.object({
  semester: z
    .string()
    .min(1, { message: "Semester field has to be filled." })
    .max(100, {
      message: "Semester should contain maximum 100 characters.",
    }),
});
