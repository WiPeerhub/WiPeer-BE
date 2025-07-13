import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";
import redisClient from "./redisClient.js";

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1047349078588-4iuu2bfb0on0ag6rbo8v5amegmc6neoh.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails?.[0]?.value,
            avatar: profile.photos?.[0]?.value,
          });
        }

        await redisClient.set(
          `user:${user._id}`,
          JSON.stringify(user),
          "EX",
          3600
        );

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
