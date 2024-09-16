import { ApiProperty } from '@nestjs/swagger';

export class LocationResponseModel {
  @ApiProperty({
    description: 'The location of the user ',
    title: 'Location',
  })
  location?: string;
}
