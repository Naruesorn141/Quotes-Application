import { PrismaService } from '../prisma/prisma.service';
export declare class QuoteService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(params: {
        search?: string;
        author?: string;
        sort?: string;
    }): Promise<({
        votes: (import("@prisma/client/runtime").GetResult<{
            id: string;
            userId: string;
            quoteId: string;
            createdAt: Date;
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        text: string;
        author: string;
        createdAt: Date;
        createdBy: string;
    }, unknown, never> & {})[]>;
    findOne(id: string): Promise<{
        votes: (import("@prisma/client/runtime").GetResult<{
            id: string;
            userId: string;
            quoteId: string;
            createdAt: Date;
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        text: string;
        author: string;
        createdAt: Date;
        createdBy: string;
    }, unknown, never> & {}>;
    create(data: any, userId: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        text: string;
        author: string;
        createdAt: Date;
        createdBy: string;
    }, unknown, never> & {}>;
    update(id: string, data: any, userId: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        text: string;
        author: string;
        createdAt: Date;
        createdBy: string;
    }, unknown, never> & {}>;
    delete(id: string, userId: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        text: string;
        author: string;
        createdAt: Date;
        createdBy: string;
    }, unknown, never> & {}>;
    canEditOrDelete(id: string): Promise<boolean>;
    vote(userId: string, quoteId: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        userId: string;
        quoteId: string;
        createdAt: Date;
    }, unknown, never> & {}>;
}
