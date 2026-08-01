import { prisma } from '../../../prisma/prisma';
export class SpotRepository {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new SpotRepository();
        }
        return this.instance;
    }
    async find(id) {
        const spot = await prisma.spot.findUnique({
            where: {
                id,
            },
            include: {
                reviews: {
                    include: {
                        author: {
                            omit: {
                                password: true,
                            },
                        },
                        replies: true,
                    },
                },
            },
        });
        return spot;
    }
    update(prop) {
        throw new Error('Method not implemented.');
    }
    delete(prop) {
        throw new Error('Method not implemented.');
    }
    async create(props) {
        const { data, authorId } = props;
        const spotData = {
            name: data.name,
            description: data.description,
            modality: data.modality,
            equipmentRequired: data.equipmentRequired || false,
            isPaid: data.isPaid,
            alwaysOpen: data.alwaysOpen,
            entryAmount: data.entryAmount || '',
            hasCoverage: data.hasCoverage || false,
            coordinates: data.coordinates,
            openingHours: data.openingHours,
            // markingType: data.markingType,
        };
        const result = await prisma.spot.create({
            data: {
                ...spotData,
                author: {
                    connect: {
                        id: authorId,
                    },
                },
            },
        });
        return result;
    }
    async insertImage(spotId, url) {
        const updateSpot = await prisma.spot.update({
            where: {
                id: spotId,
            },
            data: {
                images: {
                    push: url,
                },
            },
        });
        return updateSpot;
    }
    async listAll() {
        const spots = await prisma.spot.findMany();
        return spots;
    }
}
export const spotRepository = SpotRepository.getInstance();
