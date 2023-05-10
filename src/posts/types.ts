import { Category, Post } from '@prisma/client';
import { UserProfile } from 'src/auth/types';
import { Nullable, Pagination, SortInput } from 'src/shared/types';

export type PostItem = Omit<Post, 'content'> & {
  categories: Category[];
  author: UserProfile;
};

export type PostDetail = Post & {
  categories: Category[];
  author: UserProfile;
};

export type MyPostsInput = {
  title: Nullable<string>;
  perex: Nullable<string>;
} & SortInput &
  Omit<Pagination, 'count'>;

export type PostsResponse = {
  posts: PostItem[];
  pagination: Pagination;
};
