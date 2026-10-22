import bcrypt from 'bcrypt';
import {
  executeAnonymous,
  executeAuthenticated,
} from '../../../../test/graphql';
import {
  DEFAULT_PASSWORD,
  createUser,
  tokenFor,
} from '../../../../test/factories';
import { prisma, useTestDatabase } from '../../../../test/db';

const CHANGE = `mutation ($props: ChangePasswordInput!) {
  changePassword(props: $props) { message }
}`;
const ME = `query { me { id } }`;
const LOGIN = `mutation ($props: ILoginInput) { login(props: $props) { token } }`;

const hashOf = async (id: string) =>
  (await prisma.user.findUnique({ where: { id } }))!.password;

describe('mutation changePassword (integração)', () => {
  useTestDatabase();

  it('grava a nova senha com hash e a sessão atual continua válida', async () => {
    const user = await createUser();
    const token = tokenFor(user);

    const { data, errors } = await executeAuthenticated(token, CHANGE, {
      props: { currentPassword: DEFAULT_PASSWORD, newPassword: 'novaSenha123' },
    });

    expect(errors).toBeUndefined();
    expect(data.changePassword.message).toBeTruthy();

    const hash = await hashOf(user.id);
    expect(hash).not.toBe('novaSenha123');
    expect(await bcrypt.compare('novaSenha123', hash)).toBe(true);

    // D33: o token atual segue válido
    const me = await executeAuthenticated(token, ME);
    expect(me.errors).toBeUndefined();

    // e o login passa a valer com a nova senha
    const login = await executeAnonymous(LOGIN, {
      props: { email: user.email, password: 'novaSenha123' },
    });
    expect(login.data.login.token).toBeTruthy();
  });

  it('senha atual incorreta: INVALID_CREDENTIALS e nada muda', async () => {
    const user = await createUser();
    const before = await hashOf(user.id);

    const { errors } = await executeAuthenticated(tokenFor(user), CHANGE, {
      props: { currentPassword: 'errada1234', newPassword: 'novaSenha123' },
    });

    expect(errors?.[0].extensions?.type).toBe('INVALID_CREDENTIALS');
    expect(errors?.[0].extensions?.field).toBe('currentPassword');
    expect(await hashOf(user.id)).toBe(before);
  });

  it('rejeita nova senha curta', async () => {
    const user = await createUser();

    const { errors } = await executeAuthenticated(tokenFor(user), CHANGE, {
      props: { currentPassword: DEFAULT_PASSWORD, newPassword: 'curta' },
    });

    expect(errors?.[0].extensions?.type).toBe('VALIDATION_ERROR');
    expect(errors?.[0].extensions?.field).toBe('newPassword');
  });

  it('rejeita nova senha igual à atual', async () => {
    const user = await createUser();

    const { errors } = await executeAuthenticated(tokenFor(user), CHANGE, {
      props: { currentPassword: DEFAULT_PASSWORD, newPassword: DEFAULT_PASSWORD },
    });

    expect(errors?.[0].extensions?.field).toBe('newPassword');
  });

  it('só altera a senha do dono do token', async () => {
    const user = await createUser();
    const other = await createUser();
    const otherBefore = await hashOf(other.id);

    await executeAuthenticated(tokenFor(user), CHANGE, {
      props: { currentPassword: DEFAULT_PASSWORD, newPassword: 'novaSenha123' },
    });

    expect(await hashOf(other.id)).toBe(otherBefore);
  });

  it('retorna UNAUTHENTICATED sem token', async () => {
    const { errors } = await executeAnonymous(CHANGE, {
      props: { currentPassword: 'x', newPassword: 'novaSenha123' },
    });

    expect(errors?.[0].extensions?.type).toBe('UNAUTHENTICATED');
  });
});
