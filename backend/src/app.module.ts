import { Module } from '@nestjs/common';
import { FlavorController } from './flavor/flavor.controller';
import { FlavorService } from './flavor/flavor.service';
import { PrismaService } from '../prisma/prisma.service'
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FlavorController],
  providers: [FlavorService, PrismaService],
})
export class AppModule {}
