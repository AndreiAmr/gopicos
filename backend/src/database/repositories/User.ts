import { IRepository } from '../..';
import { User } from '../../prisma/generated';
import { prisma } from '../../prisma/prisma';
import { normalizeEmail } from '../../utils/email';

type WithIdProp = {
  id: string;
};

type WithEmailProp = {
  email: string;
};

type IUpdateUser = Partial<User>;

type IUserRepository = IRepository<
  WithEmailProp,
  User,
  IUpdateUser,
  WithIdProp
>;

export class UserRepository implements IUserRepository {
  private static instance: UserRepository | undefined;

  private constructor() {}

  public static getInstance(): UserRepository {
    if (!this.instance) {
      this.instance = new UserRepository();
    }

    return this.instance;
  }

  async find(prop: WithEmailProp): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email: normalizeEmail(prop.email),
      },
    });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  /** Quantidade de picos e de avaliações do usuário (D35). */
  async countActivity(
    id: string,
  ): Promise<{ spotsCount: number; reviewsCount: number }> {
    const [spotsCount, reviewsCount] = await Promise.all([
      prisma.spot.count({ where: { authorId: id } }),
      prisma.spotReview.count({ where: { authorId: id } }),
    ]);

    return { spotsCount, reviewsCount };
  }

  /** Usuário existe e não está desativado (deactivatedAt nulo). */
  async isActive(id: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { deactivatedAt: true },
    });

    return !!user && user.deactivatedAt === null;
  }

  /** Reativa uma conta desativada (login após GP-073). */
  async reactivate(prop: WithIdProp): Promise<void> {
    await prisma.user.update({
      where: { id: prop.id },
      data: { deactivatedAt: null },
    });
  }

  /** Atualiza campos do próprio usuário (nome, sobrenome, senha). */
  async updateById(
    id: string,
    data: Partial<Pick<User, 'firstName' | 'lastName' | 'password'>>,
  ): Promise<void> {
    await prisma.user.update({ where: { id }, data });
  }

  update(prop: IUpdateUser): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(prop: WithIdProp): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async create(prop: User): Promise<User> {
    const result = await prisma.user.create({
      data: prop,
    });

    return result;
  }
}

export const userRepository = UserRepository.getInstance();
