import bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { passwordResetCodeRepository } from '../../../database/repositories/PasswordResetCode';
import { userRepository } from '../../../database/repositories/User';
import { AppError } from '../../../utils/AppError';
import { getEmailService } from '../../email';
import { DEFAULT_CODE_EXPIRATION_MINUTES } from '../../email/templates';

export const RESET_CODE_MAX_ATTEMPTS = 5;
/** Intervalo mínimo entre envios de código para a mesma conta (regra de reenvio da spec). */
export const RESET_CODE_RESEND_SECONDS = 30;

const generateCode = () => String(randomInt(0, 1_000_000)).padStart(6, '0');

const invalidResetCode = () =>
  new AppError({
    type: 'INVALID_RESET_CODE',
    message: 'Código inválido ou expirado.',
    statusCode: 400,
    field: 'code',
  });

/**
 * Gera e envia o código. Nunca revela se a conta existe: o chamador recebe a mesma
 * resposta em todos os casos (conta inexistente, reenvio antes de 30 s, falha no envio).
 */
export const requestPasswordResetService = async (
  email: string,
): Promise<void> => {
  const user = await userRepository.find({ email });

  if (!user) return;

  const now = Date.now();
  const latest = await passwordResetCodeRepository.findLatest(user.id);

  if (
    latest &&
    now - latest.createdAt.getTime() < RESET_CODE_RESEND_SECONDS * 1000
  ) {
    return;
  }

  const code = generateCode();
  const codeHash = await bcrypt.hash(
    code,
    Number(process.env.BCRYPT_SALTS) || 10,
  );

  await passwordResetCodeRepository.replaceActive({
    userId: user.id,
    codeHash,
    expiresAt: new Date(now + DEFAULT_CODE_EXPIRATION_MINUTES * 60 * 1000),
  });

  try {
    await getEmailService().sendPasswordResetCode({
      to: user.email,
      name: user.name,
      code,
      expiresInMinutes: DEFAULT_CODE_EXPIRATION_MINUTES,
    });
  } catch (err) {
    // falha de envio não pode virar erro: diferenciaria contas existentes das inexistentes
    console.error('Falha ao enviar e-mail de recuperação de senha', err);
  }
};

type ResetPasswordServiceProps = {
  email: string;
  code: string;
  hashedPassword: string;
};

export const resetPasswordService = async ({
  email,
  code,
  hashedPassword,
}: ResetPasswordServiceProps): Promise<void> => {
  const user = await userRepository.find({ email });

  if (!user) throw invalidResetCode();

  const active = await passwordResetCodeRepository.findLatestActive(
    user.id,
    new Date(),
  );

  if (!active || active.attempts >= RESET_CODE_MAX_ATTEMPTS) {
    throw invalidResetCode();
  }

  if (!(await bcrypt.compare(code, active.codeHash))) {
    const attempts = await passwordResetCodeRepository.registerFailedAttempt(
      active.id,
    );

    if (attempts >= RESET_CODE_MAX_ATTEMPTS) {
      await passwordResetCodeRepository.invalidate(active.id);
    }

    throw invalidResetCode();
  }

  const done = await passwordResetCodeRepository.consumeAndSetPassword({
    codeId: active.id,
    userId: user.id,
    hashedPassword,
  });

  if (!done) throw invalidResetCode();
};
