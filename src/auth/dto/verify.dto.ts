import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(6)
    @ApiProperty()
    otp: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    token: string;
}