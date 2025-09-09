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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PostsService = class PostsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPostDto, author) {
        const { tags, ...postData } = createPostDto;
        return this.prisma.post.create({
            data: {
                ...postData,
                authorId: author.id,
                tags: {
                    create: tags?.map((tagName) => ({
                        tag: {
                            connectOrCreate: {
                                where: { name: tagName },
                                create: { name: tagName },
                            },
                        },
                    })),
                },
            },
            include: { tags: { select: { tag: true } } },
        });
    }
    findAll() {
        return this.prisma.post.findMany({
            where: { status: client_1.VisibilityStatus.VISIBLE },
            include: {
                author: { select: { id: true, email: true } },
                tags: { select: { tag: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const post = await this.prisma.post.findUnique({
            where: { id, status: client_1.VisibilityStatus.VISIBLE },
            include: {
                author: { select: { id: true, email: true } },
                tags: { select: { tag: true } },
            },
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID "${id}" not found`);
        }
        return post;
    }
    async update(id, updatePostDto, userId) {
        const post = await this.prisma.post.findUnique({ where: { id } });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID "${id}" not found`);
        }
        if (post.authorId !== userId) {
            throw new common_1.NotFoundException(`Post with ID "${id}" not found`);
        }
        const { tags, ...postData } = updatePostDto;
        return this.prisma.post.update({
            where: { id },
            data: {
                ...postData,
                tags: tags
                    ? {
                        deleteMany: {},
                        create: tags.map((tagName) => ({
                            tag: {
                                connectOrCreate: {
                                    where: { name: tagName },
                                    create: { name: tagName },
                                },
                            },
                        })),
                    }
                    : undefined,
            },
            include: { tags: { select: { tag: true } } },
        });
    }
    async remove(id, userId) {
        const post = await this.prisma.post.findUnique({ where: { id } });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID "${id}" not found`);
        }
        if (post.authorId !== userId) {
            throw new common_1.NotFoundException(`Post with ID "${id}" not found`);
        }
        await this.prisma.post.delete({ where: { id } });
        return { message: 'Post deleted successfully' };
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map