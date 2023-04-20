import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async getAllCategories(): Promise<Category[]> {
    const categories = await this.prismaService.category.findMany();

    return categories;
  }
}
