import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergedTypeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { authDirectiveTransformer } from './directives/authenticationDirective';
import { AppError } from '../utils/AppError';

export const createSchema = () =>
  authDirectiveTransformer(
    makeExecutableSchema({ typeDefs: mergedTypeDefs, resolvers }),
  );

/** Cria o Apollo Server (sem iniciar HTTP). Reutilizado pelo app e pelos testes. */
export const createApolloServer = () =>
  new ApolloServer({
    schema: createSchema(),
    formatError: (formattedError, error: any) => {
      const originalError = error?.originalError;

      if (originalError instanceof AppError) {
        return {
          message: originalError.message,
          type: originalError.type,
          statusCode: originalError.statusCode,
          extensions: {
            type: originalError.type,
            statusCode: originalError.statusCode,
            ...(originalError.field && { field: originalError.field }),
          },
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
