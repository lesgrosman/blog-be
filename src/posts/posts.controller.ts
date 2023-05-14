import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '@prisma/client';
import {
  MyPostsResponse,
  PostDetailResponse,
  PostItemResponse,
  PostResponse,
} from './swagger/responses';
import { MyPostsInput } from './types';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostDto } from './dto/post.dto';
import { DeleteResponse } from 'src/shared/dto.swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  @ApiOkResponse({ type: PostItemResponse, isArray: true })
  async getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get('my-posts')
  @ApiOkResponse({ type: MyPostsResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  async getMyPosts(@Query() filter: MyPostsInput, @GetUser() user: User) {
    return this.postsService.getMyPosts(filter, user);
  }

  @Get(':id')
  @ApiOkResponse({ type: PostDetailResponse })
  async getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Post()
  @ApiCreatedResponse({ type: PostResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  async createPost(@GetUser() user: User, @Body() postDto: PostDto) {
    return this.postsService.createPost(user, postDto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: PostDetailResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard('jwt'))
  async updatePost(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() postDto: PostDto,
  ) {
    return this.postsService.updatePost(id, user, postDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: DeleteResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  deleteTask(@GetUser() user: User, @Param('id') id: string) {
    return this.postsService.deletePost(id, user);
  }
}
