import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupCredentialsDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  username: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @MinLength(9)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;
}

export class SigninCredentialsDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  username: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @MinLength(9)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  lastName: string;
}
