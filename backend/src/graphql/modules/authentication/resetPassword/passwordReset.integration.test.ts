import bcrypt from 'bcrypt';
import { executeAnonymous } from '../../../../test/graphql';
import { createUser } from '../../../../test/factories';
import { useTestDatabase, prisma } from '../../../../test/db';

// Nunca envia e-mail real: captura os códigos que seriam enviados.
const sentCodes: { to: string; code: string }[] = [];
const mockSend = jest.fn(async (p: { to: string; code: string }) => {
  sentCodes.push({ to: p.to, code: p.code });
});

jest.mock('../../../../services/email', () => ({
  getEmailService: () => ({ sendPasswordResetCode: mockSend }),
}));

const REQUEST = `
  mutation Request($email: String!) {
    requestPasswordReset(email: $email) { message }
  }
`;

const RESET = `
  mutation Reset($props: ResetPasswordProp!) {
    resetPassword(props: $props) { message }
  }
`;

const LOGIN = `
  mutation Login($props: ILoginInput) {
    login(props: $props) { token }
  }
`;

const NEW_PASSWORD = 'nova-senha-123';

/** Recua a criação do código para liberar um novo pedido (trava de 30 s). */
const ageCodes = (seconds: number) =>
  prisma.passwordResetCode.updateMany({
    data: { createdAt: new Date(Date.now() - seconds * 1000) },
  });

const lastCode = () => sentCodes[sentCodes.length - 1].code;

const reset = (email: string, code: string, newPassword = NEW_PASSWORD) =>
  executeAnonymous(RESET, { props: { email, code, newPassword } });

describe('recuperação de senha (integração)', () => {
  useTestDatabase();

  beforeEach(() => {
    sentCodes.length = 0;
    mockSend.mockClear();
  });

  describe('requestPasswordReset', () => {
    it('envia código de 6 dígitos, guarda só o hash e expira em 15 min', async () => {
      const user = await createUser({ email: 'skate@test.com' });

      const { data, errors } = await executeAnonymous(REQUEST, {
        email: 'Skate@Test.com',
      });

      expect(errors).toBeUndefined();
      expect(sentCodes).toHaveLength(1);
      expect(sentCodes[0].to).toBe('skate@test.com');
      expect(sentCodes[0].code).toMatch(/^\d{6}$/);

      const stored = await prisma.passwordResetCode.findMany({
        where: { userId: user.id },
      });
      expect(stored).toHaveLength(1);
      expect(stored[0].codeHash).not.toBe(sentCodes[0].code);
      expect(await bcrypt.compare(sentCodes[0].code, stored[0].codeHash)).toBe(
        true,
      );
      const ttl = stored[0].expiresAt.getTime() - stored[0].createdAt.getTime();
      expect(Math.round(ttl / 60000)).toBe(15);
      expect(data.requestPasswordReset.message).toBeTruthy();
    });

    it('responde igual para e-mail inexistente e não envia nada', async () => {
      await createUser({ email: 'existe@test.com' });

      const exists = await executeAnonymous(REQUEST, {
        email: 'existe@test.com',
      });
      const missing = await executeAnonymous(REQUEST, {
        email: 'nao-existe@test.com',
      });

      expect(missing.errors).toBeUndefined();
      expect(missing.data).toEqual(exists.data);
      expect(sentCodes).toHaveLength(1);
      expect(await prisma.passwordResetCode.count()).toBe(1);
    });

    it('rejeita e-mail vazio ou malformado com VALIDATION_ERROR', async () => {
      const { errors } = await executeAnonymous(REQUEST, { email: 'abc' });

      expect(errors?.[0].extensions?.type).toBe('VALIDATION_ERROR');
      expect(errors?.[0].extensions?.field).toBe('email');
    });

    it('um novo pedido invalida os códigos anteriores', async () => {
      const user = await createUser();
      await executeAnonymous(REQUEST, { email: user.email });
      const first = lastCode();
      await ageCodes(31);
      await executeAnonymous(REQUEST, { email: user.email });
      const second = lastCode();

      expect(sentCodes).toHaveLength(2);

      const old = await reset(user.email, first);
      expect(old.errors?.[0].extensions?.type).toBe('INVALID_RESET_CODE');

      const fresh = await reset(user.email, second);
      expect(fresh.errors).toBeUndefined();
    });

    it('não reenvia antes de 30 s, mas responde com o mesmo sucesso', async () => {
      const user = await createUser();
      const a = await executeAnonymous(REQUEST, { email: user.email });
      const b = await executeAnonymous(REQUEST, { email: user.email });

      expect(b.errors).toBeUndefined();
      expect(b.data).toEqual(a.data);
      expect(sentCodes).toHaveLength(1);

      await ageCodes(31);
      await executeAnonymous(REQUEST, { email: user.email });
      expect(sentCodes).toHaveLength(2);
    });

    it('falha no envio do e-mail não vira erro (não revela a conta)', async () => {
      const user = await createUser();
      mockSend.mockRejectedValueOnce(new Error('provedor fora do ar'));
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const { errors } = await executeAnonymous(REQUEST, { email: user.email });

      expect(errors).toBeUndefined();
      spy.mockRestore();
    });
  });

  describe('resetPassword', () => {
    it('grava a nova senha com hash, invalida o código e permite login', async () => {
      const user = await createUser();
      await executeAnonymous(REQUEST, { email: user.email });
      const code = lastCode();

      const { data, errors } = await reset(user.email, code);

      expect(errors).toBeUndefined();
      expect(data.resetPassword.message).toBe('Senha redefinida com sucesso');

      const updated = await prisma.user.findUnique({ where: { id: user.id } });
      expect(updated!.password).not.toBe(NEW_PASSWORD);
      expect(await bcrypt.compare(NEW_PASSWORD, updated!.password)).toBe(true);

      const stored = await prisma.passwordResetCode.findFirst();
      expect(stored!.usedAt).not.toBeNull();

      const login = await executeAnonymous(LOGIN, {
        props: { email: user.email, password: NEW_PASSWORD },
      });
      expect(login.errors).toBeUndefined();
      expect(login.data.login.token).toBeTruthy();

      const oldLogin = await executeAnonymous(LOGIN, {
        props: { email: user.email, password: user.plainPassword },
      });
      expect(oldLogin.errors).toBeDefined();
    });

    it('código é de uso único', async () => {
      const user = await createUser();
      await executeAnonymous(REQUEST, { email: user.email });
      const code = lastCode();

      await reset(user.email, code);
      const again = await reset(user.email, code, 'outra-senha-456');

      expect(again.errors?.[0].extensions?.type).toBe('INVALID_RESET_CODE');
      const updated = await prisma.user.findUnique({ where: { id: user.id } });
      expect(await bcrypt.compare(NEW_PASSWORD, updated!.password)).toBe(true);
    });

    it('código errado devolve INVALID_RESET_CODE e nada muda', async () => {
      const user = await createUser();
      await executeAnonymous(REQUEST, { email: user.email });
      const wrong = lastCode() === '000000' ? '111111' : '000000';

      const { errors } = await reset(user.email, wrong);

      expect(errors?.[0].extensions?.type).toBe('INVALID_RESET_CODE');
      expect(errors?.[0].extensions?.statusCode).toBe(400);
      const same = await prisma.user.findUnique({ where: { id: user.id } });
      expect(same!.password).toBe(user.password);
    });

    it('código expirado devolve INVALID_RESET_CODE', async () => {
      const user = await createUser();
      await executeAnonymous(REQUEST, { email: user.email });
      await prisma.passwordResetCode.updateMany({
        data: { expiresAt: new Date(Date.now() - 1000) },
      });

      const { errors } = await reset(user.email, lastCode());

      expect(errors?.[0].extensions?.type).toBe('INVALID_RESET_CODE');
    });

    it('e-mail inexistente devolve o mesmo INVALID_RESET_CODE', async () => {
      const { errors } = await reset('ninguem@test.com', '123456');

      expect(errors?.[0].extensions?.type).toBe('INVALID_RESET_CODE');
      expect(errors?.[0].message).toBe('Código inválido ou expirado.');
    });

    it('5 tentativas erradas invalidam o código, mesmo com o código certo depois', async () => {
      const user = await createUser();
      await executeAnonymous(REQUEST, { email: user.email });
      const correct = lastCode();
      const wrong = correct === '000000' ? '111111' : '000000';

      for (let i = 0; i < 5; i++) {
        const { errors } = await reset(user.email, wrong);
        expect(errors?.[0].extensions?.type).toBe('INVALID_RESET_CODE');
      }

      const stored = await prisma.passwordResetCode.findFirst();
      expect(stored!.usedAt).not.toBeNull();

      const afterwards = await reset(user.email, correct);
      expect(afterwards.errors?.[0].extensions?.type).toBe(
        'INVALID_RESET_CODE',
      );

      // é preciso solicitar outro código
      await ageCodes(31);
      await executeAnonymous(REQUEST, { email: user.email });
      const ok = await reset(user.email, lastCode());
      expect(ok.errors).toBeUndefined();
    });

    it('4 erros seguidos do código certo ainda funcionam', async () => {
      const user = await createUser();
      await executeAnonymous(REQUEST, { email: user.email });
      const correct = lastCode();
      const wrong = correct === '000000' ? '111111' : '000000';

      for (let i = 0; i < 4; i++) await reset(user.email, wrong);

      const ok = await reset(user.email, correct);
      expect(ok.errors).toBeUndefined();
    });

    it('rejeita senha com menos de 8 caracteres sem consumir o código', async () => {
      const user = await createUser();
      await executeAnonymous(REQUEST, { email: user.email });

      const { errors } = await reset(user.email, lastCode(), 'curta');

      expect(errors?.[0].extensions?.type).toBe('VALIDATION_ERROR');
      expect(errors?.[0].extensions?.field).toBe('newPassword');
      const stored = await prisma.passwordResetCode.findFirst();
      expect(stored!.usedAt).toBeNull();
    });

    it('conta desativada: altera a senha e mantém deactivatedAt (reativa no login, GP-021)', async () => {
      const user = await createUser();
      const deactivatedAt = new Date('2026-01-01T00:00:00Z');
      await prisma.user.update({
        where: { id: user.id },
        data: { deactivatedAt },
      });
      await executeAnonymous(REQUEST, { email: user.email });

      const { errors } = await reset(user.email, lastCode());

      expect(errors).toBeUndefined();
      const updated = await prisma.user.findUnique({ where: { id: user.id } });
      expect(await bcrypt.compare(NEW_PASSWORD, updated!.password)).toBe(true);
      expect(updated!.deactivatedAt).toEqual(deactivatedAt);
    });
  });
});
