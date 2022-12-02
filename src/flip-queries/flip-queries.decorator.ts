import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export const FlipQueriesValidBody = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const queries = request.body;
    try {
      const cardQuery = JSON.parse(queries.cardQuery);
      const itemQuery = JSON.parse(queries.itemQuery);
      if (typeof cardQuery === 'object' && typeof itemQuery === 'object')
        return queries;
      throw new HttpException(
        { error: 'Bed request', status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    } catch (e) {
      throw new HttpException(
        { error: 'Bed request', status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
  },
);
