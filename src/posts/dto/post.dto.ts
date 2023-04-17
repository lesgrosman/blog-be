import { Category } from '@prisma/client';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class PostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  perex: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsArray()
  categories: Category[];
}
