import http from 'http';
import { createApolloServer } from './server';
import { buildContext } from './context';
import express from 'express';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@as-integrations/express4';
import cors from 'cors';

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

  const server = createApolloServer();

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
      context: async (props) =>
        buildContext(props.req.headers['authorization']),
    }),
  );

  const httpServer = http.createServer(app);

  httpServer.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(`🚀 Server is running on port ${process.env.PORT || 4000}`);
  });
}

startServer();
