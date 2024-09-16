import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseModel } from 'src/models/global.model';

@Injectable()
export class PaginationHelperService<T> {
  returnSuccessObjectWithPagination(
    message: string,
    data: T,
    pagination: any,
  ): ResponseModel<T> {
    return {
      isSuccessful: true,
      message: message,
      data: data,
      pagination: pagination,
    };
  }

  returnNotFound(message: string) {
    throw new NotFoundException({
      isSuccessful: true,
      message: message,
    });
  }
}
