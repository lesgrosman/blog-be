import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  SignupCredentialsDto,
  SigninCredentialsDto,
  UpdateUserDto,
} from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AuthResponse, Tokens, UserProfile } from './types';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly dbService: DatabaseService,
  ) {}

  async signup(signupCredentialsDto: SignupCredentialsDto): Promise<void> {
    const { username, password, firstName, lastName } = signupCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const isExistedUser = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (isExistedUser) {
      throw new ConflictException('The username is already exists');
    }

    try {
      await this.prismaService.user.create({
        data: {
          username,
          password: hashedPassword,
          firstName,
          lastName,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async signin(
    signinCredentialsDto: SigninCredentialsDto,
  ): Promise<AuthResponse> {
    const { username, password } = signinCredentialsDto;

    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username, id: user.id };
      const accessToken = await this.jwtService.sign(payload);
      const refreshToken = await this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        accessToken,
        refreshToken,
      };
    } else {
      throw new UnauthorizedException('Please check auth credentials');
    }
  }

  async refreshToken(token: string): Promise<Tokens> {
    try {
      const { id, username } = await this.jwtService.verify(token);

      if (!id || !username) {
        throw new BadRequestException('Bad request');
      }

      const payload: JwtPayload = { id, username };
      const accessToken = await this.jwtService.sign(payload);
      const refreshToken = await this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw new BadRequestException('Bad request');
    }
  }

  async getUser(user: User): Promise<UserProfile> {
    const { id } = user;

    const foundUser = await this.dbService.findUser(id);

    return foundUser;
  }

  async updateUser(
    user: User,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfile> {
    const { id } = user;

    const updatedUser = await this.dbService.updateUser(id, updateUserDto);

    return updatedUser;
  }

  async deleteUser(user: User): Promise<void> {
    const { id } = user;
    await this.dbService.deleteUser(id);
  }
}
