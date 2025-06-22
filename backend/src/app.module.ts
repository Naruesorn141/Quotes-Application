import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';          
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';         
import { QuoteModule } from './quote/quote.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    QuoteModule,
  ],
})
export class AppModule {}