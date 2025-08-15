import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(3, "Username too Short!"),
  email: z.string().email("Invalid Email!"),
  password: z.string().min(8, "Too Short!"),
});

export const loginSchema = z
  .object({
    username: z.string().min(3, "Username too Short!"),
    password: z.string().min(8, "Too Short!"),
  })
  .or(
    z.object({
      email: z.string().email("Invalid Email!"),
      password: z.string().min(8, "Too Short!"),
    })
  );
