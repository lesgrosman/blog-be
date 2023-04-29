import { User } from '@prisma/client';

export type UserProfile = Omit<User, 'password' | 'updatedAt'>;

// return to client
export type AuthPayload = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  accessToken: string;
};

// return from service to controller
export type AuthResponse = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  accessToken: string;
  refreshToken: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
