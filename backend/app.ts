import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import apiRouter from "./src/routes/api.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Social Media API - listening on port ${PORT}!`);
});
