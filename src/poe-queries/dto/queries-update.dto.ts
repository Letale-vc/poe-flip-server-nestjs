import { IsEmpty, IsString, IsUUID } from 'class-validator';

export class QueryFlipDto {
  @IsString()
  @IsEmpty()
  cardQuery: string;
  @IsString()
  @IsEmpty()
  itemQuery: string;

  @IsUUID()
  @IsEmpty()
  uuid: string;
}
