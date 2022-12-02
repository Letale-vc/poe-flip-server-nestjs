import { IsNotEmpty, IsUUID } from '@nestjs/class-validator';

export class QueryFlipDto {
  cardQuery: string;
  itemQuery: string;

  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}
