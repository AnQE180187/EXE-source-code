import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '@prisma/client';
export declare class CommentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCommentDto: CreateCommentDto, author: User): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.VisibilityStatus;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
    }>;
    findAllByPost(postId: string): import(".prisma/client").Prisma.PrismaPromise<({
        author: {
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.VisibilityStatus;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
    })[]>;
    findOne(id: string): Promise<{
        author: {
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.VisibilityStatus;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
    }>;
    update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.VisibilityStatus;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
