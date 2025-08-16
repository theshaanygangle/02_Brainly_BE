import express, { Router } from "express";

import {
  addContent,
  brainShare,
  deleteContent,
  shareLink,
  showContent,
} from "../controllers/auth.controllers.js";
import { userMiddleware } from "../middlewares/auth.middleware.js";

const contentRouter = Router();

contentRouter.post("/content", userMiddleware, addContent);
contentRouter.get("/content", userMiddleware, showContent);
contentRouter.delete("/content", userMiddleware, deleteContent);
contentRouter.post("/brain/share", userMiddleware, brainShare);
contentRouter.get("/brain/:shareLink", shareLink);

export default contentRouter;
