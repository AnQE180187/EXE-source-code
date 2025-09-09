import { PrismaService } from 'src/prisma/prisma.service';
export declare class FavoritesService {
    private prisma;
    constructor(prisma: PrismaService);
    toggleFavorite(eventId: string, userId: string): Promise<{
        favorited: boolean;
    }>;
}
