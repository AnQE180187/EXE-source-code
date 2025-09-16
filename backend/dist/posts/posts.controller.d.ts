import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request } from 'express';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, req: Request): Promise<{
        tags: {
            tag: {
                name: string;
                id: string;
            };
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.VisibilityStatus;
        updatedAt: Date;
        title: string;
        content: string;
        authorId: string;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        tags: {
            tag: {
                name: string;
                id: string;
            };
        }[];
        author: {
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.VisibilityStatus;
        updatedAt: Date;
        title: string;
        content: string;
        authorId: string;
    })[]>;
    findOne(id: string): Promise<{
        tags: {
            tag: {
                name: string;
                id: string;
            };
        }[];
        author: {
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.VisibilityStatus;
        updatedAt: Date;
        title: string;
        content: string;
        authorId: string;
    }>;
    update(id: string, updatePostDto: UpdatePostDto, req: Request): Promise<{
        tags: {
            tag: {
                name: string;
                id: string;
            };
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.VisibilityStatus;
        updatedAt: Date;
        title: string;
        content: string;
        authorId: string;
    }>;
    remove(id: string, req: Request): Promise<{
        message: string;
    }>;
}
