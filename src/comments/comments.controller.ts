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
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Comment, CommentWithAuthor } from './swagger/responses';
import { DeleteResponse } from 'src/shared/dto.swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get(':postId')
  @ApiOkResponse({ type: CommentWithAuthor, isArray: true })
  async getPostComments(@Param('postId') postId: string) {
    return this.commentsService.getPostComments(postId);
  }

  @Post(':postId')
  @ApiCreatedResponse({ type: Comment })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Post does not exist' })
  @UseGuards(AuthGuard('jwt'))
  async createPostComment(
    @GetUser() user: User,
    @Param('postId') postId: string,
    @Body() commentDto: CommentDto,
  ) {
    return this.commentsService.createPostComment(postId, user, commentDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: DeleteResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Comment does not exist' })
  @UseGuards(AuthGuard('jwt'))
  async deletePostComment(@GetUser() user: User, @Param('id') id: string) {
    return this.commentsService.deletePostComment(id, user);
  }
}
