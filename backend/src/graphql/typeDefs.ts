import path from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
const schemaRoots = [__dirname, path.resolve(__dirname, '../../src/graphql')];

let types: any[] = [];
let sharedValue: any[] = [];

for (const root of schemaRoots) {
  const loadedTypes = loadFilesSync(
    path.join(root, './modules/**/*.graphql'),
  ) as any[];
  const loadedShared = loadFilesSync(
    path.join(root, './schema.graphql'),
  ) as any[];

  if (loadedTypes.length > 0 && loadedShared.length > 0) {
    types = loadedTypes;
    sharedValue = loadedShared;
    break;
  }
}

if (types.length === 0 || sharedValue.length === 0) {
  throw new Error(
    'GraphQL schema files were not found in src/graphql or dist/graphql.',
  );
}

const mergedTypeDefs = mergeTypeDefs([...types, ...sharedValue]);

export { mergedTypeDefs };
