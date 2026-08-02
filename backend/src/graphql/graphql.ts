import { ApolloServer } from '@apollo/server';
import http from 'http';
import { mergedTypeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { makeExecutableSchema } from 'graphql-tools';
import { authDirectiveTransformer } from './directives/authenticationDirective';
import { getTokenData } from '../utils/jwt';
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

  const importEsm = new Function('modulePath', 'return import(modulePath)') as (
    modulePath: string,
  ) => Promise<{
    default: (opts: { maxFileSize: number; maxFiles: number }) => any;
  }>;

  const { default: graphqlUploadExpress } = await importEsm(
    'graphql-upload/graphqlUploadExpress.mjs',
  );

  const executableSchema = makeExecutableSchema({
    typeDefs: mergedTypeDefs,
    resolvers,
  });

  const schema = authDirectiveTransformer(executableSchema);

  const server = new ApolloServer({
    schema,
    formatError: (formattedError, error: any) => {
      const originalError = error?.originalError;

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

  httpServer.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(`🚀 Server is running on port ${process.env.PORT || 4000}`);
  });
}

startServer();
