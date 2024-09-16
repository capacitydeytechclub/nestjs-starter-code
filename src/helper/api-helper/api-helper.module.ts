import { Module } from "@nestjs/common";
import { ApiHelperService } from "./api-helper.service";
import { ApiHelperController } from "./api-helper.controller";

@Module({
  providers: [ApiHelperService],
  controllers: [ApiHelperController],
})
export class ApiHelperModule {}