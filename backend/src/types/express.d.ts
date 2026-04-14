import type { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
    interface User {
      id: number;
      username: string;
      displayName: string;
      avatarUrl: string;
    }
  }
}

export {};