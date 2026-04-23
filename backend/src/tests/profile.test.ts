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

describe("GET /api/profile/me", () => {
  it("returns the current user's profile when authenticated", async () => {
    const user = await createTestUser({ username: "me_user" });
    const token = generateToken(user.id);

    const res = await request(app)
      .get("/api/profile/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(user.id);
    expect(res.body.username).toBe("me_user");
    expect(res.body._count).toHaveProperty("posts");
    expect(res.body._count).toHaveProperty("followers");
    expect(res.body._count).toHaveProperty("following");
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(app).get("/api/profile/me");
    expect(res.status).toBe(401);
  });
});

describe("PATCH /api/profile/me", () => {
  it("updates displayName and bio", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);

    const res = await request(app)
      .patch("/api/profile/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ displayName: "New Name", bio: "New bio" });

    expect(res.status).toBe(200);
    expect(res.body.displayName).toBe("New Name");
    expect(res.body.bio).toBe("New bio");
  });

  it("clears bio when empty string is sent", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);

    const res = await request(app)
      .patch("/api/profile/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ bio: "" });

    expect(res.status).toBe(200);
    expect(res.body.bio).toBeNull();
  });

  it("returns 400 when displayName exceeds 50 characters", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);

    const res = await request(app)
      .patch("/api/profile/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ displayName: "a".repeat(51) });

    expect(res.status).toBe(400);
  });

  it("returns 400 when bio exceeds 150 characters", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);

    const res = await request(app)
      .patch("/api/profile/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ bio: "a".repeat(151) });

    expect(res.status).toBe(400);
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(app)
      .patch("/api/profile/me")
      .send({ displayName: "New Name" });

    expect(res.status).toBe(401);
  });
});

describe("GET /api/profile/:username", () => {
  it("returns a user profile by username", async () => {
    const user = await createTestUser({ username: "findme" });

    const res = await request(app).get("/api/profile/findme");

    expect(res.status).toBe(200);
    expect(res.body.username).toBe("findme");
    expect(res.body).toHaveProperty("isFollowing", false);
    expect(res.body).toHaveProperty("isOwnProfile", false);
  });

  it("returns 404 for a non-existent username", async () => {
    const res = await request(app).get("/api/profile/doesnotexist");
    expect(res.status).toBe(404);
  });

  it("returns isOwnProfile=true when viewing your own profile", async () => {
    const user = await createTestUser({ username: "ownprofile" });
    const token = generateToken(user.id);

    const res = await request(app)
      .get("/api/profile/ownprofile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.isOwnProfile).toBe(true);
  });

  it("returns isFollowing=true when authenticated user follows the profile", async () => {
    const follower = await createTestUser({ username: "follower" });
    const target = await createTestUser({ username: "target" });
    const token = generateToken(follower.id);

    await prisma.follows.create({
      data: { followerId: follower.id, followingId: target.id },
    });

    const res = await request(app)
      .get("/api/profile/target")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.isFollowing).toBe(true);
  });

  it("returns followsYou=true when the profile user follows the authenticated user", async () => {
    const viewer = await createTestUser({ username: "viewer" });
    const other = await createTestUser({ username: "other" });
    const token = generateToken(viewer.id);

    await prisma.follows.create({
      data: { followerId: other.id, followingId: viewer.id },
    });

    const res = await request(app)
      .get("/api/profile/other")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.followsYou).toBe(true);
  });
});

describe("GET /api/profile/:username/followers", () => {
  it("returns a list of followers", async () => {
    const user = await createTestUser({ username: "popular" });
    const follower = await createTestUser({ username: "follower" });

    await prisma.follows.create({
      data: { followerId: follower.id, followingId: user.id },
    });

    const res = await request(app).get("/api/profile/popular/followers");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].username).toBe("follower");
  });

  it("returns empty array when user has no followers", async () => {
    await createTestUser({ username: "lonely" });

    const res = await request(app).get("/api/profile/lonely/followers");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  it("returns 404 for non-existent username", async () => {
    const res = await request(app).get("/api/profile/nobody/followers");
    expect(res.status).toBe(404);
  });
});

describe("GET /api/profile/:username/following", () => {
  it("returns a list of users the profile is following", async () => {
    const user = await createTestUser({ username: "active" });
    const target = await createTestUser({ username: "target" });

    await prisma.follows.create({
      data: { followerId: user.id, followingId: target.id },
    });

    const res = await request(app).get("/api/profile/active/following");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].username).toBe("target");
  });

  it("returns empty array when user follows nobody", async () => {
    await createTestUser({ username: "hermit" });

    const res = await request(app).get("/api/profile/hermit/following");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  it("returns 404 for non-existent username", async () => {
    const res = await request(app).get("/api/profile/nobody/following");
    expect(res.status).toBe(404);
  });
});