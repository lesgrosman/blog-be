import { Comment } from '@prisma/client';
import { UserProfile } from 'src/auth/types';

export type PostComment = Comment & {
  author: UserProfile;
};
