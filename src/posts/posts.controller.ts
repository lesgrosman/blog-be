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
import { PostDto } from './dto/post.dto';
import { MyPostsInput } from './types';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get('my-posts')
  @UseGuards(AuthGuard('jwt'))
  async getMyPosts(@Query() filter: MyPostsInput, @GetUser() user: User) {
    return this.postsService.getMyPosts(filter, user);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createPost(@GetUser() user: User, @Body() postDto: PostDto) {
    return this.postsService.createPost(user, postDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updatePost(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() postDto: PostDto,
  ) {
    return this.postsService.updatePost(id, user, postDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteTask(@GetUser() user: User, @Param('id') id: string) {
    return this.postsService.deletePost(id, user);
  }
}
