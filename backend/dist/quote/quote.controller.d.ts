import { QuoteService } from './quote.service';
export declare class QuoteController {
    private quoteService;
    constructor(quoteService: QuoteService);
    list(search?: string, author?: string, sort?: string): Promise<({
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
    getOne(id: string): Promise<{
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
    create(body: any, req: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        text: string;
        author: string;
        createdAt: Date;
        createdBy: string;
    }, unknown, never> & {}>;
    update(id: string, body: any, req: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        text: string;
        author: string;
        createdAt: Date;
        createdBy: string;
    }, unknown, never> & {}>;
    delete(id: string, req: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        text: string;
        author: string;
        createdAt: Date;
        createdBy: string;
    }, unknown, never> & {}>;
    vote(quoteId: string, req: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        userId: string;
        quoteId: string;
        createdAt: Date;
    }, unknown, never> & {}>;
}
