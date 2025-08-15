import { Router } from "express";
import { z } from "zod";
import { loginSchema, signupSchema } from "../validators/auth.schema.js";
import { signin, signup } from "../controllers/auth.controllers.js";

const authRouter = Router();

const validate = (Schema: z.ZodSchema) => (req: any, res: any, next: any) => {
  try {
    Schema.parse(req.body);
    next();
  } catch (error: any) {
    return res.status(400).json({ errors: error.errors });
  }
};

authRouter.post("/signup", validate(signupSchema), signup);
authRouter.post("/signin", validate(loginSchema), signin);

export default authRouter;
