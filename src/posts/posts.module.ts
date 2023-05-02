import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [PostsController],
  providers: [PrismaService, PostsService],
  imports: [DatabaseModule],
})
export class PostsModule {}
