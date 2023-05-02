import { Injectable } from '@nestjs/common';
import { MyPostsResponse, MyPostsInput } from 'src/posts/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { SortInput } from 'src/shared/types';
import { exclude } from 'src/utils';

@Injectable()
export class DatabaseService {
  constructor(private prisma: PrismaService) {}

  async findMyPosts(
    filter: MyPostsInput,
    userId: string,
  ): Promise<MyPostsResponse> {
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
