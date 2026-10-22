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

  it('não expõe password nem hash na resposta', async () => {
    const user = await createUser();

    const { data, errors } = await executeAnonymous(LOGIN, {
      props: { email: user.email, password: user.plainPassword },
    });

    expect(errors).toBeUndefined();
    expect(Object.keys(data.login)).not.toContain('password');
    const serialized = JSON.stringify(data);
    expect(serialized).not.toContain(user.plainPassword);
    expect(serialized).not.toContain('$2');
  });

  it('rejeita consulta do campo password no schema', async () => {
    const user = await createUser();

    const { errors } = await executeAnonymous(
      `mutation Login($props: ILoginInput) { login(props: $props) { password } }`,
      { props: { email: user.email, password: user.plainPassword } },
    );

    expect(errors?.[0].message).toMatch(/password/);
  });

  it('responde sem delay artificial', async () => {
    const user = await createUser();

    const start = Date.now();
    await executeAnonymous(LOGIN, {
      props: { email: user.email, password: user.plainPassword },
    });

    expect(Date.now() - start).toBeLessThan(2000);
  });

  it('não escreve a senha em logs', async () => {
    const user = await createUser();
    const spies = (['log', 'info', 'debug', 'warn', 'error'] as const).map((m) =>
      jest.spyOn(console, m).mockImplementation(() => undefined),
    );

    await executeAnonymous(LOGIN, {
      props: { email: user.email, password: user.plainPassword },
    });

    const logged = JSON.stringify(spies.flatMap((s) => s.mock.calls));
    spies.forEach((s) => s.mockRestore());
    expect(logged).not.toContain(user.plainPassword);
  });
});
