import jwt from 'jsonwebtoken';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql } from 'graphql';

import { buildContext } from './context';
import { authDirectiveTransformer } from './directives/authenticationDirective';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

const validToken = () => generateToken({ id: 'user-1', email: 'a@b.com' }).token;

describe('buildContext', () => {
  it('expõe o id do usuário com token válido', async () => {
    const ctx = await buildContext(`Bearer ${validToken()}`);
    expect(ctx.auth?.id).toBe('user-1');
  });

  it('não autentica sem header', async () => {
    expect(await buildContext(undefined)).toEqual({});
  });

  it('não autentica com token inválido', async () => {
    expect(await buildContext('Bearer lixo')).toEqual({});
  });

  it('não autentica com esquema diferente de Bearer', async () => {
    expect(await buildContext(`Basic ${validToken()}`)).toEqual({});
  });

  it('não autentica com token expirado', async () => {
    const expired = jwt.sign({ id: 'user-1' }, process.env.JWT_SECRET as string, {
      expiresIn: -10,
    });
    expect(await buildContext(`Bearer ${expired}`)).toEqual({});
  });

  it('não autentica com token assinado por outro segredo', async () => {
    const forged = jwt.sign({ id: 'user-1' }, 'outro');
    expect(await buildContext(`Bearer ${forged}`)).toEqual({});
  });

  it('não autentica token sem id', async () => {
    const noId = jwt.sign({ email: 'a@b.com' }, process.env.JWT_SECRET as string);
    expect(await buildContext(`Bearer ${noId}`)).toEqual({});
  });

  it('não autentica quando o usuário está desativado', async () => {
    const ctx = await buildContext(`Bearer ${validToken()}`, async () => false);
    expect(ctx).toEqual({});
  });

  it('gera token com validade de 7 dias', () => {
    const { exp, createdAt } = generateToken({ id: 'x' });
    expect(exp - createdAt).toBe(7 * 24 * 60 * 60);
  });
});

describe('diretiva @Authenticated', () => {
  let schema: ReturnType<typeof authDirectiveTransformer>;

  beforeAll(() => {
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
    expect(res.data?.me).toBe('user-1');
  });

  it('retorna UNAUTHENTICATED 401 sem auth', async () => {
    const res = await graphql({ schema, source: '{ me }', contextValue: {} });
    const err = res.errors?.[0].originalError;
    expect(err).toBeInstanceOf(AppError);
    const appError = err as AppError;
    expect(appError.type).toBe('UNAUTHENTICATED');
    expect(appError.statusCode).toBe(401);
    expect(appError.message).toMatch(/não autenticado/);
  });

  it('não bloqueia campos sem a diretiva', async () => {
    const res = await graphql({ schema, source: '{ open }', contextValue: {} });
    expect(res.data?.open).toBe('ok');
  });
});
