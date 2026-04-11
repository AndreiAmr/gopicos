import { ApolloServer } from '@apollo/server';
import http from 'http';
import { mergedTypeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { makeExecutableSchema } from 'graphql-tools';
import { authDirectiveTransformer } from './directives/authenticationDirective';
import { getTokenData } from '../utils/jwt';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import express from 'express';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@as-integrations/express4';
import cors from 'cors';
import {
  AuthenticationModel,
  IAuthentication,
} from '../models/authentication/authenticationModel';

async function startServer() {
  const app = express();

  const executableSchema = makeExecutableSchema({
    typeDefs: mergedTypeDefs,
    resolvers,
  });

  const schema = authDirectiveTransformer(executableSchema);

  const server = new ApolloServer({
    schema,
    formatError: (err) => {
      return {
        message: err.message,
        extensions: {
          status: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
          statusCode: err.extensions?.statusCode || 500,
        },
      };
    },
  });

  await server.start();

  app.use(
    cors({
      origin: '*',
    }),
  );

  app.use(express.json());

  app.use(
    graphqlUploadExpress({
      maxFileSize: 10000000,
      maxFiles: 10,
    }),
  );

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async (props) => {
        const token = props.req.headers['authorization'];

        if (!token) {
          return {};
        }

        const [_, tokenValue] = token.split(' ');

        const data = getTokenData(tokenValue);

        if (!data) {
          return {};
        }

        const authModel = new AuthenticationModel(data as IAuthentication);

        return {
          auth: authModel,
        };
      },
    }),
  );

  const httpServer = http.createServer(app);

  httpServer.listen({ port: 4000 }, () => {
    console.log(`🚀 Server is running on port 4000`);
  });
}

startServer();
