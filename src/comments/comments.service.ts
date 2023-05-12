import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

    const post = await this.dbService.findPostById(postId);

    if (!post) {
      throw new NotFoundException('Post does not exist');
    }

    return this.dbService.createPostComment(postId, userId, comment);
  }

  async deletePostComment(id: string, user: User): Promise<{ id: string }> {
    const comment = await this.dbService.findPostCommentById(id);

    if (!comment) {
      throw new NotFoundException('Comment does not exist');
    }

    if (comment.authorId !== user.id) {
      throw new UnauthorizedException('You cannot delete this comment');
    }

    const { id: commentId } = await this.dbService.deletePostComment(id);

    return { id: commentId };
  }
}
