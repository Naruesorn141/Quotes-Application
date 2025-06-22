import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuoteService {
  constructor(private prisma: PrismaService) {}

  // List quotes with filter, search, sort
  async findAll(params: { search?: string; author?: string; sort?: string }) {
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

  // Get single quote
  async findOne(id: string) {
    return this.prisma.quote.findUnique({ where: { id }, include: { votes: true } });
  }

  // Create quote
  async create(data: any, userId: string) {
    return this.prisma.quote.create({
      data: {
        text: data.text,
        author: data.author || '',
        creator: { connect: { id: userId } }, // Assuming userId is the identifier for the creator
      },
    });
  }

  // Update quote (only if vote = 0)
  async update(id: string, data: any, userId: string) {
    return this.prisma.quote.update({
      where: { id },
      data: {
        text: data.text,
        author: data.author || '',
      },
    });
  }

  // Delete quote (only if vote = 0)
  async delete(id: string, userId: string) {
    return this.prisma.quote.delete({ where: { id } });
  }

  // Check if quote can be edited/deleted (vote = 0)
  async canEditOrDelete(id: string) {
    const quote = await this.prisma.quote.findUnique({ where: { id }, include: { votes: true } });
    if (!quote) throw new NotFoundException('Quote not found');
    return quote.votes.length === 0;
  }

  // Vote (user 1 คน vote ได้ 1 quote)
  async vote(userId: string, quoteId: string) {
    // เช็คว่า vote นี้มีอยู่แล้วหรือยัง
    const existing = await this.prisma.vote.findUnique({ where: { userId_quoteId: { userId, quoteId } } });
    if (existing) throw new ForbiddenException('You have already voted for this quote');
    return this.prisma.vote.create({ data: { userId, quoteId } });
  }
}