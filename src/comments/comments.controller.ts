import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { CommentDto } from './dto/comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get(':id')
  async getPostComments(@Param('id') id: string) {
    return this.commentsService.getPostComments(id);
  }

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  async createPostComment(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() commentDto: CommentDto,
  ) {
    return this.commentsService.createPostComment(id, user, commentDto);
  }
}
