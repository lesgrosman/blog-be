import { ApiProperty } from '@nestjs/swagger';
import { exampleComment } from 'src/shared/constants';
import { UserProfile } from 'src/shared/dto.swagger';

export class Comment {
  @ApiProperty({
    example: exampleComment.id,
  })
  id: string;

  @ApiProperty({
    example: exampleComment.content,
  })
  content: string;

  @ApiProperty({
    example: exampleComment.authorId,
  })
  authorId: string;

  @ApiProperty({
    example: exampleComment.postId,
  })
  postId: string;

  @ApiProperty({
    example: exampleComment.createdAt,
  })
  createdAt: Date;

  @ApiProperty({
    example: exampleComment.updatedAt,
  })
  updatedAt: Date;
}

export class CommentWithAuthor extends Comment {
  @ApiProperty({
    example: exampleComment.author,
  })
  author: UserProfile;
}
