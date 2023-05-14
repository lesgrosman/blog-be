import { Category } from '@prisma/client';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category as CategoryClass } from 'src/shared/dto.swagger';

export class PostDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  perex: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    type: CategoryClass,
    isArray: true,
  })
  @IsArray()
  categories: Category[];
}
