import bcrypt from 'bcrypt';
import { executeAnonymous } from '../../../../test/graphql';
import { createUser } from '../../../../test/factories';
import { useTestDatabase } from '../../../../test/db';
import { prisma } from '../../../../prisma/prisma';

const SIGNUP = `
  mutation Signup($props: SignupProp!) {
    signup(props: $props) {
      message
    }
  }
`;

const LOGIN = `
  mutation Login($props: ILoginInput) {
    login(props: $props) {
      token
      email
    }
  }
`;

const valid = {
  name: 'Skatista',
  email: 'novo@test.com',
  password: 'senha-forte-123',
};

describe('mutation signup (integração)', () => {
  useTestDatabase();

  it('cria o usuário com senha em hash e devolve só a mensagem de sucesso', async () => {
    const { data, errors } = await executeAnonymous(SIGNUP, { props: valid });

    expect(errors).toBeUndefined();
    expect(data.signup).toEqual({ message: 'Usuário criado com sucesso' });

    const user = await prisma.user.findUnique({ where: { email: valid.email } });
    expect(user?.name).toBe('Skatista');
    expect(user?.password).not.toBe(valid.password);
    expect(await bcrypt.compare(valid.password, user!.password)).toBe(true);
  });

  it('retorna EMAIL_ALREADY_EXISTS (e não erro interno) para e-mail duplicado', async () => {
    const existing = await createUser({ email: 'dup@test.com' });

    const { errors } = await executeAnonymous(SIGNUP, {
      props: { ...valid, email: existing.email },
    });

    expect(errors?.[0].extensions?.type).toBe('EMAIL_ALREADY_EXISTS');
    expect(errors?.[0].extensions?.statusCode).toBe(409);
    expect(errors?.[0].extensions?.field).toBe('email');
    expect(errors?.[0].message).toBe('Este e-mail já tem cadastro.');
    expect(await prisma.user.count()).toBe(1);
  });

  it('trata e-mail sem diferenciar maiúsculas/minúsculas (duplicado e login)', async () => {
    const { errors } = await executeAnonymous(SIGNUP, {
      props: { ...valid, email: '  Misto@Test.COM ' },
    });
    expect(errors).toBeUndefined();

    const stored = await prisma.user.findFirst();
    expect(stored?.email).toBe('misto@test.com');

    const dup = await executeAnonymous(SIGNUP, {
      props: { ...valid, email: 'MISTO@test.com' },
    });
    expect(dup.errors?.[0].extensions?.type).toBe('EMAIL_ALREADY_EXISTS');

    const login = await executeAnonymous(LOGIN, {
      props: { email: 'MISTO@Test.com', password: valid.password },
    });
    expect(login.errors).toBeUndefined();
    expect(login.data.login.email).toBe('misto@test.com');
  });

  it.each([
    ['email', { email: 'sem-arroba' }],
    ['email', { email: '' }],
    ['password', { password: '1234567' }],
    ['password', { password: '' }],
    ['name', { name: '   ' }],
  ])('retorna VALIDATION_ERROR indicando o campo %s', async (field, override) => {
    const { errors } = await executeAnonymous(SIGNUP, {
      props: { ...valid, ...override },
    });

    expect(errors?.[0].extensions?.type).toBe('VALIDATION_ERROR');
    expect(errors?.[0].extensions?.statusCode).toBe(400);
    expect(errors?.[0].extensions?.field).toBe(field);
    expect(await prisma.user.count()).toBe(0);
  });

  it('aceita senha com exatamente 8 caracteres', async () => {
    const { errors } = await executeAnonymous(SIGNUP, {
      props: { ...valid, password: '12345678' },
    });

    expect(errors).toBeUndefined();
  });

  it('rejeita o campo nickname (removido do input) e funciona sem ele', async () => {
    const withNickname = await executeAnonymous(SIGNUP, {
      props: { ...valid, nickname: 'sk8' },
    });

    expect(withNickname.errors).toBeDefined();
    expect(withNickname.data?.signup ?? null).toBeNull();
    expect(await prisma.user.count()).toBe(0);

    const without = await executeAnonymous(SIGNUP, { props: valid });
    expect(without.errors).toBeUndefined();
  });
});
