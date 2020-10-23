import "reflect-metadata"
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import microConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();
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
	context: () => ({em: orm.em})
  });

  apolloServer.applyMiddleware({ app });
  // await orm.em.persistAndFlush(post)
  // const posts = await orm.em.find(Post, {});
};

main().catch((err) => {
  console.error(err);
});
