import { IsEmpty, IsString } from '@nestjs/class-validator';

export class QueriesUpdateDto {
  @IsString()
  @IsEmpty()
  cardQuery: string;
  @IsString()
  @IsEmpty()
  itemQuery: string;
}
