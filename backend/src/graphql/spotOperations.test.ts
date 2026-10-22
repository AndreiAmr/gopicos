import { describe, it, before, after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql } from 'graphql';

process.env.JWT_SECRET = 'test-secret';

import { mergedTypeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { authDirectiveTransformer } from './directives/authenticationDirective';
import { buildContext } from './context';
import { isUserActive } from './isUserActive';
import { generateToken } from '../utils/jwt';
import { prisma } from '../prisma/prisma';

// Prisma mockado: estes testes serão migrados para Jest + banco de teste (GP-013).
const db = prisma as any;
const originals = {
  spotCreate: db.spot.create,
  reviewCreate: db.spotReview.create,
  userFind: db.user.findUnique,
};

const calls = { spot: [] as any[], review: [] as any[] };
let users: Record<string, { deactivatedAt: Date | null }> = {};
let schema: ReturnType<typeof authDirectiveTransformer>;

const bearer = (id: string) =>
  `Bearer ${generateToken({ id, email: `${id}@x.com` }).token}`;

const run = async (source: string, authHeader?: string) =>
  graphql({
    schema,
    source,
    contextValue: await buildContext(authHeader, isUserActive),
  });

const errorType = (res: any) => res.errors?.[0].originalError?.type;

const createSpot = `mutation { createSpot(input: { name: "Pico", description: "d", modality: "STREET", isPaid: false, alwaysOpen: true }) { id name } }`;
const createReview = (extra = '') =>
  `mutation { createSpotReview(data: { spotId: "s1", rating: 5, description: "top" ${extra} }) { rating description } }`;

describe('proteção das operações de pico', () => {
  before(() => {
    schema = authDirectiveTransformer(
      makeExecutableSchema({ typeDefs: mergedTypeDefs, resolvers }),
    );
    users = { u1: { deactivatedAt: null }, off: { deactivatedAt: new Date() } };
    db.spot.create = async (args: any) => {
      calls.spot.push(args);
      return { id: 'spot-1', name: args.data.name };
    };
    db.spotReview.create = async (args: any) => {
      calls.review.push(args);
      return { rating: args.data.rating, description: args.data.description };
    };
    db.user.findUnique = async ({ where }: any) => users[where.id] ?? null;
  });

  after(() => {
    db.spot.create = originals.spotCreate;
    db.spotReview.create = originals.reviewCreate;
    db.user.findUnique = originals.userFind;
  });

  afterEach(() => {
    calls.spot.length = 0;
    calls.review.length = 0;
  });

  it('createSpot sem token retorna UNAUTHENTICATED e não grava', async () => {
    const res = await run(createSpot);
    assert.equal(errorType(res), 'UNAUTHENTICATED');
    assert.equal(calls.spot.length, 0);
  });

  it('createSpot salva com authorId igual ao id do token', async () => {
    const res = await run(createSpot, bearer('u1'));
    assert.equal(res.errors, undefined);
    assert.equal((res.data as any)?.createSpot.id, 'spot-1');
    assert.deepEqual(calls.spot[0].data.author, { connect: { id: 'u1' } });
  });

  it('createSpotReview sem token retorna UNAUTHENTICATED e não grava', async () => {
    const res = await run(createReview());
    assert.equal(errorType(res), 'UNAUTHENTICATED');
    assert.equal(calls.review.length, 0);
  });

  it('createSpotReview usa o autor do token', async () => {
    const res = await run(createReview(), bearer('u1'));
    assert.equal(res.errors, undefined);
    assert.deepEqual({ ...(res.data as any)?.createSpotReview }, {
      rating: 5,
      description: 'top',
    });
    assert.deepEqual(calls.review[0].data.author, { connect: { id: 'u1' } });
    assert.deepEqual(calls.review[0].data.spot, { connect: { id: 's1' } });
  });

  it('createSpotReview rejeita authorId vindo no input', async () => {
    const res = await run(createReview(', authorId: "outro"'), bearer('u1'));
    assert.ok(res.errors?.length);
    assert.equal(calls.review.length, 0);
  });

  it('token de usuário desativado é rejeitado', async () => {
    const res = await run(createSpot, bearer('off'));
    assert.equal(errorType(res), 'UNAUTHENTICATED');
    assert.equal(calls.spot.length, 0);
  });

  it('token de usuário inexistente é rejeitado', async () => {
    const res = await run(createSpot, bearer('fantasma'));
    assert.equal(errorType(res), 'UNAUTHENTICATED');
  });
});
