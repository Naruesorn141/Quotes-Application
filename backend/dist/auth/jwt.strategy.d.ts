import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: unknown[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(cs: ConfigService);
    validate(payload: {
        sub: string;
        email: string;
    }): Promise<{
        userId: string;
        email: string;
    }>;
}
export {};
