import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { JWTPayload, JWTResponse } from "src/models/jwt-payload.model";

@Injectable()
export class JWTHelperService {
    /**
     *
     */
    constructor(
       private config : ConfigService,
       private jwt: JwtService,
    ) {

    }
    responseJwt = (response: JWTResponse): JWTResponse => response;

    async signToken(payload : JWTPayload, expiresIn: string
      ): Promise<string> {
        
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
          expiresIn: expiresIn,
          secret: secret,
        });
    
        return token;
      }

    async readToken (token :string) :Promise <JWTResponse>{
        try{
        const secret = this.config.get('JWT_SECRET');
        const payload = await this.jwt.verifyAsync(token,{secret:secret});
       


    const expiryDate = new Date(payload.exp *1000);
    const intitiationTime = new Date(payload.iat *1000);
    return this.responseJwt({
        expiryTime:expiryDate,
        intitiationTime:intitiationTime,
        ...payload
    })
}
catch(error){
    return null;
}
    }
}