import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
