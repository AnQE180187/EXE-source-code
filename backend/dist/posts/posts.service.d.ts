import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '@prisma/client';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPostDto: CreatePostDto, author: User): Promise<{
        tags: {
            tag: {
                id: string;
                name: string;
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
                id: string;
                name: string;
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
                id: string;
                name: string;
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
    update(id: string, updatePostDto: UpdatePostDto, userId: string): Promise<{
        tags: {
            tag: {
                id: string;
                name: string;
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
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
