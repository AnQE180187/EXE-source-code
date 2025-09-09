import { FavoritesService } from './favorites.service';
import { Request } from 'express';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    toggle(eventId: string, req: Request): Promise<{
        favorited: boolean;
    }>;
}
