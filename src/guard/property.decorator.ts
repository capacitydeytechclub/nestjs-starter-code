import { SetMetadata } from '@nestjs/common';
import { AuthGuardType } from 'src/models/global.model';

export const AccountTypes = (...accountTypes: AuthGuardType[]) => SetMetadata('accountTypes', accountTypes);
