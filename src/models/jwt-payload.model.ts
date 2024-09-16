export class JWTPayload {
  userId: string;
  businessId?: string;
  otp?: string;
  resendTime?: number;
  requestType: JWTRequestType;
  nextCallTimeKey?: any;
  calls?: number;
}
export enum JWTRequestType {
  Login = 'login',
  UserVerification = 'user-verification',
  BusinessVerification = 'business-verification',
  ResetPassword = 'request-password',
}
export class JWTResponse extends JWTPayload {
  expiryTime: Date;
  intitiationTime: Date;
  data: string;
}
