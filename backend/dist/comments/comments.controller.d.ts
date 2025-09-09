import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(createCommentDto: CreateCommentDto, req: Request): Promise<{
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
    update(id: string, updateCommentDto: UpdateCommentDto, req: Request): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.VisibilityStatus;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
    }>;
    remove(id: string, req: Request): Promise<{
        message: string;
    }>;
}
