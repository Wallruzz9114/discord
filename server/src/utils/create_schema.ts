import { buildSchema } from 'type-graphql';
import { UserResolver } from './../resolvers/user_resolver';

export const createSchema = () =>
  buildSchema({
    resolvers: [UserResolver],
    validate: false,
  });
