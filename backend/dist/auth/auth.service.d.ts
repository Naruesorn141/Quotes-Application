import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<{
        id: string;
        email: string;
        role: string;
    }>;
    login(user: {
        id: string;
        email: string;
    }): Promise<{
        access_token: string;
    }>;
    register(dto: RegisterDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        email: string;
        hashedPassword: string;
        role: string;
    }, unknown, never> & {}>;
}
