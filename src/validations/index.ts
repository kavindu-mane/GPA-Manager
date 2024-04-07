import { z } from "zod";

// form schema for login validation
export const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email field has to be filled." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(1, { message: "Password field has to be filled." })
    .max(32, { message: "Password should contain maximum 32 characters." }),
});

// form schema for register validation
export const RegisterFormSchema = z
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

// form schema for add subject form validation
export const AddSubjectFormSchema = z.object({
  semester: z.string().min(1, { message: "Semester field has to be filled." }),
  subject: z
    .string()
    .min(1, { message: "Subject field has to be filled." })
    .max(100, {
      message: "Subject should contain maximum 100 characters.",
    }),
  grade: z.string().min(1, { message: "Grade field has to be filled." }),
  credits: z
    .string()
    .min(1, { message: "Credits field has to be filled." })
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: "Credits must be a number",
    })
    .refine((val) => val >= 1 && val <= 10, {
      message: "Credits must be between 1 and 10",
    }),
});

// form schema for add semester form validation
export const AddSemesterFormSchema = z.object({
  semester: z
    .string()
    .min(1, { message: "Semester field has to be filled." })
    .max(100, {
      message: "Semester should contain maximum 100 characters.",
    }),
});
