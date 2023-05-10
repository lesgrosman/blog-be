import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { UpdateUserDto } from 'src/auth/dto/auth-credentials.dto';
import { UserProfile } from 'src/auth/types';
import { PostDto } from 'src/posts/dto/post.dto';
import {
  MyPostsInput,
  PostDetail,
  PostItem,
  PostsResponse,
} from 'src/posts/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { SortInput } from 'src/shared/types';
import { exclude } from 'src/utils';

@Injectable()
export class DatabaseService {
  constructor(private prisma: PrismaService) {}

  // user
  async findUser(id: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const foundUser = exclude(user, ['password', 'updatedAt']);

    return foundUser;
  }

  async updateUser(
    userId: string,
    userDto: UpdateUserDto,
  ): Promise<UserProfile> {
    const { firstName, lastName } = userDto;

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName,
        lastName,
      },
    });

    const updatedUser = exclude(user, ['password', 'updatedAt']);

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.comment.deleteMany({
      where: {
        authorId: id,
      },
    });

    await this.prisma.post.deleteMany({
      where: {
        authorId: id,
      },
    });

    await this.prisma.like.deleteMany({
      where: {
        authorId: id,
      },
    });

    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  // posts
  async findAllPosts(): Promise<PostItem[]> {
    const list = await this.prisma.post.findMany({
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

    const resultList = list.map((post) => exclude(post, ['content']));

    return resultList;
  }

  async findMyPosts(
    filter: MyPostsInput,
    userId: string,
  ): Promise<PostsResponse> {
    const where = this.createMyPostsWhere(filter, userId);
    const orderBy = this.createSort({
      sortBy: filter.sortBy,
      order: filter.order,
    });

    const offset = +filter.offset || 0;
    const limit = +filter.limit || 0;

    const list = await this.prisma.post.findMany({
      where,
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
      orderBy,
      skip: offset,
      take: limit,
    });
    const count = await this.prisma.post.count({ where });

    const resultList = list.map((post) => exclude(post, ['content']));

    return {
      posts: resultList,
      pagination: {
        limit,
        offset,
        count,
      },
    };
  }

  async findPostById(id: string): Promise<PostDetail> {
    const post = await this.prisma.post.findUnique({
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

    return post;
  }

  async createPost(userId: string, postDto: PostDto): Promise<Post> {
    const { title, perex, content, categories } = postDto;
    const slug = title
      .split(' ')
      .map((word) => word.toLowerCase())
      .join('-');

    const newCategories = await this.prisma.category.findMany({
      where: { id: { in: categories.map((category) => category.id) } },
    });

    const createdPost = await this.prisma.post.create({
      data: {
        title,
        perex,
        content,
        slug,
        categories: {
          connect: newCategories.map((category) => ({ id: category.id })),
        },
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return createdPost;
  }

  async updatePost(id: string, userId: string, post: PostDto) {
    const { title, perex, content, categories } = post;

    const slug = title
      .split(' ')
      .map((word) => word.toLowerCase())
      .join('-');

    const unusedCategories = await this.prisma.category.findMany({
      where: { id: { notIn: categories.map((category) => category.id) } },
    });

    const newCategories = await this.prisma.category.findMany({
      where: { id: { in: categories.map((category) => category.id) } },
    });

    const updatedPost = await this.prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        perex,
        content,
        slug,
        categories: {
          disconnect: unusedCategories.map((category) => ({ id: category.id })),
          connect: newCategories.map((category) => ({ id: category.id })),
        },
        author: {
          connect: {
            id: userId,
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

    return updatedPost;
  }

  async deletePost(id: string): Promise<string> {
    const postComments = await this.prisma.comment.findMany({
      where: {
        postId: id,
      },
    });

    postComments.forEach(
      async (comment) =>
        await this.prisma.like.deleteMany({
          where: {
            commentId: comment.id,
          },
        }),
    );

    await this.prisma.comment.deleteMany({
      where: {
        postId: id,
      },
    });

    await this.prisma.post.delete({
      where: {
        id,
      },
    });

    return id;
  }

  private createMyPostsWhere(filter: MyPostsInput, userId: string): object {
    const where: any = {};

    where.authorId = userId;
    if (filter.title !== undefined) {
      where.title = {
        contains: filter.title,
        mode: 'insensitive',
      };
    }
    if (filter.perex !== undefined) {
      where.perex = {
        contains: filter.perex,
        mode: 'insensitive',
      };
    }
    return where;
  }

  private createSort(sort: SortInput) {
    const field: any = {};
    const sorting = [];
    if (sort && sort.sortBy) {
      field[sort.sortBy] = sort.order.toLocaleLowerCase();
      sorting.push(field);
    }
    return sorting;
  }
}
