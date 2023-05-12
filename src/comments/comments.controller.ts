import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { CommentDto } from './dto/comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get(':postId')
  async getPostComments(@Param('postId') postId: string) {
    return this.commentsService.getPostComments(postId);
  }

  @Post(':postId')
  @UseGuards(AuthGuard('jwt'))
  async createPostComment(
    @GetUser() user: User,
    @Param('postId') postId: string,
    @Body() commentDto: CommentDto,
  ) {
    return this.commentsService.createPostComment(postId, user, commentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deletePostComment(@GetUser() user: User, @Param('id') id: string) {
    return this.commentsService.deletePostComment(id, user);
  }
}
