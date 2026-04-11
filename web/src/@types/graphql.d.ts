type GraphQLErrorExtensions = {
  code: string;
  statusCode: number;
};

type GraphQLError = {
  extensions?: GraphQLErrorExtensions;
};
