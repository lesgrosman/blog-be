import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PostComment } from './types';
import { CommentDto } from './dto/comment.dto';
import { Comment, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(
    private dbService: DatabaseService,
    private prismaService: PrismaService,
  ) {}

  async getPostComments(postId: string): Promise<PostComment[]> {
    return this.dbService.findPostComments(postId);
  }

  async createPostComment(
    postId: string,
    user: User,
    comment: CommentDto,
  ): Promise<Comment> {
    const { id: userId } = user;

    const post = await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post does not exist');
    }

    return this.dbService.createPostComment(postId, userId, comment);
  }
}
