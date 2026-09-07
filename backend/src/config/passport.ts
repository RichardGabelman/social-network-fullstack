import passport from "passport";
import { Strategy as GithubStrategy, Profile } from "passport-github2";
import prisma from "../db/prisma.js";
import { Strategy as JwtStrategy, VerifiedCallback } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { JwtPayload } from "jsonwebtoken";

if (
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET &&
  process.env.GITHUB_CALLBACK_URL
) {
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: Function,
      ) => {
        try {
          let user = await prisma.user.findUnique({
            where: { githubId: profile.id },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                githubId: profile.id,
                username: profile.username,
                displayName: profile.displayName || profile.username,
                bio: (profile as any).bio || null,
                avatarUrl: profile.photos?.[0]?.value || null,
              },
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );
} else {
  console.warn(
    "GitHub OAuth env vars missing - skipping GitHub strategy registration",
  );
}
if (process.env.JWT_SECRET) {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(jwtOptions, async function (
      jwt_payload: JwtPayload,
      done: VerifiedCallback,
    ) {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: jwt_payload.userId,
          },
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );
} else {
  console.warn("JWT_SECRET missing — skipping JWT strategy registration");
}

export default passport;
