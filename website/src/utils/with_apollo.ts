import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { NextPageContext } from 'next';
import { createWithApollo } from './createWithApollo';
import { isServer } from './is_server';

const client = (ctx: NextPageContext) =>
  new ApolloClient({
    link: createUploadLink({
      uri: 'http://localhost:4000/graphql',
      credentials: 'include',
      headers: {
        cookie: isServer() ? ctx?.req?.headers?.cookie : undefined,
      },
    }) as any,
    cache: new InMemoryCache(),
  });

export const withApollo = createWithApollo(client);
