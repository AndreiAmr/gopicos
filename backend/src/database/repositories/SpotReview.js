import { prisma } from '../../../prisma/prisma';
export class SpotReviewRepository {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new SpotReviewRepository();
        }
        return this.instance;
    }
    async find(id) {
        throw new Error('Method not implemented.');
    }
    update(prop) {
        throw new Error('Method not implemented.');
    }
    delete(prop) {
        throw new Error('Method not implemented.');
    }
    async create(props) {
        const result = await prisma.spotReview.create({
            data: {
                title: props.title,
                description: props.description,
                author: {
                    connect: {
                        id: props.authorId,
                    },
                },
                spot: {
                    connect: {
                        id: props.spotId,
                    },
                },
            },
        });
        return result;
    }
}
export const spotReviewRepository = SpotReviewRepository.getInstance();
