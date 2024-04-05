import { z } from "zod";

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
