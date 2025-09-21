import { IRepository } from '../..';
import { User } from '../../../prisma/generated';
import { prisma } from '../../../prisma/prisma';

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
        email: prop.email,
      },
    });

    return user;
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
