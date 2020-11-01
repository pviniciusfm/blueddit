import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { sendEmail } from "./utils/sendEmail";

const main = async () => {
  sendEmail("fred@foo.com", "That's a test from nodemailer");
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis()

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 3600 * 24 * 365 * 1, // 1 year
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
      },
      secret: "changemetoaenvvar",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.listen(4000, () => {
    console.log("Blueddit is live on localhost:4000");
  });

  app.get("/", (_, res) => {
    res.send("Hello");
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
};

main().catch((err) => {
  console.error(err);
});
