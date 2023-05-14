import { ApiProperty } from '@nestjs/swagger';
import { exapmlePost } from 'src/shared/constants';

export class SignInResponse {
  @ApiProperty({
    example: exapmlePost.id,
  })
  id: string;
  @ApiProperty({
    example: exapmlePost.author.username,
  })
  username: string;
  @ApiProperty({
    example: exapmlePost.author.firstName,
  })
  firstName: string;
  @ApiProperty({
    example: exapmlePost.author.lastName,
  })
  lastName: string;
  @ApiProperty({
    example: exapmlePost.author.createdAt,
  })
  createdAt: Date;
  @ApiProperty({
    example: 'asd78asygfsdff7',
  })
  accessToken: string;
}

export class RefreshResponse {
  @ApiProperty({
    example: 'asd78asygfsdff7',
  })
  accessToken: string;
}
