import { ApiProperty, OmitType } from '@nestjs/swagger';
import { exapmlePost } from 'src/shared/constants';
import { Category, Pagination, UserProfile } from 'src/shared/dto.swagger';

export class PostResponse {
  @ApiProperty({
    example: exapmlePost.id,
  })
  id: string;
  @ApiProperty({
    example: exapmlePost.title,
  })
  title: string;
  @ApiProperty({
    example: exapmlePost.perex,
  })
  perex: string;
  @ApiProperty({
    example: exapmlePost.content,
  })
  content: string;
  @ApiProperty({
    example: exapmlePost.createdAt,
  })
  createdAt: Date;
  @ApiProperty({
    example: exapmlePost.updatedAt,
  })
  updatedAt: Date;
  @ApiProperty({
    example: exapmlePost.slug,
  })
  slug: string;
  @ApiProperty({
    example: exapmlePost.authorId,
  })
  authorId: string;
}

export class PostDetailResponse extends PostResponse {
  @ApiProperty({
    example: exapmlePost.categories,
    isArray: true,
  })
  categories: Category[];

  @ApiProperty({
    example: exapmlePost.author,
  })
  author: UserProfile;
}

export class PostItemResponse extends OmitType(PostDetailResponse, [
  'content',
]) {}

export class MyPostsResponse {
  @ApiProperty({
    example: {
      limit: 10,
      offset: 0,
      count: 100,
    },
  })
  pagination: Pagination;

  @ApiProperty({
    example: [{ ...exapmlePost, content: undefined }],
  })
  posts: PostItemResponse;
}
