import { ApiProperty } from '@nestjs/swagger';

export class LocalLoginDto {
  @ApiProperty()
  usernameOrEmail: string;
  @ApiProperty()
  password: string;
}
