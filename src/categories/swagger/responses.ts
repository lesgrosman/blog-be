import { ApiProperty } from '@nestjs/swagger';
import { exapmlePost } from 'src/shared/constants';

export class CategoriesResponse {
  @ApiProperty({
    example: exapmlePost.id,
  })
  id: string;
  @ApiProperty({
    example: 'Nice category',
  })
  name: string;
  @ApiProperty({
    example: 'nice-category',
  })
  slug: string;
}
