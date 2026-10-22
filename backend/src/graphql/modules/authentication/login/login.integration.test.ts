import { executeAnonymous } from '../../../../test/graphql';
import { createUser } from '../../../../test/factories';
import { useTestDatabase } from '../../../../test/db';

const LOGIN = `
  mutation Login($props: ILoginInput) {
    login(props: $props) {
      token
      id
      email
      name
    }
  }
`;

describe('mutation login (integração)', () => {
  useTestDatabase();

  it('retorna token e dados do usuário com credenciais válidas', async () => {
    const user = await createUser({ name: 'Skatista', email: 'skate@test.com' });

    const { data, errors } = await executeAnonymous(LOGIN, {
      props: { email: user.email, password: user.plainPassword },
    });

    expect(errors).toBeUndefined();
    expect(data.login.id).toBe(user.id);
    expect(data.login.email).toBe('skate@test.com');
    expect(data.login.name).toBe('Skatista');
    expect(typeof data.login.token).toBe('string');
  });

  it('retorna INVALID_CREDENTIALS com senha incorreta', async () => {
    const user = await createUser();

    const { data, errors } = await executeAnonymous(LOGIN, {
      props: { email: user.email, password: 'senha-errada' },
    });

    expect(data?.login ?? null).toBeNull();
    expect(errors?.[0].extensions?.type).toBe('INVALID_CREDENTIALS');
    expect(errors?.[0].extensions?.statusCode).toBe(401);
  });

  it('retorna USER_NOT_FOUND para e-mail inexistente', async () => {
    const { errors } = await executeAnonymous(LOGIN, {
      props: { email: 'ninguem@test.com', password: 'qualquer' },
    });

    expect(errors?.[0].extensions?.type).toBe('USER_NOT_FOUND');
    expect(errors?.[0].extensions?.statusCode).toBe(404);
  });
});
