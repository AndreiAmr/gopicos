import path, { dirname } from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const types = loadFilesSync(path.join(__dirname, './modules/**/*.graphql'));
const sharedValue = loadFilesSync(path.join(__dirname, './schema.graphql'));

const mergedTypeDefs = mergeTypeDefs([...types, ...sharedValue]);

export { mergedTypeDefs };
