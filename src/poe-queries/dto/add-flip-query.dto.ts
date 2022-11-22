import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class AddFlipQueryDto {
  @IsString()
  @IsNotEmpty()
  cardQuery: string;
  @IsString()
  @IsNotEmpty()
  itemQuery: string;
}
