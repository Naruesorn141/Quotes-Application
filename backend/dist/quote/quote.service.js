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
exports.QuoteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuoteService = class QuoteService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const { search, author, sort } = params;
        return this.prisma.quote.findMany({
            where: {
                AND: [
                    search ? { text: { contains: search } } : {},
                    author ? { author: { contains: author } } : {},
                ],
            },
            orderBy: sort ? { createdAt: sort === 'asc' ? 'asc' : 'desc' } : { createdAt: 'desc' },
            include: { votes: true },
        });
    }
    async findOne(id) {
        return this.prisma.quote.findUnique({ where: { id }, include: { votes: true } });
    }
    async create(data, userId) {
        return this.prisma.quote.create({
            data: {
                text: data.text,
                author: data.author || '',
                creator: { connect: { id: userId } },
            },
        });
    }
    async update(id, data, userId) {
        return this.prisma.quote.update({
            where: { id },
            data: {
                text: data.text,
                author: data.author || '',
            },
        });
    }
    async delete(id, userId) {
        return this.prisma.quote.delete({ where: { id } });
    }
    async canEditOrDelete(id) {
        const quote = await this.prisma.quote.findUnique({ where: { id }, include: { votes: true } });
        if (!quote)
            throw new common_1.NotFoundException('Quote not found');
        return quote.votes.length === 0;
    }
    async vote(userId, quoteId) {
        const existing = await this.prisma.vote.findUnique({ where: { userId_quoteId: { userId, quoteId } } });
        if (existing)
            throw new common_1.ForbiddenException('You have already voted for this quote');
        return this.prisma.vote.create({ data: { userId, quoteId } });
    }
};
QuoteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuoteService);
exports.QuoteService = QuoteService;
//# sourceMappingURL=quote.service.js.map