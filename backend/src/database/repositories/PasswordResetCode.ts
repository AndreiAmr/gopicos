import { PasswordResetCode } from '../../prisma/generated';
import { prisma } from '../../prisma/prisma';

export class PasswordResetCodeRepository {
  /** Código mais recente do usuário, usado ou não (para a trava de reenvio). */
  findLatest(userId: string): Promise<PasswordResetCode | null> {
    return prisma.passwordResetCode.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Código mais recente ainda utilizável: não usado e não expirado. */
  findLatestActive(
    userId: string,
    now: Date,
  ): Promise<PasswordResetCode | null> {
    return prisma.passwordResetCode.findFirst({
      where: { userId, usedAt: null, expiresAt: { gt: now } },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Invalida os códigos anteriores e cria o novo, de forma atômica. */
  replaceActive(data: {
    userId: string;
    codeHash: string;
    expiresAt: Date;
  }): Promise<PasswordResetCode> {
    return prisma.$transaction(async (tx) => {
      await tx.passwordResetCode.updateMany({
        where: { userId: data.userId, usedAt: null },
        data: { usedAt: new Date() },
      });

      return tx.passwordResetCode.create({ data });
    });
  }

  /** Soma uma tentativa errada de forma atômica e devolve o total. */
  async registerFailedAttempt(id: string): Promise<number> {
    const updated = await prisma.passwordResetCode.update({
      where: { id },
      data: { attempts: { increment: 1 } },
      select: { attempts: true },
    });

    return updated.attempts;
  }

  async invalidate(id: string): Promise<void> {
    await prisma.passwordResetCode.updateMany({
      where: { id, usedAt: null },
      data: { usedAt: new Date() },
    });
  }

  /**
   * Consome o código (uso único) e grava a nova senha na mesma transação.
   * Devolve false se outro pedido consumiu o código antes.
   */
  consumeAndSetPassword(params: {
    codeId: string;
    userId: string;
    hashedPassword: string;
  }): Promise<boolean> {
    return prisma.$transaction(async (tx) => {
      const consumed = await tx.passwordResetCode.updateMany({
        where: { id: params.codeId, usedAt: null },
        data: { usedAt: new Date() },
      });

      if (consumed.count === 0) return false;

      await tx.user.update({
        where: { id: params.userId },
        data: { password: params.hashedPassword },
      });

      return true;
    });
  }
}

export const passwordResetCodeRepository = new PasswordResetCodeRepository();
