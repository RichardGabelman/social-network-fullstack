import prisma from "../src/db/prisma.js";
import { faker } from "@faker-js/faker";
import "dotenv/config";

const USER_COUNT = 12;
const POSTS_PER_USER = 5;

function randomDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - (Math.floor(Math.random() * daysAgo) + 1));
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
}

async function main() {
  console.log("Seeding...");

  const users = []

  for (let i = 0; i < USER_COUNT; i++) {
    const username = faker.internet.username();
    const user = await prisma.user.create({
      data: {
        username,
        displayName: faker.person.fullName(),
        bio: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.7 }),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      },
    });
    users.push(user);
  }

  console.log(`Created ${users.length} users`);

  for (const user of users) {
    const others = users.filter((u) => u.id !== user.id);
    const toFollow = others.filter(() => Math.random() < 0.4);

    await Promise.all(
      toFollow.map((target) =>
        prisma.follows.create({
          data: {
            followerId: user.id,
            followingId: target.id,
          },
        })
      )
    );
  }

  console.log("Created follow relationships");

  const posts = [];
  for (const user of users) {
    for (let i = 0; i < POSTS_PER_USER; i++) {
      const post = await prisma.post.create({
        data: {
          authorId: user.id,
          content: faker.lorem.sentences({ min: 1, max: 3 }),
          createdAt: randomDate(30),
        },
      });
      posts.push(post);
    }
  }

  console.log(`Created ${posts.length} posts`);

  for (const post of posts) {
    if (Math.random() < 0.3) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      await prisma.post.create({
        data: {
          authorId: randomUser.id,
          content: faker.lorem.sentence(),
          replyToId: post.id,
          createdAt: randomDate(15),
        },
      });
    }
  }

  console.log("Created replies");

  for (const user of users) {
    const tolike = posts.filter(() => Math.random() < 0.2);
    await Promise.all(
      tolike.map((post) =>
        prisma.like.create({
          data: {
            userId: user.id,
            postId: post.id,
          },
        })
      )
    );
  }

  console.log("Created likes");
  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());