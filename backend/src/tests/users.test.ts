import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../../app.js";
import prisma from "../db/prisma.js";
import {
  resetDatabase,
  createTestUser,
  generateToken,
  teardown,
} from "./helpers/setupTests.js";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await teardown();
});

describe("GET /api/users", () => {
  it("returns all users without authentication", async () => {
    await createTestUser({ username: "alice" });
    await createTestUser({ username: "bob" });

    const res = await request(app).get("/api/users");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("isFollowing", false);
  });

  it("excludes the current user from the list when authenticated", async () => {
    const me = await createTestUser({ username: "me" });
    await createTestUser({ username: "alice" });
    await createTestUser({ username: "bob" });
    const token = generateToken(me.id);

    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    const usernames = res.body.map((u: any) => u.username);
    expect(usernames).not.toContain("me");
  });

  it("returns isFollowing=true for users the authenticated user follows", async () => {
    const me = await createTestUser({ username: "me" });
    const other = await createTestUser({ username: "other" });
    const token = generateToken(me.id);

    await prisma.follows.create({
      data: { followerId: me.id, followingId: other.id },
    });

    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    const found = res.body.find((u: any) => u.username === "other");
    expect(found.isFollowing).toBe(true);
  });

  it("returns users ordered by username ascending", async () => {
    await createTestUser({ username: "zebra" });
    await createTestUser({ username: "apple" });
    await createTestUser({ username: "mango" });

    const res = await request(app).get("/api/users");

    expect(res.status).toBe(200);
    const usernames = res.body.map((u: any) => u.username);
    expect(usernames).toEqual([...usernames].sort());
  });

  it("returns empty array when no users exist", async () => {
    const res = await request(app).get("/api/users");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});