import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostDetail, PostItem } from './types';
import { PostDto } from './dto/post.dto';
import { exclude } from 'src/utils';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}

  async getAllPosts(): Promise<PostItem[]> {
    const allPosts = await this.prismaService.post.findMany({
      include: {
        categories: true,
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            createdAt: true,
          },
        },
      },
    });

    const returnedProsts = allPosts.map((post) => exclude(post, ['content']));

    return returnedProsts;
  }

  async getMyPosts(user: User): Promise<PostItem[]> {
    const myPosts = await this.prismaService.post.findMany({
      where: {
        authorId: user.id,
      },
      include: {
        categories: true,
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            createdAt: true,
          },
        },
      },
    });

    const returnedProsts = myPosts.map((post) => exclude(post, ['content']));

    return returnedProsts;
  }

  async createPost(user: User, post: PostDto): Promise<Post> {
    const { id } = user;
    const { title, perex, content } = post;

    const slug = title
      .split(' ')
      .map((word) => word.toLowerCase())
      .join('-');

    const categories = await this.prismaService.category.findMany({
      where: { id: { in: post.categories.map((category) => category.id) } },
    });

    const createdPost = await this.prismaService.post.create({
      data: {
        title,
        perex,
        content,
        slug,
        categories: {
          connect: categories,
        },
        author: {
          connect: {
            id,
          },
        },
      },
    });

    return createdPost;
  }

  async updatePost(id: string, user: User, post: PostDto): Promise<PostDetail> {
    const foundPost = await this.prismaService.post.findUnique({
      where: {
        id,
      },
      select: {
        authorId: true,
      },
    });

    if (foundPost.authorId !== user.id) {
      throw new UnauthorizedException('You cannot update this post');
    }

    const { title, perex, content } = post;

    const slug = title
      .split(' ')
      .map((word) => word.toLowerCase())
      .join('-');

    const categories = await this.prismaService.category.findMany({
      where: { id: { in: post.categories.map((category) => category.id) } },
    });

    const updatedPost = await this.prismaService.post.update({
      where: {
        id,
      },
      data: {
        title,
        perex,
        content,
        slug,
        categories: {
          connect: categories,
        },
        author: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            createdAt: true,
          },
        },
        categories: true,
      },
    });

    if (!updatedPost) {
      throw new NotFoundException();
    }

    return updatedPost;
  }

  async getPostById(id: string): Promise<PostDetail> {
    const post = await this.prismaService.post.findUnique({
      where: {
        id,
      },
      include: {
        categories: true,
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            createdAt: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async deletePost(id: string, user: User): Promise<string> {
    const foundPost = await this.prismaService.post.findUnique({
      where: {
        id,
      },
      select: {
        authorId: true,
      },
    });

    if (foundPost.authorId !== user.id) {
      throw new UnauthorizedException('You cannot delete this post');
    }

    const postComments = await this.prismaService.comment.findMany({
      where: {
        postId: id,
      },
    });

    postComments.forEach(
      async (comment) =>
        await this.prismaService.like.deleteMany({
          where: {
            commentId: comment.id,
          },
        }),
    );

    await this.prismaService.comment.deleteMany({
      where: {
        postId: id,
      },
    });

    await this.prismaService.post.delete({
      where: {
        id,
      },
    });

    return id;
  }
}
