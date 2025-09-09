"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CommentsService = class CommentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCommentDto, author) {
        const { postId, ...commentData } = createCommentDto;
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID "${postId}" not found`);
        }
        return this.prisma.comment.create({
            data: {
                ...commentData,
                postId,
                authorId: author.id,
            },
        });
    }
    findAllByPost(postId) {
        return this.prisma.comment.findMany({
            where: { postId, status: client_1.VisibilityStatus.VISIBLE },
            include: { author: { select: { id: true, email: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }
    async findOne(id) {
        const comment = await this.prisma.comment.findUnique({
            where: { id, status: client_1.VisibilityStatus.VISIBLE },
            include: { author: { select: { id: true, email: true } } },
        });
        if (!comment) {
            throw new common_1.NotFoundException(`Comment with ID "${id}" not found`);
        }
        return comment;
    }
    async update(id, updateCommentDto, userId) {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment) {
            throw new common_1.NotFoundException(`Comment with ID "${id}" not found`);
        }
        if (comment.authorId !== userId) {
            throw new common_1.NotFoundException(`Comment with ID "${id}" not found`);
        }
        return this.prisma.comment.update({
            where: { id },
            data: updateCommentDto,
        });
    }
    async remove(id, userId) {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment) {
            throw new common_1.NotFoundException(`Comment with ID "${id}" not found`);
        }
        if (comment.authorId !== userId) {
            throw new common_1.NotFoundException(`Comment with ID "${id}" not found`);
        }
        await this.prisma.comment.delete({ where: { id } });
        return { message: 'Comment deleted successfully' };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map