import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignupCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  username: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @MinLength(9)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;
}

export class SigninCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  username: string;

  @IsString()
  @MinLength(9)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;
}

export class UpdateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
