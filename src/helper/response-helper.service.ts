import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ResponseModel } from 'src/models/global.model';

@Injectable()
export class ResponseHelperService<T> {
  returnSuccessObject(message: string, data?: T): ResponseModel<T> {
    return {
      isSuccessful: true,
      message: message,
      data: data,
    };
  }
  returnBadRequest(message: string, data?: T): ResponseModel<T> {
    throw new BadRequestException({
      isSuccessful: false,
      message: message,
      data: data,
    });
  }
  returnNotFound(message: string) {
    throw new NotFoundException({
      isSuccessful: false,
      message: message,
    });
  }
  returnForbidden(message: string) {
    throw new ForbiddenException({
      isSuccessful: false,
      message: message,
    });
  }
  returnBadGateway(message: string) {
    throw new BadGatewayException({
      isSuccessful: false,
      message: message,
    });
  }
  returnInternalServer(message: string) {
    throw new InternalServerErrorException({
      isSuccessful: false,
      message: message,
    });
  }
  returnUnAuthorized(message: string) {
    throw new UnauthorizedException({
      isSuccessful: false,
      message: message,
    });
  }
  returnConflict(message: string) {
    throw new ConflictException({
      isSuccessful: false,
      message: message,
    });
  }
}
