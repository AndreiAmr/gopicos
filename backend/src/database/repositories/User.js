import { prisma } from '../../../prisma/prisma';
export class UserRepository {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserRepository();
        }
        return this.instance;
    }
    async find(prop) {
        const user = await prisma.user.findUnique({
            where: {
                email: prop.email,
            },
        });
        return user;
    }
    update(prop) {
        throw new Error('Method not implemented.');
    }
    delete(prop) {
        throw new Error('Method not implemented.');
    }
    async create(prop) {
        const result = await prisma.user.create({
            data: prop,
        });
        return result;
    }
}
export const userRepository = UserRepository.getInstance();
