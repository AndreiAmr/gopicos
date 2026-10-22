import {
  executeAnonymous,
  executeAuthenticated,
} from '../../../../test/graphql';
import {
  DEFAULT_PASSWORD,
  createSpot,
  createSpotReview,
  createUser,
  tokenFor,
} from '../../../../test/factories';
import { prisma, useTestDatabase } from '../../../../test/db';

const DELETE = `mutation ($props: DeleteAccountInput!) {
  deleteAccount(props: $props) { message }
}`;
const ME = `query { me { id } }`;
const LOGIN = `mutation ($props: ILoginInput) { login(props: $props) { token reactivated } }`;

describe('mutation deleteAccount (integração)', () => {
  useTestDatabase();

  it('desativa a conta sem apagar picos e avaliações', async () => {
    const user = await createUser();
    const spot = await createSpot({ authorId: user.id });
    await createSpotReview({ authorId: user.id });
    const token = tokenFor(user);

    const { errors } = await executeAuthenticated(token, DELETE, {
      props: { password: DEFAULT_PASSWORD },
    });

    expect(errors).toBeUndefined();
    const saved = await prisma.user.findUnique({ where: { id: user.id } });
    expect(saved?.deactivatedAt).not.toBeNull();
    expect(await prisma.spot.findUnique({ where: { id: spot.id } })).not.toBeNull();
    expect(await prisma.spotReview.count({ where: { authorId: user.id } })).toBe(1);
  });

  it('o token atual deixa de valer (UNAUTHENTICATED)', async () => {
    const user = await createUser();
    const token = tokenFor(user);

    await executeAuthenticated(token, DELETE, {
      props: { password: DEFAULT_PASSWORD },
    });

    const { errors } = await executeAuthenticated(token, ME);
    expect(errors?.[0].extensions?.type).toBe('UNAUTHENTICATED');
  });

  it('entrar de novo reativa a conta', async () => {
    const user = await createUser();
    await executeAuthenticated(tokenFor(user), DELETE, {
      props: { password: DEFAULT_PASSWORD },
    });

    const { data } = await executeAnonymous(LOGIN, {
      props: { email: user.email, password: DEFAULT_PASSWORD },
    });

    expect(data.login.reactivated).toBe(true);
    const saved = await prisma.user.findUnique({ where: { id: user.id } });
    expect(saved?.deactivatedAt).toBeNull();
  });

  it('senha incorreta: INVALID_CREDENTIALS e nada muda', async () => {
    const user = await createUser();

    const { errors } = await executeAuthenticated(tokenFor(user), DELETE, {
      props: { password: 'errada1234' },
    });

    expect(errors?.[0].extensions?.type).toBe('INVALID_CREDENTIALS');
    const saved = await prisma.user.findUnique({ where: { id: user.id } });
    expect(saved?.deactivatedAt).toBeNull();
  });

  it('senha vazia: VALIDATION_ERROR', async () => {
    const user = await createUser();

    const { errors } = await executeAuthenticated(tokenFor(user), DELETE, {
      props: { password: '' },
    });

    expect(errors?.[0].extensions?.type).toBe('VALIDATION_ERROR');
    expect(errors?.[0].extensions?.field).toBe('password');
  });

  it('só desativa o dono do token', async () => {
    const user = await createUser();
    const other = await createUser();

    await executeAuthenticated(tokenFor(user), DELETE, {
      props: { password: DEFAULT_PASSWORD },
    });

    const saved = await prisma.user.findUnique({ where: { id: other.id } });
    expect(saved?.deactivatedAt).toBeNull();
  });

  it('retorna UNAUTHENTICATED sem token', async () => {
    const { errors } = await executeAnonymous(DELETE, {
      props: { password: 'x' },
    });

    expect(errors?.[0].extensions?.type).toBe('UNAUTHENTICATED');
  });
});
