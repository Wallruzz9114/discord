import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { createSchema } from './utils/create_schema';
import config from './utils/ormconfig';

const main = async () => {
  await createConnection(config);

  const serverPort = process.env.PORT;
  const websitePort = process.env.APP_PORT;
  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();
  const schema = await createSchema();
  const apolloServer = new ApolloServer({
    context: ({ req, res }) => ({ req, res, redis }),
    schema,
  });

  app.use(
    cors({
      origin: `http://localhost:${websitePort}`,
      credentials: true,
    })
  );

  app.use(
    session({
      name: 'cid',
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      },
      secret: process.env.SESSION_SECRET as string,
      saveUninitialized: false,
      resave: false,
    })
  );

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(serverPort, () => {
    console.log(`Listening to port ${serverPort}`);
  });
};

main().catch((error) => {
  console.log(error);
});
