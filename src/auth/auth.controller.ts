import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  SigninCredentialsDto,
  SignupCredentialsDto,
  UpdateUserDto,
} from './dto/auth-credentials.dto';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from '@prisma/client';
import { AuthPayload } from './types';
import { refreshTokenCookieName } from 'src/shared/constants';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  },
);

const cookieExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[refreshTokenCookieName];
  }
  return token;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupCredentialsDto: SignupCredentialsDto) {
    return this.authService.signup(signupCredentialsDto);
  }

  @Post('signin')
  async signin(
    @Body() signinCredentialsDto: SigninCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthPayload> {
    const {
      id,
      username,
      accessToken,
      refreshToken,
      firstName,
      lastName,
      createdAt,
    } = await this.authService.signin(signinCredentialsDto);

    res.cookie(refreshTokenCookieName, refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return {
      id,
      username,
      firstName,
      lastName,
      createdAt,
      accessToken,
    };
  }

  @Post('refresh')
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<{ accessToken: string }> {
    const token = cookieExtractor(req);

    const { accessToken, refreshToken } = await this.authService.refreshToken(
      token,
    );

    res.cookie(refreshTokenCookieName, refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken: accessToken };
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<boolean> {
    const token = cookieExtractor(req);

    if (!token) {
      return false;
    }

    res.clearCookie(refreshTokenCookieName, { httpOnly: true, secure: true });
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getUser(@GetUser() user: User) {
    return this.authService.getUser(user);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  updateUser(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(user, updateUserDto);
  }

  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  deleteUser(@GetUser() user: User) {
    return this.authService.deleteUser(user);
  }
}
