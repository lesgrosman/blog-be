import { Category, Post } from '@prisma/client';
import { UserProfile } from 'src/auth/types';

export type PostItem = Omit<Post, 'content'> & {
  categories: Category[];
  author: UserProfile;
};

export type PostDetail = Post & {
  categories: Category[];
  author: UserProfile;
};
