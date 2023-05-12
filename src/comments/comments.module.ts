import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DatabaseModule } from 'src/database/database.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  controllers: [CommentsController],
  providers: [PrismaService, CommentsService],
  imports: [DatabaseModule],
})
export class CommentsModule {}
