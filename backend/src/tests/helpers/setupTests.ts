import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
import prisma from "../../db/prisma.js";
import jwt from "jsonwebtoken";

export async function resetDatabase() {
  await prisma.like.deleteMany();
  await prisma.follows.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
}

export async function createTestUser(overrides: {
  username?: string;
  displayName?: string;
  githubId?: string;
} = {}) {
  return prisma.user.create({
    data: {
      username: overrides.username ?? `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      displayName: overrides.displayName ?? "Test User",
      githubId: overrides.githubId ?? `gh_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    },
  });
}

export function generateToken(userId: number): string {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign({ userId }, secret, { expiresIn: "1h" });
}

export async function teardown() {
  await prisma.$disconnect();
}