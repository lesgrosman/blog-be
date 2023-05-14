import { ApiProperty } from '@nestjs/swagger';
import { exapmlePost } from './constants';

export class Pagination {
  limit: number;
  offset: number;
  count: number;
}

export class Category {
  id: string;
  name: string;
  slug: string;
}

export class UserProfile {
  id: string;
  createdAt: Date;
  username: string;
  firstName: string;
  lastName: string;
}

export class DeleteResponse {
  @ApiProperty({
    example: exapmlePost.id,
  })
  id: string;
}
