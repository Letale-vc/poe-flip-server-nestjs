import { IsEmpty, IsString } from 'class-validator';

export class QueriesUpdateDto {
  @IsString()
  @IsEmpty()
  cardQuery: string;
  @IsString()
  @IsEmpty()
  itemQuery: string;
}
