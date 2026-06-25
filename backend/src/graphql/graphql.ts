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
import { AppError } from '../utils/AppError';

async function startServer() {
  const app = express();

  const executableSchema = makeExecutableSchema({
    typeDefs: mergedTypeDefs,
    resolvers,
  });

  const schema = authDirectiveTransformer(executableSchema);

  const server = new ApolloServer({
    schema,
    formatError: (formattedError, error) => {
      const originalError = error.originalError;

      if (originalError instanceof AppError) {
        console.log('🚀 ~ formatError ~ originalError:', originalError);

        return {
          message: originalError.message,
          type: originalError.type,
          statusCode: originalError.statusCode,
        };
      }

      return {
        message: formattedError.message,
        extensions: {
          type: 'INTERNAL_ERROR',
          statusCode: 500,
        },
      };
    },
  });

  await server.start();

  app.use(
    cors({
      origin: '*',
      // methods: ['GET', 'POST', 'OPTIONS'],
      // allowedHeaders: ['Content-Type', 'Authorization'],
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

        if (!token) return {};

        const [_, tokenValue] = token.split(' ');

        const data = getTokenData(tokenValue);

        if (!data) return {};

        return {
          auth: new AuthenticationModel(data as IAuthentication),
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
