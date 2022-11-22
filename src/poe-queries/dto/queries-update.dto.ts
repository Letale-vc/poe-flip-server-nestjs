import { IsNotEmpty, IsString, IsUUID } from '@nestjs/class-validator';

export class QueryFlipDto {
  @IsString()
  @IsNotEmpty()
  cardQuery: string;
  @IsString()
  @IsNotEmpty()
  itemQuery: string;

  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}
