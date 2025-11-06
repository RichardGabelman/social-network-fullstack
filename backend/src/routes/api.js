import express from "express";
import authRouter from "./auth.js";
import followRouter from "./follows.js";

const router = express.Router();

router.use("/auth", authRouter);

router.use("/follows", followRouter);

export default router;