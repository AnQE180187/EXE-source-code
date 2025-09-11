import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(postId: string, createCommentDto: Omit<CreateCommentDto, 'postId'>, req: Request): Promise<{
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
    findOne(commentId: string): Promise<{
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
    update(commentId: string, updateCommentDto: UpdateCommentDto, req: Request): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.VisibilityStatus;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
    }>;
    remove(commentId: string, req: Request): Promise<void>;
}
