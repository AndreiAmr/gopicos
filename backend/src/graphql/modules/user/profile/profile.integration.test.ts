import {
  executeAnonymous,
  executeAuthenticated,
} from '../../../../test/graphql';
import { createUser, tokenFor } from '../../../../test/factories';
import { prisma, useTestDatabase } from '../../../../test/db';

const ME = `query { me { id name firstName lastName email createdAt } }`;
const GET_PROFILE = `query { getProfile { id name firstName lastName email createdAt } }`;

describe('query me / getProfile (integração)', () => {
  useTestDatabase();

  it('retorna id, nome, e-mail e data de cadastro do usuário logado', async () => {
    const user = await createUser({
      firstName: 'Tony',
      lastName: 'Hawk',
      email: 'skate@test.com',
    });

    const { data, errors } = await executeAuthenticated(tokenFor(user), ME);

    expect(errors).toBeUndefined();
    expect(data.me).toEqual({
      id: user.id,
      name: 'Tony Hawk',
      firstName: 'Tony',
      lastName: 'Hawk',
      email: 'skate@test.com',
      createdAt: user.createdAt.toISOString(),
    });
  });

  it('getProfile é alias de me', async () => {
    const user = await createUser();

    const { data, errors } = await executeAuthenticated(
      tokenFor(user),
      GET_PROFILE,
    );

    expect(errors).toBeUndefined();
    expect(data.getProfile.id).toBe(user.id);
  });

  it('retorna o perfil do dono do token, não de outro usuário', async () => {
    await createUser();
    const user = await createUser();

    const { data } = await executeAuthenticated(tokenFor(user), ME);

    expect(data.me.id).toBe(user.id);
  });

  it('nunca expõe a senha', async () => {
    const user = await createUser();

    const { data } = await executeAuthenticated(tokenFor(user), ME);
    expect(JSON.stringify(data)).not.toContain('$2');

    const { errors } = await executeAuthenticated(
      tokenFor(user),
      `query { me { password } }`,
    );
    expect(errors?.[0].message).toMatch(/password/);
  });

  it('retorna UNAUTHENTICATED sem token', async () => {
    const { errors } = await executeAnonymous(ME);

    expect(errors?.[0].extensions?.type).toBe('UNAUTHENTICATED');
    expect(errors?.[0].extensions?.statusCode).toBe(401);
  });

  it('retorna UNAUTHENTICATED com token inválido', async () => {
    const { errors } = await executeAuthenticated('token-invalido', ME);

    expect(errors?.[0].extensions?.type).toBe('UNAUTHENTICATED');
  });

  it('retorna UNAUTHENTICATED para usuário desativado', async () => {
    const user = await createUser();
    await prisma.user.update({
      where: { id: user.id },
      data: { deactivatedAt: new Date() },
    });

    const { errors } = await executeAuthenticated(tokenFor(user), ME);

    expect(errors?.[0].extensions?.type).toBe('UNAUTHENTICATED');
  });
});
