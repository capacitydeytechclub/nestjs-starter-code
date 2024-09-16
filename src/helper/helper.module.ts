import { Global, Module } from "@nestjs/common";
import { HelperService } from "./helper.service";
import { ResponseHelperService } from "./response-helper.service";
import { RegisterResponseModel, VerifyUserResponseModel } from "src/models/authentication.model";
import { JwtModule } from "@nestjs/jwt";
import { JWTHelperService } from "./jwt-helper.service";
import { AdminResponseModel } from 'src/models/admin.model';
import { ApiHelperService } from './api-helper/api-helper.service';
import { UserModel } from "src/models/user.model";

@Global()
@Module({
    imports:[JwtModule.register({})],
    providers :[HelperService,JWTHelperService,
                ResponseHelperService<RegisterResponseModel>,
                ResponseHelperService<VerifyUserResponseModel>,
                ResponseHelperService<VerifyUserResponseModel>,
                ResponseHelperService<AdminResponseModel>,
                ResponseHelperService<AdminResponseModel[]>,
                ResponseHelperService<UserModel>,
                ResponseHelperService<UserModel[]>,
                ApiHelperService,],
     exports : [HelperService, JWTHelperService,
                ResponseHelperService<RegisterResponseModel>,
                ResponseHelperService<VerifyUserResponseModel>,
                ResponseHelperService<VerifyUserResponseModel>,
                ResponseHelperService<AdminResponseModel>,
                ResponseHelperService<AdminResponseModel[]>,
                ResponseHelperService<UserModel>,
                ResponseHelperService<UserModel[]>,
                ApiHelperService,]
})
export class HelperModule {}
