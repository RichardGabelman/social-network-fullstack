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

describe("POST /api/follows/:userId", () => {
  it("follows a user and returns 201", async () => {
    const follower = await createTestUser({ username: "follower" });
    const target = await createTestUser({ username: "target" });
    const token = generateToken(follower.id);

    const res = await request(app)
      .post(`/api/follows/${target.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body.followerId).toBe(follower.id);
    expect(res.body.followingId).toBe(target.id);
  });

  it("returns 400 when trying to follow yourself", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);

    const res = await request(app)
      .post(`/api/follows/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/yourself/i);
  });

  it("returns 404 when following a non-existent user", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);

    const res = await request(app)
      .post("/api/follows/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("returns 400 when already following a user", async () => {
    const follower = await createTestUser({ username: "follower" });
    const target = await createTestUser({ username: "target" });
    const token = generateToken(follower.id);

    await prisma.follows.create({
      data: { followerId: follower.id, followingId: target.id },
    });

    const res = await request(app)
      .post(`/api/follows/${target.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already following/i);
  });

  it("returns 401 when not authenticated", async () => {
    const target = await createTestUser();

    const res = await request(app).post(`/api/follows/${target.id}`);
    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/follows/:userId", () => {
  it("unfollows a user and returns 204", async () => {
    const follower = await createTestUser({ username: "follower" });
    const target = await createTestUser({ username: "target" });
    const token = generateToken(follower.id);

    await prisma.follows.create({
      data: { followerId: follower.id, followingId: target.id },
    });

    const res = await request(app)
      .delete(`/api/follows/${target.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);

    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: follower.id,
          followingId: target.id,
        },
      },
    });
    expect(follow).toBeNull();
  });

  it("returns 404 when unfollowing a user you don't follow", async () => {
    const follower = await createTestUser({ username: "follower" });
    const target = await createTestUser({ username: "target" });
    const token = generateToken(follower.id);

    const res = await request(app)
      .delete(`/api/follows/${target.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("returns 401 when not authenticated", async () => {
    const target = await createTestUser();

    const res = await request(app).delete(`/api/follows/${target.id}`);
    expect(res.status).toBe(401);
  });
});
