import type { Request, Response, NextFunction } from "express";
import passport from "../config/passport.js";

export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("jwt", { session: false }, (err: any, user: Express.User) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    req.user = user;
    next();
  })(req, res, next);
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("jwt", { session: false }, (err: any, user: Express.User | null) => {
    if (err) return next(err);
    req.user = user || null;
    next();
  })(req, res, next);
}

