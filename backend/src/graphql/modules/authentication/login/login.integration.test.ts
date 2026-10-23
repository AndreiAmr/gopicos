import { executeAnonymous } from '../../../../test/graphql';
import { createUser } from '../../../../test/factories';
import { prisma } from '../../../../test/db';
import { useTestDatabase } from '../../../../test/db';

const LOGIN = `
  mutation Login($props: ILoginInput) {
    login(props: $props) {
      token
      id
      email
      name
      firstName
      lastName
      exp
      reactivated
    }
  }
`;

describe('mutation login (integração)', () => {
  useTestDatabase();

  it('retorna token e dados do usuário com credenciais válidas', async () => {
    const user = await createUser({ firstName: 'Tony', lastName: 'Hawk', email: 'skate@test.com' });

    const { data, errors } = await executeAnonymous(LOGIN, {
      props: { email: user.email, password: user.plainPassword },
    });

    expect(errors).toBeUndefined();
    expect(data.login.id).toBe(user.id);
    expect(data.login.email).toBe('skate@test.com');
    expect(data.login.name).toBe('Tony Hawk');
    expect(data.login.firstName).toBe('Tony');
    expect(data.login.lastName).toBe('Hawk');
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

  it('retorna a mesma mensagem INVALID_CREDENTIALS para e-mail inexistente e senha errada', async () => {
    const user = await createUser();

    const wrongPassword = await executeAnonymous(LOGIN, {
      props: { email: user.email, password: 'senha-errada' },
    });
    const unknownEmail = await executeAnonymous(LOGIN, {
      props: { email: 'ninguem@test.com', password: 'qualquer' },
    });

    expect(unknownEmail.errors?.[0].extensions?.type).toBe('INVALID_CREDENTIALS');
    expect(unknownEmail.errors?.[0].extensions?.statusCode).toBe(401);
    expect(unknownEmail.errors?.[0].message).toBe(
      wrongPassword.errors?.[0].message,
    );
  });

  it('retorna exp ~7 dias à frente e reactivated false', async () => {
    const user = await createUser();

    const { data } = await executeAnonymous(LOGIN, {
      props: { email: user.email, password: user.plainPassword },
    });

    const now = Math.floor(Date.now() / 1000);
    expect(data.login.reactivated).toBe(false);
    expect(Math.abs(data.login.exp - (now + 7 * 24 * 3600))).toBeLessThan(10);
  });

  it('reativa conta desativada com senha correta e retorna reactivated true', async () => {
    const user = await createUser();
    await prisma.user.update({
      where: { id: user.id },
      data: { deactivatedAt: new Date() },
    });

    const { data, errors } = await executeAnonymous(LOGIN, {
      props: { email: user.email, password: user.plainPassword },
    });

    expect(errors).toBeUndefined();
    expect(data.login.reactivated).toBe(true);
    const after = await prisma.user.findUnique({ where: { id: user.id } });
    expect(after?.deactivatedAt).toBeNull();
  });

  it('não reativa conta desativada com senha errada', async () => {
    const user = await createUser();
    await prisma.user.update({
      where: { id: user.id },
      data: { deactivatedAt: new Date() },
    });

    const { errors } = await executeAnonymous(LOGIN, {
      props: { email: user.email, password: 'senha-errada' },
    });

    expect(errors?.[0].extensions?.type).toBe('INVALID_CREDENTIALS');
    const after = await prisma.user.findUnique({ where: { id: user.id } });
    expect(after?.deactivatedAt).not.toBeNull();
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
