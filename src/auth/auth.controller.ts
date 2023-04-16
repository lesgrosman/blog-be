import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  SigninCredentialsDto,
  SignupCredentialsDto,
  UpdateUserDto,
} from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupCredentialsDto: SignupCredentialsDto) {
    return this.authService.signup(signupCredentialsDto);
  }

  @Post('signin')
  signin(@Body() signinCredentialsDto: SigninCredentialsDto) {
    return this.authService.signin(signinCredentialsDto);
  }

  @Get('me')
  @UseGuards(AuthGuard())
  getUser(@GetUser() user: User) {
    return this.authService.getUser(user);
  }

  @Patch('me')
  @UseGuards(AuthGuard())
  updateUser(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(user, updateUserDto);
  }

  @Delete('me')
  @UseGuards(AuthGuard())
  deleteUser(@GetUser() user: User) {
    return this.authService.deleteUser(user);
  }
}
