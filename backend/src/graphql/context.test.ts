import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql } from 'graphql';

process.env.JWT_SECRET = 'test-secret';

import { buildContext } from './context';
import { authDirectiveTransformer } from './directives/authenticationDirective';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

const validToken = () => generateToken({ id: 'user-1', email: 'a@b.com' }).token;

describe('buildContext', () => {
  it('expõe o id do usuário com token válido', async () => {
    const ctx = await buildContext(`Bearer ${validToken()}`);
    assert.equal(ctx.auth?.id, 'user-1');
  });

  it('não autentica sem header', async () => {
    assert.deepEqual(await buildContext(undefined), {});
  });

  it('não autentica com token inválido', async () => {
    assert.deepEqual(await buildContext('Bearer lixo'), {});
  });

  it('não autentica com esquema diferente de Bearer', async () => {
    assert.deepEqual(await buildContext(`Basic ${validToken()}`), {});
  });

  it('não autentica com token expirado', async () => {
    const expired = jwt.sign({ id: 'user-1' }, 'test-secret', {
      expiresIn: -10,
    });
    assert.deepEqual(await buildContext(`Bearer ${expired}`), {});
  });

  it('não autentica com token assinado por outro segredo', async () => {
    const forged = jwt.sign({ id: 'user-1' }, 'outro');
    assert.deepEqual(await buildContext(`Bearer ${forged}`), {});
  });

  it('não autentica token sem id', async () => {
    const noId = jwt.sign({ email: 'a@b.com' }, 'test-secret');
    assert.deepEqual(await buildContext(`Bearer ${noId}`), {});
  });

  it('não autentica quando o usuário está desativado', async () => {
    const ctx = await buildContext(`Bearer ${validToken()}`, async () => false);
    assert.deepEqual(ctx, {});
  });

  it('gera token com validade de 7 dias', () => {
    const { exp, createdAt } = generateToken({ id: 'x' });
    assert.equal(exp - createdAt, 7 * 24 * 60 * 60);
  });
});

describe('diretiva @Authenticated', () => {
  let schema: ReturnType<typeof authDirectiveTransformer>;

  before(() => {
    schema = authDirectiveTransformer(
      makeExecutableSchema({
        typeDefs: `
          directive @Authenticated on FIELD_DEFINITION
          type Query { me: String @Authenticated, open: String }
        `,
        resolvers: {
          Query: { me: (_: any, __: any, ctx: any) => ctx.auth.id, open: () => 'ok' },
        },
      }),
    );
  });

  it('permite com auth no contexto', async () => {
    const res = await graphql({
      schema,
      source: '{ me }',
      contextValue: await buildContext(`Bearer ${validToken()}`),
    });
    assert.equal(res.data?.me, 'user-1');
  });

  it('retorna UNAUTHENTICATED 401 sem auth', async () => {
    const res = await graphql({ schema, source: '{ me }', contextValue: {} });
    const err = res.errors?.[0].originalError;
    assert.ok(err instanceof AppError);
    assert.equal(err.type, 'UNAUTHENTICATED');
    assert.equal(err.statusCode, 401);
    assert.match(err.message, /não autenticado/);
  });

  it('não bloqueia campos sem a diretiva', async () => {
    const res = await graphql({ schema, source: '{ open }', contextValue: {} });
    assert.equal(res.data?.open, 'ok');
  });
});
