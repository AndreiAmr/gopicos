import { mapSchema, MapperKind, getDirective } from '@graphql-tools/utils';
import { ApolloError } from 'apollo-server-errors';
import {
  GraphQLSchema,
  GraphQLFieldConfig,
  GraphQLFieldResolver,
  defaultFieldResolver,
} from 'graphql';
import { IAuthentication } from '../../models/authentication/authenticationModel';

export type ContextType = {
  auth: IAuthentication;
};

export function authDirectiveTransformer(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (
      fieldConfig: GraphQLFieldConfig<any, ContextType>
    ): GraphQLFieldConfig<any, ContextType> => {
      const directives = getDirective(schema, fieldConfig, 'Authenticated');

      if (directives) {
        const originalResolve: GraphQLFieldResolver<any, ContextType> =
          fieldConfig.resolve ?? defaultFieldResolver;

        fieldConfig.resolve = async (parent, args, context, info) => {
          if (!context.auth) {
            throw new ApolloError(
              'Usuário não autenticado',
              'UNAUTHENTICATED',
              {
                statusCode: 401,
              }
            );
          }
          return originalResolve(parent, args, context, info);
        };
      }

      return fieldConfig;
    },
  });
}
