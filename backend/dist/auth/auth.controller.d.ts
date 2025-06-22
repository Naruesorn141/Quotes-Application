import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    register(dto: RegisterDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        email: string;
        hashedPassword: string;
        role: string;
    }, unknown, never> & {}>;
}
export {};
