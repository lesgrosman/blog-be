import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostDetail, PostItem, MyPostsInput, PostsResponse } from './types';
import { PostDto } from './dto/post.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    private readonly dbService: DatabaseService,
  ) {}

  async getAllPosts(): Promise<PostItem[]> {
    const allPosts = await this.dbService.findAllPosts();

    return allPosts;
  }

  async getMyPosts(filter: MyPostsInput, user: User): Promise<PostsResponse> {
    const myPosts = await this.dbService.findMyPosts(filter, user.id);

    return myPosts;
  }

  async createPost(user: User, post: PostDto): Promise<Post> {
    const { id } = user;
    const createdPost = await this.dbService.createPost(id, post);

    return createdPost;
  }

  async updatePost(id: string, user: User, post: PostDto): Promise<PostDetail> {
    const foundPost = await this.prismaService.post.findUnique({
      where: {
        id,
      },
    });

    if (!foundPost) {
      throw new NotFoundException('Post does not exist');
    }

    if (foundPost.authorId !== user.id) {
      throw new UnauthorizedException('You cannot update this post');
    }

    const updatedPost = await this.dbService.updatePost(id, user.id, post);

    if (!updatedPost) {
      throw new NotFoundException();
    }

    return updatedPost;
  }

  async getPostById(id: string): Promise<PostDetail> {
    const post = await this.dbService.findPostById(id);

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async deletePost(id: string, user: User): Promise<{ id: string }> {
    const foundPost = await this.prismaService.post.findUnique({
      where: {
        id,
      },
      select: {
        authorId: true,
      },
    });

    if (!foundPost) {
      throw new NotFoundException('Post does not exist');
    }

    if (foundPost.authorId !== user.id) {
      throw new UnauthorizedException('You cannot delete this post');
    }

    const deleteId = await this.dbService.deletePost(id);

    return {
      id: deleteId,
    };
  }
}
