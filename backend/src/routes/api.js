import express from "express";
import authRouter from "./auth.js";
import followRouter from "./follows.js";
import postRouter from "./posts.js";
import profileRouter from "./profile.js";

const router = express.Router();

router.use("/auth", authRouter);

router.use("/follows", followRouter);

router.use("/posts", postRouter);

router.use("/profile", profileRouter);

export default router;