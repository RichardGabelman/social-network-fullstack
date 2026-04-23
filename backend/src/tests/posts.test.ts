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

describe("POST /api/posts", () => {
  it("creates a post when authenticated", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);

    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Hello world" });

    expect(res.status).toBe(201);
    expect(res.body.content).toBe("Hello world");
    expect(res.body.author.id).toBe(user.id);
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(app)
      .post("/api/posts")
      .send({ content: "Hello world" });

    expect(res.status).toBe(401);
  });

  it("returns 400 when content is empty", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);

    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "" });

    expect(res.status).toBe(400);
  });

  it("returns 400 when content exceeds 500 characters", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);

    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "a".repeat(501) });

    expect(res.status).toBe(400);
  });

  it("creates a reply when replyToId is valid", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);

    const parent = await prisma.post.create({
      data: { content: "Parent post", authorId: user.id },
    });

    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "This is a reply", replyToId: parent.id });

    expect(res.status).toBe(201);
    expect(res.body.replyTo.id).toBe(parent.id);
  });

  it("returns 404 when replyToId does not exist", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);

    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Reply to nothing", replyToId: 999999 });

    expect(res.status).toBe(404);
  });
});

describe("GET /api/posts/explore", () => {
  it("returns posts without authentication", async () => {
    const user = await createTestUser();
    await prisma.post.create({ data: { content: "Public post", authorId: user.id } });

    const res = await request(app).get("/api/posts/explore");

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("isLiked", false);
  });

  it("returns isLiked=true for posts liked by authenticated user", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);

    const post = await prisma.post.create({
      data: { content: "A liked post", authorId: user.id },
    });
    await prisma.like.create({ data: { userId: user.id, postId: post.id } });

    const res = await request(app)
      .get("/api/posts/explore")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    const found = res.body.find((p: any) => p.id === post.id);
    expect(found.isLiked).toBe(true);
  });
});

describe("GET /api/posts/:postId", () => {
  it("returns a post by ID", async () => {
    const user = await createTestUser();
    const post = await prisma.post.create({
      data: { content: "Specific post", authorId: user.id },
    });

    const res = await request(app).get(`/api/posts/${post.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(post.id);
    expect(res.body.content).toBe("Specific post");
  });

  it("returns 404 for a non-existent post", async () => {
    const res = await request(app).get("/api/posts/999999");
    expect(res.status).toBe(404);
  });

  it("returns 400 for a non-integer postId", async () => {
    const res = await request(app).get("/api/posts/not-an-id");
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/posts/:postId", () => {
  it("deletes own post and returns 204", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);
    const post = await prisma.post.create({
      data: { content: "Delete me", authorId: user.id },
    });

    const res = await request(app)
      .delete(`/api/posts/${post.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);

    const deleted = await prisma.post.findUnique({ where: { id: post.id } });
    expect(deleted).toBeNull();
  });

  it("returns 403 when deleting another user's post", async () => {
    const owner = await createTestUser({ username: "owner" });
    const other = await createTestUser({ username: "other" });
    const token = generateToken(other.id);

    const post = await prisma.post.create({
      data: { content: "Not yours", authorId: owner.id },
    });

    const res = await request(app)
      .delete(`/api/posts/${post.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it("returns 401 when not authenticated", async () => {
    const user = await createTestUser();
    const post = await prisma.post.create({
      data: { content: "Protected", authorId: user.id },
    });

    const res = await request(app).delete(`/api/posts/${post.id}`);
    expect(res.status).toBe(401);
  });

  it("marks replies as isReplyToDeleted when parent is deleted", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);

    const parent = await prisma.post.create({
      data: { content: "Parent", authorId: user.id },
    });
    const reply = await prisma.post.create({
      data: { content: "Reply", authorId: user.id, replyToId: parent.id },
    });

    await request(app)
      .delete(`/api/posts/${parent.id}`)
      .set("Authorization", `Bearer ${token}`);

    const updatedReply = await prisma.post.findUnique({ where: { id: reply.id } });
    expect(updatedReply?.isReplyToDeleted).toBe(true);
  });
});

describe("POST /api/posts/:postId/like", () => {
  it("likes a post and returns 201", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);
    const post = await prisma.post.create({
      data: { content: "Like this", authorId: user.id },
    });

    const res = await request(app)
      .post(`/api/posts/${post.id}/like`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(201);
  });

  it("returns 400 when liking a post twice", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);
    const post = await prisma.post.create({
      data: { content: "Like this", authorId: user.id },
    });

    await prisma.like.create({ data: { userId: user.id, postId: post.id } });

    const res = await request(app)
      .post(`/api/posts/${post.id}/like`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  it("returns 404 when liking a non-existent post", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);

    const res = await request(app)
      .post("/api/posts/999999/like")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("returns 401 when not authenticated", async () => {
    const user = await createTestUser();
    const post = await prisma.post.create({
      data: { content: "Like this", authorId: user.id },
    });

    const res = await request(app).post(`/api/posts/${post.id}/like`);
    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/posts/:postId/like", () => {
  it("unlikes a post and returns 204", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);
    const post = await prisma.post.create({
      data: { content: "Liked post", authorId: user.id },
    });
    await prisma.like.create({ data: { userId: user.id, postId: post.id } });

    const res = await request(app)
      .delete(`/api/posts/${post.id}/like`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it("returns 404 when unliking a post that was not liked", async () => {
    const user = await createTestUser();
    const token = generateToken(user.id);
    const post = await prisma.post.create({
      data: { content: "Never liked", authorId: user.id },
    });

    const res = await request(app)
      .delete(`/api/posts/${post.id}/like`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});